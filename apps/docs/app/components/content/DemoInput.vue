<script setup lang="ts">
const name = ref("");
const bio = ref("");
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <STextField class="max-w-sm" full-width>
      <SLabel>Name</SLabel>
      <SInput v-model="name" placeholder="Your name" />
      <SDescription>We never share it.</SDescription>
    </STextField>

    <STextField class="max-w-sm" full-width>
      <SLabel>Bio</SLabel>
      <STextarea v-model="bio" :rows="3" placeholder="A few lines about you" />
    </STextField>

    <STextField class="max-w-sm" full-width is-invalid>
      <SLabel>Username</SLabel>
      <SInput placeholder="taken" value="taken" />
      <SFieldError>That username is already claimed.</SFieldError>
    </STextField>
  </div>
</template>
