---
title: Number Field
description: Spinbutton with steppers, clamping and locale formatting.
---

# Number Field

```vue
<script setup lang="ts">
import {
  NumberField,
  NumberFieldDecrementButton,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldInput,
} from "@sail-ui/vue/number-field";
</script>

<template>
  <NumberField v-model="quantity" :min="0" :max="10">
    <Label>Quantity</Label>
    <NumberFieldGroup>
      <NumberFieldDecrementButton />
      <NumberFieldInput />
      <NumberFieldIncrementButton />
    </NumberFieldGroup>
  </NumberField>
</template>
```

## Demo

::demo-number-field
::

## API

| Prop                                                     | Type                       | Notes                     |
| -------------------------------------------------------- | -------------------------- | ------------------------- |
| `v-model`                                                | `number \| undefined`      |                           |
| `min` / `max` / `step`                                   | `number`                   | clamp and stepping        |
| `formatOptions`                                          | `Intl.NumberFormatOptions` | e.g. currency display     |
| `locale`                                                 | `string`                   | parsing/formatting locale |
| `isDisabled` / `isReadOnly` / `isInvalid` / `isRequired` | `boolean`                  |                           |

Keyboard: Up/Down step, PageUp/PageDown big steps, Home/End to the bounds.
The label renders as a real `<label for>` naming the spin button.
