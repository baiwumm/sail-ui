<script setup lang="ts">
import {ref} from "vue";

const single = ref("left");
const formats = ref<string[]>(["bold"]);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SToggle-button-group v-model="single" type="single" aria-label="Alignment">
      <SToggle-button value="left">Left</SToggle-button>
      <SToggle-button value="center">Center</SToggle-button>
      <SToggle-button value="right">Right</SToggle-button>
    </SToggle-button-group>
    <SToggle-button-group v-model="formats" type="multiple" aria-label="Formatting">
      <SToggle-button value="bold">Bold</SToggle-button>
      <SToggle-button-group-separator />
      <SToggle-button value="italic">Italic</SToggle-button>
    </SToggle-button-group>
  </div>
</template>
