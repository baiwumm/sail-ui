---
title: Field Error
description: FieldError part rendered inside the Reka field context.
---

# Field Error

`FieldError` is the field-family error part. It renders when the field is
invalid, supports explicit `errors` content and is announced through the
field's describedby chain.

```vue
<script setup lang="ts">
import {FieldError} from "@sail-ui/vue/field-error";
import {Input, TextField} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
</script>

<template>
  <TextField is-invalid>
    <Label>Email</Label>
    <Input v-model="email" />
    <FieldError>Enter a valid email address.</FieldError>
  </TextField>
</template>
```

## Demo

::demo-field-messages
::

## API

| Prop     | Type       | Notes                                        |
| -------- | ---------- | -------------------------------------------- |
| `id`     | `string`   |                                              |
| `errors` | `string[]` | explicit errors when not using field context |

SSR registers its id after mount, so the server output is deterministic
(accepted gap documented in ticket T03).
