---
title: Disclosure Group
description: Grouped disclosures with single or multiple expansion.
---

# Disclosure Group

```vue
<script setup lang="ts">
import {Disclosure} from "@sail-ui/vue/disclosure";
import {DisclosureGroup} from "@sail-ui/vue/disclosure-group";
</script>

<template>
  <DisclosureGroup :default-expanded-keys="['details']">
    <Disclosure id="details">…</Disclosure>
    <Disclosure id="invoice">…</Disclosure>
  </DisclosureGroup>
</template>
```

## Demo

::demo-collections
::

## API

| Prop                     | Type       | Notes                               |
| ------------------------ | ---------- | ----------------------------------- |
| `defaultExpandedKeys`    | `string[]` | initially expanded `Disclosure` ids |
| `v-model:expanded-keys`  | `string[]` | controlled expansion                |
| `allowsMultipleExpanded` | `boolean`  | single-open by default              |
| `isDisabled`             | `boolean`  | cascades to member disclosures      |

Each member needs a stable `id`; arrow keys move between triggers.
