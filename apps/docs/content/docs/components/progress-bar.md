---
title: Progress Bar
description: Linear determinate and indeterminate progress.
---

# Progress Bar

```vue
<script setup lang="ts">
import {
  ProgressBar,
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarTrack,
} from "@sail-ui/vue/progress-bar";
</script>

<template>
  <ProgressBar :value="62" aria-label="Upload progress">
    <ProgressBarTrack>
      <ProgressBarFill />
    </ProgressBarTrack>
    <ProgressBarOutput />
  </ProgressBar>
</template>
```

## Demo

::demo-progress
::

## API

| Prop                    | Type                       | Notes                                   |
| ----------------------- | -------------------------- | --------------------------------------- |
| `value`                 | `number \| null`           | `null` with `is-indeterminate` animates |
| `minValue` / `maxValue` | `number`                   | defaults 0–100                          |
| `isIndeterminate`       | `boolean`                  |                                         |
| `valueLabel`            | `string`                   | overrides the rendered label            |
| `formatOptions`         | `Intl.NumberFormatOptions` | output formatting                       |
