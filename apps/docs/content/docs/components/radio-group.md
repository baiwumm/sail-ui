---
title: Radio Group
description: Single-choice radio collection with roving tab index.
---

# Radio Group

```vue
<script setup lang="ts">
import {Radio, RadioContent, RadioControl, RadioIndicator} from "@sail-ui/vue/radio";
import {RadioGroup} from "@sail-ui/vue/radio-group";
</script>

<template>
  <RadioGroup v-model="plan">
    <Radio value="free">…</Radio>
    <Radio value="pro">…</Radio>
  </RadioGroup>
</template>
```

## Demo

::demo-radio
::

## API

| Prop                                      | Type                         | Default      |
| ----------------------------------------- | ---------------------------- | ------------ |
| `v-model`                                 | `string`                     | —            |
| `variant`                                 | variants                     | `"primary"`  |
| `orientation`                             | `"vertical" \| "horizontal"` | `"vertical"` |
| `isDisabled` / `isInvalid` / `isRequired` | `boolean`                    |              |
| `name`                                    | `string`                     | generated    |
| `dir`                                     | `"ltr" \| "rtl"`             | document     |

Keyboard: arrows move and select, Tab jumps out of the group. The selected
radio is the only tab stop (roving tab index), matching the upstream
contract.
