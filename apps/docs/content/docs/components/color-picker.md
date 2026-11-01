---
title: Color Picker
description: Composed popover with area, sliders, field and swatches.
---

# Color Picker

`ColorPicker` is a composed shell (ADR 0005): assemble the popover from
`ColorArea`, `ColorSlider`, `ColorField` and `ColorSwatchPicker` parts. The
picker's `name` flows to a `ColorField` inside it for form submission.

```vue
<script setup lang="ts">
import {ColorPickerPopover, ColorPickerRoot, ColorPickerTrigger} from "@sail-ui/vue/color-picker";
</script>

<template>
  <ColorPickerRoot v-model="color" name="theme-color">
    <ColorPickerTrigger>
      <ColorSwatchRoot size="lg" />
    </ColorPickerTrigger>
    <ColorPickerPopover>
      <!-- ColorAreaRoot / ColorSliderRoot / ColorFieldRoot / ColorSwatchPickerRoot -->
    </ColorPickerPopover>
  </ColorPickerRoot>
</template>
```

## Demo

::demo-date-color
::

## API

| Prop          | Type              | Notes                                |
| ------------- | ----------------- | ------------------------------------ |
| `v-model`     | `string \| Color` |                                      |
| `defaultOpen` | `boolean`         |                                      |
| `name`        | `string`          | inherited by a composed `ColorField` |

Events: `@update:color` (Color object) and `@change` (hex string) — see the
migration guide for the payload difference.
