---
title: Header
description: Page-level header landmark.
---

# Header

A slim landmark wrapper for page headers — pair it with `Separator` and
`Typography` parts to build the masthead.

```vue
<script setup lang="ts">
import {Header} from "@sail-ui/vue/header";
</script>

<template>
  <Header>
    <h1>Dashboard</h1>
    <p class="text-sm">Overview of your workspace.</p>
  </Header>
</template>
```

## Demo

Header is a layout shell; see the docs site's own page headers for it in
action alongside other parts.
