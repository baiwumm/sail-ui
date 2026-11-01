---
title: Avatar Group
description: Stacked or grid avatar collection with overflow count.
---

# Avatar Group

```vue
<script setup lang="ts">
import {Avatar, AvatarFallback} from "@sail-ui/vue/avatar";
import {AvatarGroup} from "@sail-ui/vue/avatar-group";
</script>

<template>
  <AvatarGroup :max="3">
    <Avatar><AvatarFallback>AL</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>JB</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>KV</AvatarFallback></Avatar>
  </AvatarGroup>
</template>
```

## Demo

::demo-avatar-group
::

## API

| Prop                         | Type           | Default               | Notes                           |
| ---------------------------- | -------------- | --------------------- | ------------------------------- |
| `max`                        | `number`       | —                     | collapses overflow into a count |
| `isGrid`                     | `boolean`      | `false`               | grid layout instead of stacking |
| `overlap`                    | variant values | —                     | stacking direction/amount       |
| `size` / `color` / `variant` | shared values  | propagated to members |

`AvatarGroupCount` renders a custom count node when you need full control.
