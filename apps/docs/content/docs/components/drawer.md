---
title: Drawer
description: Edge panel with drag-to-dismiss from the handle, header or footer.
---

# Drawer

```vue
<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerDialog,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerHeading,
} from "@sail-ui/vue/drawer";
</script>

<template>
  <Drawer v-model:open="open">
    <DrawerBackdrop>
      <DrawerContent placement="bottom">
        <DrawerDialog>
          <DrawerHandle />
          <DrawerHeader>
            <DrawerHeading>Quick settings</DrawerHeading>
          </DrawerHeader>
          <DrawerBody>…</DrawerBody>
          <DrawerFooter>…</DrawerFooter>
        </DrawerDialog>
      </DrawerContent>
    </DrawerBackdrop>
  </Drawer>
</template>
```

## Demo

::demo-overlay
::

## API

| Prop                           | Type                                                          | Notes      |
| ------------------------------ | ------------------------------------------------------------- | ---------- |
| `placement`                    | `"top" \| "bottom" \| "left" \| "right"` (on `DrawerContent`) | slide edge |
| `v-model:open` / `defaultOpen` | `boolean`                                                     |            |

Drag behaviour matches upstream exactly: activation threshold 8px, dismiss at
30% of the dimension or a 0.5px/ms flick, drag starting only from the handle,
header and footer (body stays scrollable).
