---
title: Card
description: Composed surface with header, content and footer sections.
---

# Card

```vue
<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sail-ui/vue/card";
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardContent>Body</CardContent>
    <CardFooter>Actions</CardFooter>
  </Card>
</template>
```

## Demo

::demo-card
::

## API

| Prop      | Type          | Notes             |
| --------- | ------------- | ----------------- |
| `variant` | card variants | surface treatment |

Named exports are the template API (ADR 0004); `Card.Header` style tags do not
resolve in Vue. The compound object (`Card.Header`) stays available for
programmatic use.
