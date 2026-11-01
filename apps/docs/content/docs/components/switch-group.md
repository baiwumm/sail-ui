---
title: Switch Group
description: Vertical or horizontal stack of switches.
---

# Switch Group

```vue
<script setup lang="ts">
import {Switch, SwitchContent, SwitchControl, SwitchThumb} from "@sail-ui/vue/switch";
import {SwitchGroup} from "@sail-ui/vue/switch-group";
</script>

<template>
  <SwitchGroup>
    <Switch v-model="notifications">…</Switch>
    <Switch v-model="analytics">…</Switch>
  </SwitchGroup>
</template>
```

## Demo

::demo-switch
::

## API

| Prop          | Type                         | Default      |
| ------------- | ---------------------------- | ------------ |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` |

The group is a layout shell; each `Switch` owns its own `v-model`.
