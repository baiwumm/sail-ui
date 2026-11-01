<script setup lang="ts">
const expanded = ref<string[]>(["a"]);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SAccordion v-model:expanded-keys="expanded">
      <SAccordionItem id="a">
        <SAccordionHeading>
          <SAccordionTrigger>What is Sail UI?</SAccordionTrigger>
        </SAccordionHeading>
        <SAccordionPanel>A Vue 3 port of the HeroUI v3 contract.</SAccordionPanel>
      </SAccordionItem>
      <SAccordionItem id="b">
        <SAccordionHeading>
          <SAccordionTrigger>How is it tested?</SAccordionTrigger>
        </SAccordionHeading>
        <SAccordionPanel>Contract, unit, SSR, browser and visual gates.</SAccordionPanel>
      </SAccordionItem>
    </SAccordion>
  </div>
</template>
