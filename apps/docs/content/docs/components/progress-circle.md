---
title: Progress Circle
description: Radial progress ring with the same state contract as Progress Bar.
---

# Progress Circle

```vue
<script setup lang="ts">
import {
  ProgressCircle,
  ProgressCircleFillCircle,
  ProgressCircleOutput,
  ProgressCircleTrack,
} from "@sail-ui/vue/progress-circle";
</script>

<template>
  <ProgressCircle :value="62" aria-label="Disk usage">
    <ProgressCircleTrack>
      <ProgressCircleFillCircle />
    </ProgressCircleTrack>
    <ProgressCircleOutput />
  </ProgressCircle>
</template>
```

## Demo

::demo-progress
::

## API

Same props as [Progress Bar](/docs/components/progress-bar): `value`,
`minValue`/`maxValue`, `isIndeterminate`, `valueLabel`, `formatOptions`.

The track/fill geometry follows the upstream constants exactly, so custom CSS
tuned against HeroUI renders identically.
