<script setup lang="ts">
import {ref} from "vue";

const volume = ref(60);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SSlider v-model="volume" class="max-w-sm" aria-label="Volume">
      <SLabel>Volume</SLabel>
      <SSlider-output />
      <SSlider-track>
        <SSlider-fill />
        <SSlider-thumb />
      </SSlider-track>
    </SSlider>
  </div>
</template>
