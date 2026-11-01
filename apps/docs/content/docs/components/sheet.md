---
title: Sheet
description: Spring-animated mobile surface with snap-style drag dismissal.
---

# Sheet

A mobile-style surface driven by WAAPI spring motion. Drag thresholds are
25% of the dimension with a 0.4px/ms flick velocity (upstream `sheet.utils`
values).

```vue
<script setup lang="ts">
import {
  Sheet,
  SheetBackdrop,
  SheetBody,
  SheetContent,
  SheetDialog,
  SheetHandle,
  SheetHeader,
  SheetHeading,
} from "@sail-ui/vue/sheet";
</script>

<template>
  <Sheet v-model:open="open" placement="bottom">
    <SheetBackdrop>
      <SheetContent>
        <SheetDialog>
          <SheetHandle />
          <SheetHeader>
            <SheetHeading>Sheet title</SheetHeading>
          </SheetHeader>
          <SheetBody>…</SheetBody>
        </SheetDialog>
      </SheetContent>
    </SheetBackdrop>
  </Sheet>
</template>
```

## Demo

::demo-overlay
::

## API

| Prop        | Type                                     | Default    |
| ----------- | ---------------------------------------- | ---------- |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` |

`SheetHandle` is the drag affordance. The overlay layer uses
`--z-index-overlay` per the shared layer contract, and while the exit
animation plays the surface is hidden from assistive technology
(`aria-hidden` / `inert`).
