---
title: Checkbox Group
description: Array-valued checkbox collection with shared state.
---

# Checkbox Group

```vue
<script setup lang="ts">
import {Checkbox} from "@sail-ui/vue/checkbox";
import {CheckboxGroup} from "@sail-ui/vue/checkbox-group";
</script>

<template>
  <CheckboxGroup v-model="picked">
    <Checkbox value="newsletter">Newsletter</Checkbox>
    <Checkbox value="releases">Release notes</Checkbox>
  </CheckboxGroup>
</template>
```

## Demo

::demo-checkbox
::

## API

| Prop                                      | Type       | Notes                          |
| ----------------------------------------- | ---------- | ------------------------------ |
| `v-model`                                 | `string[]` |                                |
| `variant`                                 | variants   | propagated to members          |
| `isDisabled` / `isInvalid` / `isRequired` | `boolean`  | cascaded                       |
| `name`                                    | `string`   | submitted with the owning form |

Members inherit the group's variant class (the CSS lives on each checkbox), so
`<CheckboxGroup variant="secondary">` restyles every child.
