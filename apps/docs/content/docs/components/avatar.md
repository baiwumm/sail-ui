---
title: Avatar
description: User image with automatic fallback when the image fails to load.
---

# Avatar

```vue
<script setup lang="ts">
import {Avatar, AvatarFallback, AvatarImage} from "@sail-ui/vue/avatar";
</script>

<template>
  <Avatar size="md">
    <AvatarImage src="/team/ada.png" alt="Ada Lovelace" />
    <AvatarFallback>AL</AvatarFallback>
  </Avatar>
</template>
```

## Demo

::demo-avatar
::

## API

| Prop      | Type                     | Notes |
| --------- | ------------------------ | ----- |
| `size`    | `"sm" \| "md" \| "lg"`   |       |
| `color`   | theme colors             |       |
| `variant` | `"solid" \| "soft" \| …` |       |

`AvatarImage` renders the photo; `AvatarFallback` shows initials when the
image is missing or fails (Reka avatar primitives underneath).
