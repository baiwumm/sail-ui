<script setup lang="ts">
import {ref} from "vue";

const query = ref("");
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SSearch-field v-model="query" class="max-w-sm" @submit="query = ''">
      <SSearch-field-group>
        <SSearch-field-search-icon />
        <SSearch-field-input placeholder="Search components" />
        <SSearch-field-clear-button />
      </SSearch-field-group>
    </SSearch-field>
  </div>
</template>
