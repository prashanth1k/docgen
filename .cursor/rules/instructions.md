# Nuxt.js Document Generator App - Instructions for Coding LLM

## Objective:
Create a Nuxt 3 application that allows users to generate PDFs from a provided template and JSON data.  The app should have a user-friendly interface for creating and editing both the template (using a rich text editor) and the JSON data.  The generated output should be displayed in two formats: a downloadable PDF and a rich text preview. Changes in the rich text preview should be reflected in the PDF.

## Technology Stack:

*   Nuxt 3
*   Vue 3 (Composition API)
*   VueUse (`useLocalStorage`, `watchDebounced`)
*   Quill (VueQuill) - Rich Text Editor
*   jsPDF - PDF Generation
*   html2canvas - HTML to Canvas for PDF
*   vue3-json-editor - JSON Editor
*   Tailwind CSS - Styling
*  Pinia - State management

## Project Setup & Folder Structure:

1.  **Create Nuxt App:**

    ```bash
    npx nuxi@latest init docgen-app
    cd docgen-app
    npm install
    ```

2.  **Install Dependencies:**

    ```bash
    npm install @vueuse/core @vueuse/nuxt @vueup/vue-quill jspdf html2canvas vue3-json-editor @tailwindcss/typography @nuxtjs/tailwindcss pinia @pinia/nuxt
    ```

3.  **Configure Tailwind CSS:**

    *   In `nuxt.config.ts`, add:

        ```typescript
        export default defineNuxtConfig({
           modules: [
            '@nuxtjs/tailwindcss',
            '@vueuse/nuxt',
            '@pinia/nuxt'
          ],
        })
        ```

    *   Create `tailwind.config.js` in the project root:

        ```javascript
        module.exports = {
          content: [],
          theme: {
            extend: {},
          },
          plugins: [
            require('@tailwindcss/typography'),
          ],
        }
        ```
4.  **Configure Pinia**
     * In `nuxt.config.ts`, ensure `@pinia/nuxt` is included in `modules`.

5.  **Folder Structure:**

    ```
    docgen-app/
    ├── components/
    │   ├── DataEditor.vue           # JSON editor component
    │   ├── DocumentPreview.vue      # Displays the generated output (tabs)
    │   ├── RichTextEditor.vue     # Template editor component
    │   └── Toolbar.vue              # Simple toolbar
    ├── composables/                # (Optional, for custom composables)
    ├── stores/
    │   └── document.ts             # Pinia Store
    ├── pages/
    │   └── index.vue               # Main page, layout, and component integration
    ├── plugins/
    │   └── quill.ts                # (Optional - Quill plugin if needed for customization)
    └── nuxt.config.ts
    ```

## Component Implementation:

**1. `stores/document.ts` (Pinia Store):**

```typescript
// stores/document.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDocumentStore = defineStore('document', () => {
  const template = ref('<h1>Invoice</h1><p>Invoice Number: {{invoiceNumber}}</p><p>Customer: {{customerName}}</p>');
  const jsonData = ref({
    invoiceNumber: '12345',
    customerName: 'Acme Corp',
    items: [
      { description: 'Product A', quantity: 2, price: 10 },
      { description: 'Product B', quantity: 1, price: 25 },
    ],
  });
  const mergedContent = ref('');
  const isDirty = ref(false); // Flag to track changes

  return { template, jsonData, mergedContent, isDirty }
});
```


2. pages/index.vue (Main Page):

```html
<template>
  <div class="flex flex-col h-screen">
    <Toolbar />
    <div class="flex flex-1">
      <div class="w-1/2 p-4 border-r">
        <h2 class="text-lg font-bold mb-4">Template</h2>
        <RichTextEditor v-model="template" />
        <h2 class="text-lg font-bold mt-8 mb-4">Data (JSON)</h2>
        <DataEditor v-model="jsonData" />
      </div>
      <div class="w-1/2 p-4">
        <h2 class="text-lg font-bold mb-4">Generated Document</h2>
        <DocumentPreview :template="template" :jsonData="jsonData" v-model:mergedContent="mergedContent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentStore } from '~/stores/document';
import { storeToRefs } from 'pinia';

const documentStore = useDocumentStore();
const { template, jsonData, mergedContent } = storeToRefs(documentStore);

</script>
```

3. components/Toolbar.vue:

```html
<template>
  <div class="bg-blue-500 text-white p-4">
    <h1 class="text-2xl font-bold">docgen</h1>
  </div>
</template>
```

4. components/RichTextEditor.vue:

```html
<template>
  <QuillEditor
    v-model:content="editorContent"
    contentType="html"
    theme="snow"
    toolbar="full"
    @update:content="handleUpdate"
  />
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ref, watch, defineEmits, defineProps } from 'vue';
import { useDocumentStore } from '~/stores/document';

const props = defineProps<{ modelValue: string }>()
const emits = defineEmits(['update:modelValue'])
const documentStore = useDocumentStore();

const editorContent = ref(props.modelValue)

watch(()=> props.modelValue, (newVal)=>{
    if (editorContent.value !== newVal)
        editorContent.value = newVal
})
const handleUpdate = (newContent: string) => {
  documentStore.isDirty = true;
  emits('update:modelValue', newContent)
}
</script>
```


Uses the QuillEditor component from @vueup/vue-quill.

contentType="html": Specifies that the content is HTML.

theme="snow": Uses the "snow" theme (a clean, modern look).

toolbar="full": Shows the full toolbar (bold, italics, lists, etc.). You can customize this.

v-model:content: Two-way binding for the editor's content.

watch : watches for any changes in modelValue prop and updates the editor content.

