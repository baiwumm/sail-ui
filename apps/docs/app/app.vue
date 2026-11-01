<script setup lang="ts">
const groups = [
  {
    title: "Getting started",
    links: [
      {label: "Introduction", to: "/"},
      {label: "Installation", to: "/docs/getting-started"},
      {label: "Theming", to: "/docs/theming"},
      {label: "Migration from HeroUI", to: "/docs/migration"},
    ],
  },
  {
    title: "Components",
    links: [
      {label: "Overview", to: "/docs/components"},
      {label: "Button", to: "/docs/components/button"},
      {label: "Input", to: "/docs/components/input"},
      {label: "Checkbox", to: "/docs/components/checkbox"},
      {label: "Select", to: "/docs/components/select"},
      {label: "Modal", to: "/docs/components/modal"},
      {label: "Toast", to: "/docs/components/toast"},
      {label: "Table", to: "/docs/components/table"},
      {label: "Calendar", to: "/docs/components/calendar"},
      {label: "Accordion", to: "/docs/components/accordion"},
    ],
  },
];
</script>

<template>
  <div class="docs-shell">
    <aside class="docs-sidebar">
      <div class="docs-sidebar-group">
        <p class="docs-sidebar-title">Sail UI</p>
        <ThemeToggle />
      </div>
      <nav v-for="group in groups" :key="group.title" class="docs-sidebar-group">
        <p class="docs-sidebar-title">{{ group.title }}</p>
        <NuxtLink
          v-for="link in group.links"
          :key="link.to"
          :to="link.to"
          class="docs-sidebar-link"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </aside>
    <main class="docs-main">
      <NuxtPage />
    </main>
  </div>
</template>
