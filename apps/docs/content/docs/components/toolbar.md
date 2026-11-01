---
title: Toolbar
description: Grouped controls with arrow-key navigation and a single tab stop.
---

# Toolbar

```vue
<script setup lang="ts">
import {Toolbar} from "@sail-ui/vue/toolbar";
</script>

<template>
  <Toolbar aria-label="Editor tools">
    <!-- ToggleButtonGroup, ButtonGroup, … -->
  </Toolbar>
</template>
```

## Demo

::demo-toolbar
::

## API

| Prop          | Type                         | Default        |
| ------------- | ---------------------------- | -------------- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `isAttached`  | `boolean`                    | `false`        |
| `dir`         | `"ltr" \| "rtl"`             | document       |

Behaviour matches the upstream RAC toolbar: arrows move focus between controls
(reversing in RTL), the toolbar is a single tab stop (Tab exits after the last
control, Shift+Tab enters at the first), and inner separators flip their
orientation relative to the toolbar. A nested toolbar degrades to
`role="group"`.
