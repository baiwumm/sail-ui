<script setup lang="ts">
const chipVariants = ["primary", "secondary", "soft", "tertiary"] as const;
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <div class="flex flex-wrap items-center gap-3">
      <SChip v-for="variant in chipVariants" :key="variant" :variant="variant" color="accent">
        {{ variant }}
      </SChip>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SChip color="default">default</SChip>
      <SChip color="accent">accent</SChip>
      <SChip color="success">success</SChip>
      <SChip color="danger">danger</SChip>
      <SChip color="warning">warning</SChip>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SChip size="sm" color="success">sm</SChip>
      <SChip size="md" color="success">md</SChip>
      <SChip size="lg" color="success">lg</SChip>
    </div>
  </div>
</template>
