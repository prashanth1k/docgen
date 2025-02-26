// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@pinia/nuxt", "nuxt-icon"],
  css: ["~/assets/css/main.css"],

  tailwindcss: {
    config: {
      darkMode: "class",
      content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./assets/**/*.css",
      ],
      theme: {
        extend: {
          colors: {
            primary: {
              50: "rgb(var(--primary-50) / <alpha-value>)",
              100: "rgb(var(--primary-100) / <alpha-value>)",
              200: "rgb(var(--primary-200) / <alpha-value>)",
              300: "rgb(var(--primary-300) / <alpha-value>)",
              400: "rgb(var(--primary-400) / <alpha-value>)",
              500: "rgb(var(--primary-500) / <alpha-value>)",
              600: "rgb(var(--primary-600) / <alpha-value>)",
              700: "rgb(var(--primary-700) / <alpha-value>)",
              800: "rgb(var(--primary-800) / <alpha-value>)",
              900: "rgb(var(--primary-900) / <alpha-value>)",
              950: "rgb(var(--primary-950) / <alpha-value>)",
            },
            neutral: {
              50: "rgb(var(--neutral-50) / <alpha-value>)",
              100: "rgb(var(--neutral-100) / <alpha-value>)",
              200: "rgb(var(--neutral-200) / <alpha-value>)",
              300: "rgb(var(--neutral-300) / <alpha-value>)",
              400: "rgb(var(--neutral-400) / <alpha-value>)",
              500: "rgb(var(--neutral-500) / <alpha-value>)",
              600: "rgb(var(--neutral-600) / <alpha-value>)",
              700: "rgb(var(--neutral-700) / <alpha-value>)",
              800: "rgb(var(--neutral-800) / <alpha-value>)",
              900: "rgb(var(--neutral-900) / <alpha-value>)",
              950: "rgb(var(--neutral-950) / <alpha-value>)",
            },
          },
          typography: (theme) => ({
            DEFAULT: {
              css: {
                maxWidth: "65ch",
                color: "inherit",
                a: {
                  color: theme("colors.primary.500"),
                  "&:hover": {
                    color: theme("colors.primary.600"),
                  },
                },
              },
            },
          }),
        },
      },
      plugins: [require("@tailwindcss/typography")],
    },
  },

  compatibilityDate: "2025-02-23",
});
