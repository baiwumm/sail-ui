---
title: Breadcrumbs
description: Navigation trail with current page and custom separators.
---

# Breadcrumbs

```vue
<script setup lang="ts">
import {Breadcrumbs, BreadcrumbsItem} from "@sail-ui/vue/breadcrumbs";
</script>

<template>
  <Breadcrumbs aria-label="Breadcrumb">
    <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
    <BreadcrumbsItem href="/docs">Docs</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent>Breadcrumbs</BreadcrumbsItem>
  </Breadcrumbs>
</template>
```

## Demo

::demo-breadcrumbs
::

## API

### Breadcrumbs

| Prop         | Type                        | Notes                  |
| ------------ | --------------------------- | ---------------------- |
| `isDisabled` | `boolean`                   | disables every item    |
| `separator`  | `string \| number \| VNode` | custom separator glyph |

### BreadcrumbsItem

| Prop         | Type         | Notes                                   |
| ------------ | ------------ | --------------------------------------- |
| `href`       | `string`     | renders an anchor                       |
| `isCurrent`  | `boolean`    | marks the current page (`aria-current`) |
| `isDisabled` | `boolean`    |                                         |
| `onPress`    | `PressEvent` | via `@press`                            |
