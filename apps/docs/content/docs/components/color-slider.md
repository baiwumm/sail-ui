---
title: Color Slider
description: Single-channel slider with hue/alpha gradients and RTL support.
---

# Color Slider

```vue
<script setup lang="ts">
import {ColorSliderRoot, ColorSliderThumb, ColorSliderTrack} from "@sail-ui/vue/color-slider";
</script>

<template>
  <ColorSliderRoot v-model="hue" channel="hue" color-space="hsl" aria-label="Hue">
    <ColorSliderTrack>
      <ColorSliderThumb />
    </ColorSliderTrack>
  </ColorSliderRoot>
</template>
```

## Demo

::demo-date-color
::

## API

| Prop         | Type                     | Notes         |
| ------------ | ------------------------ | ------------- |
| `v-model`    | `string \| Color`        |               |
| `channel`    | `hue \| saturation \| …` | gradient axis |
| `colorSpace` | color spaces             |               |

The gradient runs `to left` in RTL and `to top` for vertical axes. Mismatched
channel/color-space combos self-correct with a dev-only warning, matching the
upstream behaviour (T07 accepted gap: `aria-disabled` emission).
