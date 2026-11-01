<script setup lang="ts">
import {ref} from "vue";

const enabled = ref(true);
const newsletter = ref(false);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SFieldset class="max-w-sm gap-3" :is-disabled="!enabled">
      <SFieldset-legend>Contact preferences</SFieldset-legend>
      <SCheckbox v-model="newsletter">Send me the newsletter</SCheckbox>
      <SField-group>
        <SButton size="sm" variant="secondary">Reset</SButton>
        <SButton size="sm" variant="primary">Save</SButton>
      </SField-group>
    </SFieldset>
    <SCheckbox v-model="enabled">Enable fieldset</SCheckbox>
  </div>
</template>
