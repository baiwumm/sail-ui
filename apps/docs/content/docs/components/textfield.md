---
title: Text Field
description: Field shell wiring Label, Input, Description and FieldError.
---

# Text Field

`TextField` is the field shell exported from `@sail-ui/vue/input`. It owns the
field context: label association, describedby chains and validation state.

```vue
<script setup lang="ts">
import {Input, TextField} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
</script>

<template>
  <TextField is-required is-invalid>
    <Label>Email</Label>
    <Input v-model="email" type="email" />
    <FieldError>Enter a valid email.</FieldError>
  </TextField>
</template>
```

## Demo

::demo-input
::

## API

| Prop                                      | Type                           | Notes                                  |
| ----------------------------------------- | ------------------------------ | -------------------------------------- |
| `isDisabled` / `isRequired` / `isInvalid` | `boolean`                      | inherited by child controls            |
| `variant`                                 | `"primary" \| "secondary"`     | inherited by Input/Textarea/InputGroup |
| `fullWidth`                               | `boolean`                      |                                        |
| `name`                                    | `string`                       |                                        |
| `validate`                                | `(value) => ValidationError[]` | Reka field validation                  |
| `validationMode`                          | RAC modes                      | controls when invalid shows            |
