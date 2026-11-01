<script setup lang="ts">
import {ref} from "vue";

const format = ref<string[]>(["bold"]);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SToolbar aria-label="Editor tools">
      <SToggle-button-group v-model="format" type="multiple">
        <SToggle-button value="bold">Bold</SToggle-button>
        <SToggle-button-group-separator />
        <SToggle-button value="italic">Italic</SToggle-button>
      </SToggle-button-group>
      <SButton-group>
        <SButton size="sm">Left</SButton>
        <SButton-group-separator />
        <SButton size="sm">Right</SButton>
      </SButton-group>
    </SToolbar>
  </div>
</template>
