---
title: Alert
description: Contextual feedback banner with status variants and dismissible close.
---

# Alert

```vue
<script setup lang="ts">
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle,
} from "@sail-ui/vue/alert";
</script>

<template>
  <Alert status="info">
    <AlertIndicator />
    <AlertContent>
      <AlertTitle>New version available</AlertTitle>
      <AlertDescription>Sail UI 0.x can be updated from the CLI.</AlertDescription>
    </AlertContent>
  </Alert>
</template>
```

## Demo

::demo-alert
::

## API

| Prop             | Type                                           | Default  |
| ---------------- | ---------------------------------------------- | -------- |
| `status`         | `"info" \| "success" \| "warning" \| "danger"` | `"info"` |
| `as` / `asChild` | polymorphic rendering                          | `div`    |

Compose with `AlertIndicator`, `AlertContent`, `AlertTitle`,
`AlertDescription` and a `CloseButton` for dismissal.
