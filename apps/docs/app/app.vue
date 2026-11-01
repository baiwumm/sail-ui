<script setup lang="ts">
import {docsNav} from "./docs-nav.generated";
import type {DocGroup} from "./docs-nav";

const groups = docsNav;

const query = ref("");

function goToSearch() {
  const needle = query.value.trim();

  if (needle) {
    navigateTo(`/search?q=${encodeURIComponent(needle)}`);
  }
}

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
        placeholder="Filter pages… (Enter for full-text search)"
        size="sm"
        @keydown.enter="goToSearch"
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
