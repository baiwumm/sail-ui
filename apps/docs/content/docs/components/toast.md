---
title: Toast
description: Queue-owned notifications with a per-request manager.
---

# Toast

Toasts need a mounted `ToastProvider` (the Nuxt module mounts it for you; in a
Vite app add `<ToastProvider />` at the app root).

```vue
<script setup lang="ts">
import {useToast} from "@sail-ui/vue/toast";

const toast = useToast();

function saved() {
  toast("Saved", {description: "All changes stored."});
}
</script>
```

## Demo

::demo-toast
::

## API

`useToast()` returns a callable with helpers:

| Call                                     | Behaviour                |
| ---------------------------------------- | ------------------------ |
| `toast(message, options?)`               | default variant          |
| `toast.success/danger/info/warning(...)` | variant helpers          |
| `toast.promise(promise, {...})`          | loading → success/danger |
| `toast.update(id, ...)`                  | update an open toast     |
| `toast.close(id)` / `clear()`            | dismiss                  |

## Notes

- The queue is created per app/request — never a module-level singleton — so
  SSR cannot leak notifications between requests.
- Escape collapses the region; `Alt+T` jumps to the newest toast.
