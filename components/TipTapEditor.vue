<!-- components/TipTapEditor.vue -->
<template>
  <div class="tiptap-editor">
    <div class="editor-toolbar" v-if="editor">
      <div class="toolbar-group">
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          <Icon name="lucide:bold" />
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          <Icon name="lucide:italic" />
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          <Icon name="lucide:strikethrough" />
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          H1
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          H2
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          H3
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }">
          <Icon name="lucide:list" />
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }">
          <Icon name="lucide:list-ordered" />
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
          <Icon name="lucide:align-left" />
        </button>
        <button @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
          <Icon name="lucide:align-center" />
        </button>
        <button @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
          <Icon name="lucide:align-right" />
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="addTable">
          <Icon name="lucide:table" />
        </button>
        <button @click="addColumnBefore" v-if="editor.isActive('table')">
          <Icon name="lucide:column-insert-left" />
        </button>
        <button @click="addColumnAfter" v-if="editor.isActive('table')">
          <Icon name="lucide:column-insert-right" />
        </button>
        <button @click="deleteColumn" v-if="editor.isActive('table')">
          <Icon name="lucide:columns-delete" />
        </button>
        <button @click="addRowBefore" v-if="editor.isActive('table')">
          <Icon name="lucide:row-insert-top" />
        </button>
        <button @click="addRowAfter" v-if="editor.isActive('table')">
          <Icon name="lucide:row-insert-bottom" />
        </button>
        <button @click="deleteRow" v-if="editor.isActive('table')">
          <Icon name="lucide:rows-delete" />
        </button>
        <button @click="deleteTable" v-if="editor.isActive('table')">
          <Icon name="lucide:table-delete" />
        </button>
      </div>
    </div>

    <editor-content :editor="editor" class="editor-content" />
    <div v-if="previewContent" class="preview-overlay prose" v-html="previewContent"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'

const props = defineProps<{
  modelValue: string
  previewContent?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue || '',
  autofocus: true,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      },
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableCell,
    TableHeader,
    TextStyle,
    Color,
    FontFamily,
    TextAlign.configure({
      types: ['heading', 'paragraph', 'table'],
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    emit('change', html)
  },
})

// Table helper functions
const addTable = () => {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

const addColumnBefore = () => {
  editor.value?.chain().focus().addColumnBefore().run()
}

const addColumnAfter = () => {
  editor.value?.chain().focus().addColumnAfter().run()
}

const deleteColumn = () => {
  editor.value?.chain().focus().deleteColumn().run()
}

const addRowBefore = () => {
  editor.value?.chain().focus().addRowBefore().run()
}

const addRowAfter = () => {
  editor.value?.chain().focus().addRowAfter().run()
}

const deleteRow = () => {
  editor.value?.chain().focus().deleteRow().run()
}

const deleteTable = () => {
  editor.value?.chain().focus().deleteTable().run()
}

watch(() => props.modelValue, (newValue) => {
  const editorContent = editor.value?.getHTML()
  if (newValue !== editorContent) {
    editor.value?.commands.setContent(newValue || '')
  }
}, { immediate: true })

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.tiptap-editor {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  background: rgb(var(--surface-section));
}

.toolbar-group {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border-right: 1px solid #e5e7eb;
}

.toolbar-group:last-child {
  border-right: none;
}

.editor-toolbar button {
  padding: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: #374151;
  background: transparent;
  border: 1px solid transparent;
}

.editor-toolbar button:hover {
  background: #f3f4f6;
}

.editor-toolbar button.is-active {
  background: #e5e7eb;
  color: rgb(var(--primary-600));
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: white;
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
}

.ProseMirror {
  height: 100%;
  outline: none;
  min-height: 100px;
}

.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
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

.preview-overlay .prose {
  max-width: none;
}
</style>