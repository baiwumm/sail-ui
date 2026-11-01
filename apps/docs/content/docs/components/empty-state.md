---
title: Empty State
description: Placeholder shell for zero-data views.
---

# Empty State

A styled shell for empty views — compose the content with your own markup
(plus Sail UI parts) inside it.

```vue
<script setup lang="ts">
import {EmptyState} from "@sail-ui/vue/empty-state";
</script>

<template>
  <EmptyState>
    <p>No results found</p>
  </EmptyState>
</template>
```

## Demo

::demo-empty-state
::

## API

The root renders a muted, padded container (`empty-state` class). Slots are
free-form; pair with `Button` for the primary action and `Typography` parts
for the copy.
