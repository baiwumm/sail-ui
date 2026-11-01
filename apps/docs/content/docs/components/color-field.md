---
title: Color Field
description: Text input for hex/channel values with swatch prefix.
---

# Color Field

```vue
<script setup lang="ts">
import {ColorFieldGroup, ColorFieldInput, ColorFieldRoot} from "@sail-ui/vue/color-field";
</script>

<template>
  <ColorFieldRoot v-model="hex" aria-label="Hex value">
    <ColorFieldGroup>
      <ColorFieldInput />
    </ColorFieldGroup>
  </ColorFieldRoot>
</template>
```

## Demo

::demo-date-color
::

## API

| Prop                     | Type                    | Notes                       |
| ------------------------ | ----------------------- | --------------------------- |
| `v-model`                | `string \| Color`       | empty falls back to #000000 |
| `colorSpace` / `channel` | color spaces / channels | channel mode input          |
| `step`                   | `number`                | channel stepping            |

The root emits RAC's `data-channel` attribute (`hex` by default). Reka clamps
out-of-range values on commit.
