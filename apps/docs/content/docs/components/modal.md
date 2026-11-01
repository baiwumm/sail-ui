---
title: Modal
description: Overlay dialog with backdrop, exit animation hold and focus management.
---

# Modal

```vue
<script setup lang="ts">
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalHeading,
} from "@sail-ui/vue/modal";
</script>

<template>
  <Modal v-model:open="open">
    <ModalBackdrop>
      <ModalContainer>
        <ModalDialog>
          <ModalHeading>Confirm</ModalHeading>
          <ModalBody>Are you sure?</ModalBody>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  </Modal>
</template>
```

## Demo

::demo-modal
::

## API

| Prop           | Type      | Notes                      |
| -------------- | --------- | -------------------------- |
| `v-model:open` | `boolean` | controlled open state      |
| `defaultOpen`  | `boolean` | uncontrolled initial state |

## Behaviour

- The overlay stays mounted until the real CSS exit animation finishes
  (including WebKit's pending state); opacity is pinned before unmount.
- Focus moves into the dialog on open and returns to the trigger on close;
  Escape and outside dismissal follow `isDismissable`.
- Portals render only while open, so the server never emits overlay DOM.
- `z-index` follows the upstream layers: overlays use
  `--z-index-overlay: 100000`, toasts sit one level above.
