---
title: Input Group
description: Input shell with prefix and suffix decorations.
---

# Input Group

```vue
<script setup lang="ts">
import {
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  InputGroupSuffix,
} from "@sail-ui/vue/input-group";
</script>

<template>
  <InputGroup>
    <InputGroupPrefix>@</InputGroupPrefix>
    <InputGroupInput placeholder="sail" />
    <InputGroupSuffix>.ui</InputGroupSuffix>
  </InputGroup>
</template>
```

## Demo

::demo-input-group
::

## API

| Prop         | Type                       | Notes                                    |
| ------------ | -------------------------- | ---------------------------------------- |
| `variant`    | `"primary" \| "secondary"` | inherited from the enclosing `TextField` |
| `fullWidth`  | `boolean`                  |                                          |
| `isDisabled` | `boolean`                  | disables the inner control               |
| `isInvalid`  | `boolean`                  |                                          |

Clicking the shell focuses the inner control, matching upstream.
`InputGroupTextArea` swaps the inner control for a textarea.
