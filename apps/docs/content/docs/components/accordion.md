---
title: Accordion
description: Expandable sections with single or multiple open panels.
---

# Accordion

```vue
<script setup lang="ts">
import {
  Accordion,
  AccordionHeading,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@sail-ui/vue/accordion";
</script>

<template>
  <Accordion v-model:expanded-keys="expanded">
    <AccordionItem id="a">
      <AccordionHeading>
        <AccordionTrigger>Question</AccordionTrigger>
      </AccordionHeading>
      <AccordionPanel>Answer.</AccordionPanel>
    </AccordionItem>
  </Accordion>
</template>
```

## Demo

::demo-accordion
::

## API

| Prop                     | Type       | Notes                      |
| ------------------------ | ---------- | -------------------------- |
| `v-model:expanded-keys`  | `string[]` | controlled open items      |
| `defaultExpandedKeys`    | `string[]` | uncontrolled initial state |
| `allowsMultipleExpanded` | `boolean`  | single-open by default     |

## Notes

- Panels animate via the upstream CSS; the RAC-style
  `Disclosure`/`DisclosureGroup` pair is available separately for
  disclosure-only usage.
- Arrow keys move between triggers; Home/End jump to the first/last item.
