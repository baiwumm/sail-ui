---
title: Alert Dialog
description: Modal confirmation dialog that cannot be dismissed by accident.
---

# Alert Dialog

Like [Modal](/docs/components/modal), but `isDismissable` defaults to `false` —
no outside click, no Escape — so the user must choose an action. Renders
`role="alertdialog"` and a status icon.

```vue
<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeading,
  AlertDialogIcon,
} from "@sail-ui/vue/alert-dialog";
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogBackdrop>
      <AlertDialogContainer>
        <AlertDialogDialog>
          <AlertDialogIcon status="danger" />
          <AlertDialogHeading>Delete file</AlertDialogHeading>
          <AlertDialogBody>This cannot be undone.</AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="secondary" @press="open = false">Cancel</Button>
            <AlertDialogCloseTrigger>
              <Button variant="danger">Delete</Button>
            </AlertDialogCloseTrigger>
          </AlertDialogFooter>
        </AlertDialogDialog>
      </AlertDialogContainer>
    </AlertDialogBackdrop>
  </AlertDialog>
</template>
```

## Demo

::demo-overlay
::

## API

| Prop           | Type      | Notes                      |
| -------------- | --------- | -------------------------- |
| `v-model:open` | `boolean` | controlled state           |
| `defaultOpen`  | `boolean` | uncontrolled initial state |

The backdrop accepts `isDismissable` / `isKeyboardDismissDisabled` to opt back
into outside/Escape dismissal. The exit animation holds until the real CSS
animation finishes (shared overlay contract).
