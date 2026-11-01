---
title: Color Swatch Picker
description: Preset swatch list with selection and keyboard support.
---

# Color Swatch Picker

```vue
<script setup lang="ts">
import {
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
} from "@sail-ui/vue/color-swatch-picker";
</script>

<template>
  <ColorSwatchPickerRoot v-model="color" aria-label="Presets">
    <ColorSwatchPickerItem v-for="preset in presets" :key="preset" :color="preset">
      <ColorSwatchPickerSwatch />
    </ColorSwatchPickerItem>
  </ColorSwatchPickerRoot>
</template>
```

## Demo

::demo-date-color
::

## API

Items use `:color` for the preset value; selection follows the listbox
pattern (`data-selected`, `data-focus-visible`, `data-disabled` — the CSS
selectors the upstream swatch picker styles). Deselecting keeps the current
value rather than clearing it, matching upstream.
