<script setup lang="ts">
interface DocLink {
  label: string;
  to: string;
}

interface DocGroup {
  title: string;
  links: DocLink[];
}

const groups: DocGroup[] = [
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

const query = ref("");

const filteredGroups = computed<DocGroup[]>(() => {
  const needle = query.value.trim().toLowerCase();

  if (!needle) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.label.toLowerCase().includes(needle)),
    }))
    .filter((group) => group.links.length > 0);
});
</script>

<template>
  <div class="docs-shell">
    <header class="docs-header">
      <NuxtLink to="/" class="docs-logo">Sail UI</NuxtLink>
      <span class="docs-logo-badge">0.x</span>

      <div class="docs-header-spacer" />

      <SInput
        v-model="query"
        aria-label="Search the docs"
        class="docs-header-search"
        placeholder="Filter pages…"
        size="sm"
      />
      <SLink
        href="https://github.com/baiwumm/sail-ui"
        aria-label="GitHub repository"
        target="_blank"
      >
        GitHub
      </SLink>
      <ThemeToggle />
    </header>

    <div class="docs-body">
      <aside class="docs-sidebar">
        <nav v-for="group in filteredGroups" :key="group.title" class="docs-sidebar-group">
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
        <p v-if="filteredGroups.length === 0" class="docs-sidebar-empty">
          No pages match “{{ query }}”.
        </p>
      </aside>

      <main class="docs-main">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
