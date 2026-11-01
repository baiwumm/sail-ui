<script setup lang="ts">
const route = useRoute();
const {data: doc} = await useAsyncData(`docs-${route.path}`, () =>
  queryCollection("docs").path(route.path).first(),
);

if (!doc.value) {
  throw createError({statusCode: 404, statusMessage: "Document not found", fatal: true});
}

useSeoMeta({
  title: `${doc.value.title} — Sail UI`,
  description: doc.value.description,
});
</script>

<template>
  <div class="docs-article">
    <article class="docs-content">
      <ContentRenderer v-if="doc" :value="doc" />
    </article>
    <nav v-if="doc?.body?.toc?.links?.length" class="docs-toc" aria-label="On this page">
      <p class="docs-toc-title">On this page</p>
      <ul>
        <li v-for="link in doc.body.toc.links" :key="link.id">
          <a :href="`#${link.id}`">{{ link.text }}</a>
          <ul v-if="link.children?.length">
            <li v-for="child in link.children" :key="child.id">
              <a :href="`#${child.id}`">{{ child.text }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>