handleUpdate: Updates the isDirty flag in Pinia store and emit the update:modelValue to update template content.

5. components/DataEditor.vue:

```html
<template>
  <VueJsonEditor
    v-model="editorData"
    :show-btns="false"
    :mode="'code'"
    @json-change="handleJsonChange"
  />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import VueJsonEditor from 'vue3-json-editor';
import { useDocumentStore } from '~/stores/document';

const props = defineProps<{ modelValue: object }>()
const emits = defineEmits(['update:modelValue'])
const documentStore = useDocumentStore();

const editorData = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
    if (JSON.stringify(editorData.value) !== JSON.stringify(newVal)) {
        editorData.value = newVal;
    }
})

const handleJsonChange = (newJson: object) => {
    documentStore.isDirty = true;
    emits('update:modelValue', newJson);
}
</script>
```


v-model: Two-way binding for the JSON data.

:show-btns="false": Hides the default buttons (we'll handle updates directly).

:mode="'code'": Displays the JSON in a code editor format.

@json-change: Emits an event when the JSON data changes.

watch : watches for changes in the modelValue prop and update editorData

handleJsonChange: Updates the isDirty flag in Pinia store and emit the update:modelValue to update JSON data

6. components/DocumentPreview.vue:

```html
<template>
  <div>
    <div class="mb-4">
      <button
        :class="{ 'bg-blue-500 text-white': activeTab === 'pdf', 'bg-gray-200': activeTab !== 'pdf' }"
        class="px-4 py-2 rounded-l"
        @click="activeTab = 'pdf'"
      >
        PDF
      </button>
      <button
        :class="{ 'bg-blue-500 text-white': activeTab === 'richText', 'bg-gray-200': activeTab !== 'richText' }"
        class="px-4 py-2 rounded-r"
        @click="activeTab = 'richText'"
      >
        Rich Text
      </button>
    </div>

    <div v-if="activeTab === 'pdf'">
      <div ref="pdfContainer" class="p-4 border">
        <!-- PDF content will be rendered here -->
      </div>
      <button
        class="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        @click="downloadPdf"
      >
        Download PDF
      </button>
    </div>

    <div v-else-if="activeTab === 'richText'">
      <QuillEditor
        v-model:content="mergedContent"
        contentType="html"
        theme="snow"
        @update:content="handleRichTextUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, defineProps, defineEmits } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useDebounceFn } from '@vueuse/core';
import { useDocumentStore } from '~/stores/document';


const props = defineProps<{ template: string; jsonData: object }>()
const emits = defineEmits(['update:mergedContent'])

const documentStore = useDocumentStore();
const activeTab = ref('pdf');
const pdfContainer = ref<HTMLElement | null>(null);

const mergedContent = ref(props.template); // Initialize with the template

watch(()=> props.template, ()=>{
    if(!documentStore.isDirty)
        mergedContent.value = props.template;
}, { immediate: true })

// Function to merge template and data
const mergeTemplateAndData = (template: string, data: any) => {
  let merged = template;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      merged = merged.replace(regex, data[key]);
      //Handle arrays, objects, simple key/value
       if (Array.isArray(data[key])) {
          // Simple array rendering (you'll likely need a more sophisticated approach)
          const arrayRegex = new RegExp(`{{${key}\\[\\]}}`, 'g');
          merged = merged.replace(arrayRegex, data[key].join(', '));
       } else if (typeof data[key] === 'object') {
           for (const subKey in data[key])
           {
               const subRegex = new RegExp(`{{${key}\\.${subKey}}}`, 'g');
               merged = merged.replace(subRegex, data[key][subKey]);
           }
       }
    }
  }
  return merged;
};

// Debounced update function
const updateOutput = useDebounceFn(() => {
  mergedContent.value = mergeTemplateAndData(props.template, props.jsonData);
  if (activeTab.value === 'pdf') {
    generatePdf();
  }
}, 300);


// Watch for changes in template or jsonData
watch([() => props.template, () => props.jsonData, () => activeTab.value], updateOutput, { deep: true });


const generatePdf = async () => {
    await nextTick();
    if (!pdfContainer.value) return;
    pdfContainer.value.innerHTML = mergedContent.value;  // Render the merged content

  const canvas = await html2canvas(pdfContainer.value);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const imgProps= pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  await nextTick();
  pdfContainer.value.innerHTML = "";
};

const downloadPdf = () => {
    generatePdf().then(()=>{
        const pdf = new jsPDF();
        // We'll generate again to ensure it is up to date.  Could be optimized.
        html2canvas(pdfContainer.value!).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('generated-document.pdf');
    });
  })
};

const handleRichTextUpdate = (newContent: string) => {
  // Update the merged content and trigger PDF regeneration
  mergedContent.value = newContent;
  documentStore.isDirty = true;

    // Find placeholders in the updated rich text content
    const placeholderRegex = /{{(.*?)}}/g;
    let match;
    const updatedData = { ...props.jsonData }; // Copy existing data

    while ((match = placeholderRegex.exec(newContent)) !== null) {
        const placeholder = match[1]; // Extract placeholder name (e.g., "customerName")

        // Find corresponding value in original data, if possible get value from updated data
        const originalValue =  updatedData[placeholder] || '';
        // Replace value using regex on the new content
        const valueRegex = new RegExp(`{{${placeholder}}}`, 'g');
        const extractedValue = newContent.match(valueRegex)

        if(extractedValue){
           //Update in JsonData
           documentStore.jsonData[placeholder] = extractedValue[0].replace(/[{}]/g, "")
        }
    }
    generatePdf();
};
</script>
```


Uses the QuillEditor component from @vueup/vue-quill.

