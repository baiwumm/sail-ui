<script setup lang="ts">
useSeoMeta({
  title: "Sail UI — HeroUI v3 for Vue",
  description:
    "Vue 3 components that reuse the HeroUI v3 CSS and DOM contract verbatim, with Vue-native behavior on Reka UI.",
});
</script>

<template>
  <div class="docs-content">
    <h1>Sail UI</h1>
    <p class="lead">
      An unofficial Vue 3 / Nuxt port of HeroUI v3. The upstream CSS and DOM contract are reused
      verbatim — same <code>data-slot</code> attributes, variants and BEM classes — while the
      behavior layer is Vue-native, built on Reka UI primitives.
    </p>

    <h2>Why Sail UI</h2>
    <ul>
      <li>
        Pixel-level visual parity with HeroUI v3, guarded by 86 visual comparisons against the React
        reference.
      </li>
      <li>
        The upstream class contract (<code>button--primary</code>, <code>card__header</code>, …)
        stays usable from your own CSS.
      </li>
      <li>
        84 components: display, forms, overlays, collections, dates/colors, and data-driven tables.
      </li>
      <li>First-class Nuxt support through <code>@sail-ui/nuxt</code>.</li>
    </ul>

    <h2>Quick start</h2>
    <NuxtLink to="/docs/getting-started">Read the installation guide</NuxtLink>, or add the Nuxt
    module:

    <pre><code>pnpm add @sail-ui/nuxt</code></pre>

    <pre><code>// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@sail-ui/nuxt"],
});</code></pre>

    <p>
      Migrating from HeroUI React? The <NuxtLink to="/docs/migration">migration guide</NuxtLink>
      maps props, events and composition APIs one to one.
    </p>
  </div>
</template>

<style scoped>
.lead {
  font-size: 1.05rem;
  color: var(--muted-foreground);
}
</style>
