---
title: Popover
description: Anchored floating content with arrow, flipping and Escape dismissal.
---

# Popover

```vue
<script setup lang="ts">
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDialog,
  PopoverHeading,
  PopoverTrigger,
} from "@sail-ui/vue/popover";
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button variant="secondary">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverDialog class="w-64">
        <PopoverHeading>Popover title</PopoverHeading>
        <p>Anchored content.</p>
      </PopoverDialog>
    </PopoverContent>
  </Popover>
</template>
```

## Demo

::demo-overlay
::

## API

Placement flips on collision and is mirrored to the upstream
`data-placement` attribute (`auto|top|center|bottom|left|right`), not Floating
UI's `data-side`. Focus returns to the trigger on close; Escape dismisses.
Nesting popovers (submenu-style) is supported through portal stacking — the
component never invents a higher z-index layer.
