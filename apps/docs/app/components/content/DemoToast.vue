<script setup lang="ts">
const toast = useToast();
</script>

<template>
  <div class="docs-demo">
    <SButton variant="primary" @press="toast('Saved', {description: 'All changes stored.'})">
      Simple toast
    </SButton>
    <SButton
      variant="secondary"
      @press="toast.success('Deployed', {description: 'v0.1.0 is live'})"
    >
      Success toast
    </SButton>
  </div>
</template>
