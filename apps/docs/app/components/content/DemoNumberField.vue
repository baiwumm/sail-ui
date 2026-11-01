<script setup lang="ts">
import {ref} from "vue";

const quantity = ref(1);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SNumberField v-model="quantity" class="max-w-sm" :min="0" :max="10">
      <SLabel>Quantity</SLabel>
      <SNumberField-group>
        <SNumberField-decrement-button />
        <SNumberField-input />
        <SNumberField-increment-button />
      </SNumberField-group>
    </SNumberField>
  </div>
</template>
