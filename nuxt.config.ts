// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@pinia/nuxt", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],

  tailwindcss: {
    exposeConfig: true,
  },

  compatibilityDate: "2025-02-23",
});
