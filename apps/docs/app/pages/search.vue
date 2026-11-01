<script setup lang="ts">
interface SearchSection {
  id: string;
  path: string;
  title: string;
  titles: string[];
  content: string;
  level: number;
}

interface SearchHit {
  path: string;
  page: string;
  heading: string;
  anchor: string;
  snippet: string;
  score: number;
}

const route = useRoute();
const query = computed(() => String(route.query.q ?? ""));

const {data: sections} = await useAsyncData("docs-search-sections", async () => {
  const all = await queryCollectionSearchSections("docs");

  return all as SearchSection[];
});

const hits = computed<SearchHit[]>(() => {
  const needle = query.value.trim().toLowerCase();

  if (!needle || !sections.value) {
    return [];
  }

  const results: SearchHit[] = [];

  for (const section of sections.value) {
    const heading = section.titles.length > 0 ? section.titles.join(" › ") : section.title;
    const content = section.content.toLowerCase();
    const headingText = heading.toLowerCase();
    const titleText = section.title.toLowerCase();

    let score = 0;

    if (titleText.includes(needle)) {
      score += 5;
    }

    if (headingText.includes(needle)) {
      score += 3;
    }

    if (content.includes(needle)) {
      score += 1;
    }

    if (score === 0) {
      continue;
    }

    const at = content.indexOf(needle);
    const start = Math.max(0, at - 60);
    const snippet =
      at === -1
        ? section.content.slice(0, 120)
        : `${start > 0 ? "…" : ""}${section.content.slice(start, at + 80).trim()}…`;

    results.push({
      path: section.path,
      page: section.title,
      heading,
      anchor: section.id,
      snippet,
      score,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 30);
});

useSeoMeta({
  title: () => (query.value ? `“${query.value}” — Search — Sail UI` : "Search — Sail UI"),
});
</script>

<template>
  <div class="docs-content">
    <h1>Search</h1>
    <p v-if="query" class="docs-lead">
      {{ hits.length }} result{{ hits.length === 1 ? "" : "s" }} for “{{ query }}”
    </p>

    <ul class="search-results">
      <li v-for="hit in hits" :key="hit.anchor">
        <NuxtLink :to="`${hit.path}#${hit.anchor}`">
          <span class="search-hit-page">{{ hit.page }}</span>
          <span class="search-hit-heading">{{ hit.heading }}</span>
          <span class="search-hit-snippet">{{ hit.snippet }}</span>
        </NuxtLink>
      </li>
    </ul>
    <p v-if="query && hits.length === 0" class="docs-lead">Nothing found. Try another term.</p>
  </div>
</template>

<style scoped>
.search-results {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-results a {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-field);
  padding: 0.625rem 0.875rem;
  color: var(--foreground);
  text-decoration: none;
}

.search-results a:hover {
  border-color: var(--accent);
}

.search-hit-page {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
}

.search-hit-heading {
  font-size: 0.875rem;
  font-weight: 500;
}

.search-hit-snippet {
  font-size: 0.8125rem;
  color: var(--muted-foreground);
}
</style>
