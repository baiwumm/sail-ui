---
title: Checkbox
description: Self-implemented label + hidden native input, with group and indeterminate support.
---

# Checkbox

Checkboxes reuse the upstream DOM contract: a `<label>` wrapping a visually
hidden native `<input type="checkbox">`, so native form semantics and browser
behaviour are preserved.

```vue
<script setup lang="ts">
import {Checkbox, CheckboxGroup} from "@sail-ui/vue/checkbox";
</script>

<template>
  <CheckboxGroup v-model="picked">
    <Checkbox value="a">A</Checkbox>
    <Checkbox value="b">B</Checkbox>
  </CheckboxGroup>
</template>
```

## Demo

::demo-checkbox
::

## API

### Checkbox props

| Prop                                      | Type                         | Notes                   |
| ----------------------------------------- | ---------------------------- | ----------------------- |
| `v-model`                                 | `boolean \| "indeterminate"` | standalone mode         |
| `value`                                   | `string`                     | key inside a group      |
| `isIndeterminate`                         | `boolean`                    | renders the mixed state |
| `isDisabled` / `isInvalid` / `isRequired` | `boolean`                    |                         |

### Group

`CheckboxGroup` takes `v-model` as `string[]` and propagates `variant`,
`isDisabled`, `isInvalid`, `isRequired` and `name` to its members. A disabled
`Fieldset` also cascades into the group.
