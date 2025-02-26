import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Quill from "quill";
import "quill-better-table";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("QuillEditor", QuillEditor);

  // Register any Quill modules or formats here
  // This file only runs on the client side
});
