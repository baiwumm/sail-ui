<script setup lang="ts">
const selected = ref<string[]>(["newsletter"]);
const single = ref(true);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SCheckboxGroup v-model="selected" aria-label="Notifications">
      <SCheckbox value="newsletter">Newsletter</SCheckbox>
      <SCheckbox value="releases">Release notes</SCheckbox>
      <SCheckbox value="security" is-disabled>Security alerts (managed)</SCheckbox>
    </SCheckboxGroup>

    <SCheckbox v-model="single">Accept the terms</SCheckbox>
  </div>
</template>
