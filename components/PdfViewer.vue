<!-- components/PdfViewer.vue -->
<template>
  <div class="pdf-viewer">
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <div>Generating PDF preview...</div>
    </div>
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else ref="canvasContainer" class="canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';

const props = defineProps<{
  content: string;
}>();

const canvasContainer = ref<HTMLElement | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
let pdfDoc: any = null;
let currentPage = 1;
let pageRendering = false;
let pageNumPending: number | null = null;
let pdfjsLib: any = null;

// Clean up any resources when component is unmounted
onBeforeUnmount(() => {
  if (pdfDoc) {
    pdfDoc = null;
  }
});

// Initialize PDF.js
onMounted(async () => {
  if (process.client) {
    try {
      // Import PDF.js dynamically
      const pdfjsModule = await import('pdfjs-dist');
      pdfjsLib = pdfjsModule;

      // Set worker source - using CDN for the worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      // Generate and render PDF
      await generatePdf();
    } catch (err) {
      console.error('Error initializing PDF.js:', err);
      error.value = 'Failed to initialize PDF viewer. Please try again.';
      loading.value = false;
    }
  }
});

// Watch for content changes
watch(() => props.content, async () => {
  if (pdfjsLib && process.client) {
    loading.value = true;
    error.value = null;
    await generatePdf();
  }
});

// Generate PDF from content
async function generatePdf() {
  if (!pdfjsLib || !process.client) return;

  try {
    // Import pdfMake dynamically
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');

    // Get the default export or the module itself
    const pdfMake = pdfMakeModule.default || pdfMakeModule;

    // Manually set up the vfs with a basic font
    if (!pdfMake.vfs) {
      // @ts-ignore - We know this property might exist
      pdfMake.vfs = pdfFontsModule.pdfMake?.vfs || {};
    }

    // Create a temporary element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = props.content || '';

    // Extract text content and structure
    const pdfContent = extractPdfContent(tempDiv);

    // Define the document with basic fonts
    const docDefinition = {
      content: pdfContent,
      defaultStyle: {
        font: 'Roboto',
        fontSize: 12,
        lineHeight: 1.5
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60] as [number, number, number, number]
    };

    // Generate PDF as Blob
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBlob(async (blob: Blob) => {
      try {
        // Convert blob to array buffer
        const arrayBuffer = await blob.arrayBuffer();

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDoc = await loadingTask.promise;

        // Initial/first page rendering
        await renderPage(1);
        loading.value = false;
      } catch (err) {
        console.error('Error rendering PDF:', err);
        error.value = 'Failed to render PDF preview.';
        loading.value = false;
      }
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    error.value = 'Failed to generate PDF preview.';
    loading.value = false;
  }
}

// Render the specified page
async function renderPage(num: number) {
  if (!pdfDoc) return;

  pageRendering = true;

  try {
    // Get page
    const page = await pdfDoc.getPage(num);

    // Clear previous content
    if (canvasContainer.value) {
      canvasContainer.value.innerHTML = '';
    }

    // Calculate scale to fit the container width
    const containerWidth = canvasContainer.value?.clientWidth || 800;
    const viewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    // Create canvas for each page
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;
    canvas.className = 'pdf-page';

    // Add canvas to container
    canvasContainer.value?.appendChild(canvas);

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport: scaledViewport
    };

    await page.render(renderContext).promise;
    pageRendering = false;

    // If there's a pending page, render it
    if (pageNumPending !== null) {
      renderPage(pageNumPending);
      pageNumPending = null;
    }

    // If there are more pages, render them too
    if (num < pdfDoc.numPages) {
      renderPage(num + 1);
    }
  } catch (err) {
    console.error('Error rendering page:', err);
    pageRendering = false;
    error.value = 'Failed to render PDF page.';
  }
}

// Extract content from HTML for PDF generation
function extractPdfContent(element: HTMLElement): any[] {
  const result: any[] = [];

  // Process child nodes
  Array.from(element.childNodes).forEach((node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || '';
      if (text) {
        result.push({ text });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const nodeName = elementNode.nodeName.toLowerCase();

      // Handle different element types
      if (nodeName === 'p') {
        result.push({
          text: elementNode.textContent?.trim() || '',
          margin: [0, 5, 0, 10]
        });
      } else if (nodeName === 'h1') {
        result.push({
          text: elementNode.textContent?.trim() || '',
          fontSize: 24,
          bold: true,
          margin: [0, 10, 0, 10]
        });
      } else if (nodeName === 'h2') {
        result.push({
          text: elementNode.textContent?.trim() || '',
          fontSize: 20,
          bold: true,
          margin: [0, 10, 0, 5]
        });
      } else if (nodeName === 'h3') {
        result.push({
          text: elementNode.textContent?.trim() || '',
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        });
      } else if (nodeName === 'ul' || nodeName === 'ol') {
        const items = Array.from(elementNode.children).map(li => {
          return { text: li.textContent?.trim() || '', margin: [0, 2, 0, 2] };
        });

        result.push({
          ul: nodeName === 'ul' ? items : undefined,
          ol: nodeName === 'ol' ? items : undefined,
          margin: [0, 5, 0, 10]
        });
      } else if (nodeName === 'table') {
        // Extract table data
        const tableData: string[][] = [];
        Array.from(elementNode.querySelectorAll('tr')).forEach(row => {
          const rowData: string[] = [];
          Array.from(row.querySelectorAll('td, th')).forEach(cell => {
            rowData.push(cell.textContent?.trim() || '');
          });
          if (rowData.length > 0) {
            tableData.push(rowData);
          }
        });

        if (tableData.length > 0) {
          result.push({
            table: {
              body: tableData,
              widths: Array(tableData[0].length).fill('*')
            },
            margin: [0, 5, 0, 10]
          });
        }
      } else {
        // Recursively process other elements
        const childContent = extractPdfContent(elementNode);
        if (childContent.length > 0) {
          result.push(...childContent);
        }
      }
    }
  });

  return result;
}
</script>

<style>
.pdf-viewer {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f5f5f5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  width: 100%;
}

.pdf-page {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  background: white;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>