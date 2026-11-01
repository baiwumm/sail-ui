<template>
  <div class="docs-demo docs-demo-stack">
    <div class="flex flex-wrap items-center gap-4">
      <SSeparator class="w-24" />
      <SSeparator class="w-24" variant="secondary" />
      <SSeparator class="w-24" variant="tertiary" />
      <SSeparator class="h-8" orientation="vertical" />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <SSkeleton class="h-6 w-40" />
      <SSkeleton class="h-6 w-24" animation-type="pulse" />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <SSpinner size="sm" />
      <SSpinner size="md" color="accent" />
      <SSpinner size="lg" color="warning" />
    </div>
  </div>
</template>
