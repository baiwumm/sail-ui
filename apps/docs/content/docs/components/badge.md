---
title: Badge
description: Count or status marker anchored to another element.
---

# Badge

```vue
<script setup lang="ts">
import {Badge, BadgeAnchor} from "@sail-ui/vue/badge";
</script>

<template>
  <BadgeAnchor>
    <button>Inbox</button>
    <Badge color="primary">3</Badge>
  </BadgeAnchor>
</template>
```

## Demo

::demo-badge
::

## API

| Prop        | Type                   | Notes               |
| ----------- | ---------------------- | ------------------- |
| `color`     | theme colors           |                     |
| `size`      | `"sm" \| "md" \| "lg"` |                     |
| `placement` | corner values          | `bottom-right` etc. |

`BadgeAnchor` wraps the trigger element and positions the badge; the badge
content is the default slot. `BadgeLabel` renders content without anchoring.
