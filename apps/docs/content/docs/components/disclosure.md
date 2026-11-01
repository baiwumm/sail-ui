---
title: Disclosure
description: Single expandable section with animated panel.
---

# Disclosure

```vue
<script setup lang="ts">
import {
  Disclosure,
  DisclosureBody,
  DisclosureContent,
  DisclosureHeading,
  DisclosureIndicator,
  DisclosureTrigger,
} from "@sail-ui/vue/disclosure";
</script>

<template>
  <Disclosure id="details">
    <DisclosureHeading>
      <DisclosureTrigger>
        Order details
        <DisclosureIndicator />
      </DisclosureTrigger>
    </DisclosureHeading>
    <DisclosureContent>
      <DisclosureBody>Order #1024 ships on July 12.</DisclosureBody>
    </DisclosureContent>
  </Disclosure>
</template>
```

## Demo

::demo-collections
::

## API

| Prop           | Type      | Notes                            |
| -------------- | --------- | -------------------------------- |
| `v-model:open` | `boolean` | controlled state                 |
| `defaultOpen`  | `boolean` | uncontrolled initial state       |
| `isDisabled`   | `boolean` |                                  |
| `id`           | `string`  | required for group participation |

The panel animation is driven by the shared RAC-style
`useDisclosurePanel` composable (ADR 0008) — it replays the CSS
enter/exit states rather than guessing timings.
