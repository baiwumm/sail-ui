export default defineNuxtConfig({
  compatibilityDate: "2026-10-30",
  modules: ["@sail-ui/nuxt", "@nuxt/content"],
  devtools: {enabled: false},
  ssr: true,
  css: ["~/assets/css/main.css"],

  nitro: {
    // Cloudflare Workers (module worker + static assets). Deploy with
    // `wrangler deploy` from this directory after `pnpm build`.
    preset: "cloudflare_module",
  },

  sailUI: {
    prefix: "S",
    wrapApp: true,
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {default: "github-light", dark: "github-dark"},
          langs: ["ts", "vue", "bash", "json"],
        },
      },
    },
  },
});
