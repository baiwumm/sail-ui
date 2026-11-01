export default defineNuxtConfig({
  compatibilityDate: "2026-10-30",
  // The Sail UI module injects the styles entry, wires Tailwind v4,
  // auto-imports the components (prefix `S`) and wraps the app with
  // SailUIProvider so useToast works without touching app.vue.
  modules: ["@sail-ui/nuxt"],
  devtools: {enabled: false},
  ssr: true,
  css: ["~/assets/css/main.css"],
});
