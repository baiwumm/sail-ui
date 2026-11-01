---
title: Combo Box
description: Input-driven menu with optional custom values.
---

# Combo Box

```vue
<script setup lang="ts">
import {ComboBoxInput, ComboBoxItem, ComboBoxRoot} from "@sail-ui/vue/combo-box";
</script>

<template>
  <ComboBoxRoot v-model="value" :items="items" menu-trigger="input">
    <ComboBoxInput placeholder="Pick or type…" />
    <ComboBoxItem v-for="item in items" :key="item" :value="item">
      {{ item }}
    </ComboBoxItem>
  </ComboBoxRoot>
</template>
```

## Demo

::demo-date-color
::

## API

| Prop                | Type                             | Notes                          |
| ------------------- | -------------------------------- | ------------------------------ |
| `v-model`           | `key`                            |                                |
| `menuTrigger`       | `"focus" \| "input" \| "manual"` | what opens the menu            |
| `allowsCustomValue` | `boolean`                        | accept typed text as the value |
| `ignoreFilter`      | `boolean`                        | async filtering                |
| `variant`           | `"primary" \| "secondary"`       | reaches the inner input        |

The closed input echoes the selected label once items have mounted; seed it
with `displayValue` for SSR or server defaults (migration guide §9).
