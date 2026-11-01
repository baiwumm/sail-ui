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
  <article class="docs-content">
    <ContentRenderer v-if="doc" :value="doc" />
  </article>
</template>
