---
title: Button
description: Pressable action with variants, sizes, loading and icon-only modes.
---

# Button

```vue
<script setup lang="ts">
import {Button} from "@sail-ui/vue/button";
</script>

<template>
  <Button variant="primary" @press="save">Save</Button>
</template>
```

## Demo

::demo-button
::

## API

### Props

| Prop             | Type                                                                        | Default     |
| ---------------- | --------------------------------------------------------------------------- | ----------- |
| `variant`        | `"primary" \| "secondary" \| "danger" \| …`                                 | `"primary"` |
| `size`           | `"sm" \| "md" \| "lg"`                                                      | `"md"`      |
| `isDisabled`     | `boolean`                                                                   | `false`     |
| `isLoading`      | `boolean` — disables the button and pins the type to `button` while pending | `false`     |
| `isIconOnly`     | `boolean`                                                                   | `false`     |
| `fullWidth`      | `boolean`                                                                   | `false`     |
| `as` / `asChild` | polymorphic rendering                                                       | `button`    |

### Events

| Event   | Payload      | Notes                            |
| ------- | ------------ | -------------------------------- |
| `press` | `PressEvent` | Unified pointer + keyboard press |

## React → Vue differences

- `onPress` becomes `@press`.
- A pending submit button cannot trigger implicit form submission (`type` is forced to `button` while `isLoading`), matching upstream.
- Inside a `ButtonGroup`, `size` / `variant` / `isDisabled` propagate to direct children via context.
