import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-10-30",
  css: ["~/assets/css/main.css"],
  devtools: {enabled: false},
  ssr: true,
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["reka-ui", "tailwind-variants"]
    }
  }
});
