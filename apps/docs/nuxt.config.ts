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

  app: {
    head: {
      link: [
        {rel: "preconnect", href: "https://fonts.googleapis.com"},
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    },
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
