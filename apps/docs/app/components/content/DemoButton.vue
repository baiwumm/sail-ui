<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <div class="docs-demo">
    <SButton variant="primary" @press="count++">Pressed {{ count }} times</SButton>
    <SButton variant="secondary">Secondary</SButton>
    <SButton variant="danger" size="sm">Delete</SButton>
    <SButton is-icon-only aria-label="Add" variant="primary">＋</SButton>
    <SButton is-loading>Loading</SButton>
    <SButton is-disabled>Disabled</SButton>
  </div>
</template>
