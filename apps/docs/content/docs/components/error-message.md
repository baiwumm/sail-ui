---
title: Error Message
description: Validation feedback wired to the owning field.
---

# Error Message

`ErrorMessage` renders only when the owning field is invalid, and joins the
field's `aria-describedby` chain automatically.

```vue
<script setup lang="ts">
import {ErrorMessage} from "@sail-ui/vue/error-message";
import {Input, TextField} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
</script>

<template>
  <TextField is-invalid>
    <Label>Username</Label>
    <Input v-model="username" />
    <ErrorMessage>That username is already claimed.</ErrorMessage>
  </TextField>
</template>
```

## Demo

::demo-field-messages
::

## API

| Prop | Type     | Notes                     |
| ---- | -------- | ------------------------- |
| `id` | `string` | override the generated id |

Multiple messages stack; the field joins them in DOM order.
