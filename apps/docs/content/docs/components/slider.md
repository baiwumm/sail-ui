---
title: Slider
description: Single or range slider with fill, thumb and output parts.
---

# Slider

```vue
<script setup lang="ts">
import {Slider, SliderFill, SliderOutput, SliderThumb, SliderTrack} from "@sail-ui/vue/slider";
</script>

<template>
  <Slider v-model="volume" aria-label="Volume">
    <Label>Volume</Label>
    <SliderOutput />
    <SliderTrack>
      <SliderFill />
      <SliderThumb />
    </SliderTrack>
  </Slider>
</template>
```

## Demo

::demo-slider
::

## API

| Prop                       | Type                         | Notes                                 |
| -------------------------- | ---------------------------- | ------------------------------------- |
| `v-model`                  | `number \| number[]`         | array for a range slider (two thumbs) |
| `min` / `max` / `step`     | `number`                     |                                       |
| `orientation`              | `"horizontal" \| "vertical"` |                                       |
| `formatOptions` / `locale` |                              | output + `aria-valuetext` formatting  |
| `dir`                      | `"ltr" \| "rtl"`             |                                       |

Thumbs emit `aria-valuetext` through the formatter; dragging emits
`data-dragging` and keyboard support comes from the Reka slider primitive.
