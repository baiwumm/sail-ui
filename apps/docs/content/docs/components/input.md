---
title: Input
description: Text fields composed with TextField, Label, Description and FieldError.
---

# Input

Inputs compose with `TextField`, which provides the field context linking
labels, descriptions and errors to the control.

```vue
<script setup lang="ts">
import {Input, TextField} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
</script>

<template>
  <TextField>
    <Label>Name</Label>
    <Input v-model="name" placeholder="Your name" />
    <Description>We never share it.</Description>
  </TextField>
</template>
```

## Demo

::demo-input
::

## API

### Input props

| Prop         | Type                       | Default                    |
| ------------ | -------------------------- | -------------------------- |
| `v-model`    | `string`                   | —                          |
| `type`       | HTML input types           | `"text"`                   |
| `isDisabled` | `boolean`                  | `false`                    |
| `isInvalid`  | `boolean`                  | `false`                    |
| `fullWidth`  | `boolean`                  | `false`                    |
| `variant`    | `"primary" \| "secondary"` | inherited from `TextField` |

### Notes

- `Textarea` renders a real `<textarea>` inside `TextField` and inherits the
  field variant; `autoResize` grows it with content.
- `InputGroup` adds prefix/suffix decorations and click-to-focus.
- IME composition is guarded: Enter during composition never submits or clears.
