<template>
  <div class="richtext-editor">
    <ckeditor v-if="editor && config && modelValue" :editor="editor" v-model="modelValue" :config="config" />

    <div v-if="previewContent" class="preview-overlay prose" v-html="previewContent"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import {
  ClassicEditor,
  Autoformat,
  AutoImage,
  Autosave,
  Base64UploadAdapter,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  ImageBlock,
  ImageEditing,
  ImageInsert,
  ImageInsertViaUrl,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Mention,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import 'ckeditor5/ckeditor5.css';
const isLayoutReady = ref(false);
const editor = ClassicEditor;
const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

const config = computed(() => {
  if (!isLayoutReady.value) {
    return null;
  }

  return {
    toolbar: {
      items: [
        'sourceEditing',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'removeFormat',
        '|',
        'link',
        'insertImage',
        'insertTable',
        '|',
        'outdent',
        'indent'
      ],
      shouldNotGroupWhenFull: false
    },
    plugins: [
      Autoformat,
      AutoImage,
      Autosave,
      Base64UploadAdapter,
      Bold,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      ImageBlock,
      ImageEditing,
      ImageInsert,
      ImageInsertViaUrl,
      ImageToolbar,
      ImageUpload,
      ImageUtils,
      Indent,
      IndentBlock,
      Italic,
      Link,
      Mention,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      SourceEditing,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      Underline
    ],
    fontFamily: {
      supportAllValues: true
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph'
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1'
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2'
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3'
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4'
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5'
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6'
        }
      ]
    },
    image: {
      toolbar: ['imageTextAlternative']
    },
    initialData:
      '..',
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },

    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    }
  };
});
const modelValue = defineModel()

const props = defineProps<{
  previewContent?: string
}>()


onMounted(() => {
  isLayoutReady.value = true;
});
</script>

<style>
.richtext-editor {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.preview-overlay {
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  overflow: auto;
  padding: 1rem;
  color: black !important;
}

/* Update typography styles */
.prose h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose h3 {
  font-size: 1.25em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose strong {
  font-weight: bold;
}

.prose em {
  font-style: italic;
}

.prose s {
  text-decoration: line-through;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.prose ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.prose table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.prose td,
.prose th {
  border: 1px solid #ccc;
  padding: 8px;
}

.prose th {
  background-color: #f3f4f6;
  font-weight: bold;
}

.editor-content .prose {
  max-width: none;
}

.main-container {
  font-family: 'Lato';
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.ck-content {
  font-family: 'Lato';
  line-height: 1.6;
  word-break: break-word;
}

.editor-container_classic-editor .editor-container__editor {
  min-width: 795px;
  max-width: 795px;
}
</style>