// plugins/pdfmake.client.ts
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      // This is just a placeholder - we'll use dynamic imports in the component
      pdfMakeReady: true,
    },
  };
});

// Add TypeScript declaration
declare module "#app" {
  interface NuxtApp {
    $pdfMake: any;
  }
}
