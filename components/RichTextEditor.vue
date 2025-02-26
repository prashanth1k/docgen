<!-- components/RichTextEditor.vue -->
<template>
  <div class="rich-text-editor">
    <ClientOnly>
      <QuillEditor v-if="isClient" v-model:content="content" :options="editorOptions" contentType="delta" theme="snow"
        toolbar="full" @textChange="handleTextChange" @update:content="$emit('update:modelValue', $event)"
        ref="quillEditor" :read-only="!!previewContent" />
      <div v-if="previewContent" class="preview-overlay" v-html="previewContent"></div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import { useQuillEditor } from '~/composables/useQuillEditor';
import { useDocumentStore } from '~/stores/document';

const props = defineProps<{
  modelValue: string;
  previewContent?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
}>();

const content = ref(props.modelValue);
const quillEditor = ref<InstanceType<typeof QuillEditor> | null>(null);
const isClient = ref(false);
const documentStore = useDocumentStore();

const { editorOptions } = useQuillEditor();

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue;
  }
});

// Watch for preview content changes
watch(() => props.previewContent, () => {
  if (quillEditor.value?.getQuill()) {
    // Force Quill to update its content display
    const quill = quillEditor.value.getQuill();
    quill.updateContents(quill.getContents());
  }
}, { immediate: true });

// Handle text changes
const handleTextChange = () => {
  documentStore.isDirty = true;
  emit('change', content.value);
  emit('update:modelValue', content.value);

  // Find placeholders in the updated rich text content
  const placeholderRegex = /{{(.*?)}}/g;
  let match;
  const updatedData = { ...documentStore.jsonData };

  while ((match = placeholderRegex.exec(content.value)) !== null) {
    const placeholder = match[1];
    if (placeholder in updatedData) {
      const valueRegex = new RegExp(`{{${placeholder}}}`, 'g');
      const extractedValue = content.value.match(valueRegex);

      if (extractedValue) {
        documentStore.jsonData[placeholder] = extractedValue[0].replace(/[{}]/g, '');
      }
    }
  }
};

onMounted(() => {
  isClient.value = true;
  if (quillEditor.value?.getQuill()) {
    const quill = quillEditor.value.getQuill();
    quill.getModule('toolbar').addHandler('table', function () {
      const tableModule = quill.getModule('table');
      tableModule.insertTable(3, 3);
    });
  }
});
</script>

<style>
.rich-text-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.preview-overlay {
  position: absolute;
  top: 38px;
  /* Height of toolbar */
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  overflow: auto;
  padding: 12px;
}

:deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid rgb(var(--surface-border));
  background: rgb(var(--surface-section));
  padding: 0.5rem;
}

:deep(.ql-container.ql-snow) {
  flex: 1;
  border: none;
  font-size: 1rem;
  font-family: inherit;
}

:deep(.ql-picker-options) {
  background: rgb(var(--surface-card)) !important;
  border-color: rgb(var(--surface-border)) !important;
}

:deep(.ql-toolbar button:hover),
:deep(.ql-toolbar button.ql-active),
:deep(.ql-toolbar .ql-picker-label:hover),
:deep(.ql-toolbar .ql-picker-label.ql-active),
:deep(.ql-toolbar .ql-picker-item:hover),
:deep(.ql-toolbar .ql-picker-item.ql-selected) {
  color: rgb(var(--primary-600)) !important;
}

:deep(.ql-toolbar button:hover .ql-stroke),
:deep(.ql-toolbar button.ql-active .ql-stroke),
:deep(.ql-toolbar .ql-picker-label:hover .ql-stroke),
:deep(.ql-toolbar .ql-picker-label.ql-active .ql-stroke),
:deep(.ql-toolbar button:hover .ql-fill),
:deep(.ql-toolbar button.ql-active .ql-fill) {
  stroke: rgb(var(--primary-600)) !important;
}

:deep(.ql-snow .ql-table) {
  width: auto !important;
  margin: 0 !important;
  background: white;
}

:deep(.ql-snow .ql-table td) {
  border: 1px solid #ccc;
  padding: 8px;
}

:deep(.ql-snow .ql-table th) {
  border: 1px solid #ccc;
  padding: 8px;
  background: #f3f4f6;
  font-weight: bold;
}
</style>