<!-- components/DataEditor.vue -->
<template>
  <ClientOnly>
    <div class="h-[300px] border border-white/20 rounded-lg overflow-hidden bg-white/5">
      <textarea v-model="jsonString"
        class="w-full h-full p-4 font-mono text-sm bg-transparent dark:text-white/90 focus:outline-none"
        @input="handleInput" spellcheck="false"></textarea>
    </div>
    <div v-if="error" class="mt-2 text-red-400 text-sm">
      {{ error }}
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDocumentStore } from '~/stores/document';

const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>();

const documentStore = useDocumentStore();
const error = ref('');
const jsonString = ref(JSON.stringify(props.modelValue, null, 2));

watch(() => props.modelValue, (newVal) => {
  const newString = JSON.stringify(newVal, null, 2);
  if (jsonString.value !== newString) {
    jsonString.value = newString;
  }
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  try {
    const parsed = JSON.parse(target.value);
    error.value = '';
    documentStore.isDirty = true;
    emit('update:modelValue', parsed);
  } catch (e) {
    error.value = 'Invalid JSON format';
  }
};
</script>

<style>
.jsoneditor {
  min-height: 300px;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}
</style>