<script setup lang="ts">
import {ToastProvider} from "@sail-ui/vue/toast";

import ToastSection from "./ToastSection.vue";
</script>

<template>
  <ToastProvider>
    <ToastSection />
  </ToastProvider>
</template>
