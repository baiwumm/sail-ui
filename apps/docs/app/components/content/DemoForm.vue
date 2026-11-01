<script setup lang="ts">
import {ref} from "vue";

const email = ref("");
const submitted = ref("");

function handleSubmit() {
  submitted.value = email.value;
}
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SForm class="max-w-sm" @submit="handleSubmit">
      <STextField is-required>
        <SLabel>Email</SLabel>
        <SInput v-model="email" type="email" placeholder="you@example.com" />
        <SField-error>Enter a valid email.</SField-error>
      </STextField>
      <SButton type="submit">Subscribe</SButton>
    </SForm>
    <p v-if="submitted" class="text-sm">Submitted: {{ submitted }}</p>
  </div>
</template>
