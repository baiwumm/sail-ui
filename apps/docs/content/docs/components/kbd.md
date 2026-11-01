---
title: Kbd
description: Keyboard key cap with the upstream key symbol map.
---

# Kbd

```vue
<script setup lang="ts">
import {Kbd} from "@sail-ui/vue/kbd";
</script>

<template>
  <Kbd key-value="command">Command</Kbd>
</template>
```

## Demo

::demo-kbd
::

## API

| Prop       | Type                               | Notes                          |
| ---------- | ---------------------------------- | ------------------------------ |
| `keyValue` | `KbdKey` (command, shift, ctrl, …) | renders the upstream key glyph |
| `variant`  | `"default" \| "light"`             |                                |

`KbdAbbr` renders an abbreviated key label; `kbdKeysMap` / `kbdKeysLabelMap`
are exported for custom key renderings.
