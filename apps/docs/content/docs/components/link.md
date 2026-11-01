---
title: Link
description: Anchor with hover/focus states and optional trailing icon.
---

# Link

```vue
<script setup lang="ts">
import {Link, LinkIcon} from "@sail-ui/vue/link";
</script>

<template>
  <Link href="https://vuejs.org" target="_blank">
    External link
    <LinkIcon />
  </Link>
</template>
```

## Demo

::demo-link
::

## API

| Prop         | Type      | Notes                                      |
| ------------ | --------- | ------------------------------------------ |
| `href`       | `string`  | without it the link renders as a `span`    |
| `isDisabled` | `boolean` | emits `aria-disabled` and drops the anchor |

The trailing `LinkIcon` is the upstream external-link arrow; a link with an
icon child opts into the icon sizing automatically.
