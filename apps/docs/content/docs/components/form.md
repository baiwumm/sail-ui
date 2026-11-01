---
title: Form
description: Native form wrapper with invalid event relay and IME-safe submit.
---

# Form

`Form` is a native `<form>`: implicit submission and constraint validation
stay browser-driven, the component relays `submit` and `invalid` events.

```vue
<script setup lang="ts">
import {Form} from "@sail-ui/vue/form";
</script>

<template>
  <Form @submit="save">
    <TextField is-required>
      <Label>Email</Label>
      <Input v-model="email" type="email" />
      <FieldError>Enter a valid email.</FieldError>
    </TextField>
    <Button type="submit">Subscribe</Button>
  </Form>
</template>
```

## Demo

::demo-form
::

## API

| Prop                         | Type             | Notes                             |
| ---------------------------- | ---------------- | --------------------------------- |
| `name` / `method` / `action` | native           | passthrough                       |
| `noValidate`                 | `boolean`        | skip native constraint validation |
| `dir`                        | `"ltr" \| "rtl"` |                                   |

Events: `@submit` (native `SubmitEvent`, not prevented), `@invalid` (capture
phase, one per failing control).

A pending `Button type="submit"` is forced to `type="button"` so loading
states cannot double-submit.
