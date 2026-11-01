---
title: Search Field
description: Text input with clear button, submit event and IME guard.
---

# Search Field

```vue
<script setup lang="ts">
import {
  SearchField,
  SearchFieldClearButton,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldSearchIcon,
} from "@sail-ui/vue/search-field";
</script>

<template>
  <SearchField v-model="query" @submit="search">
    <SearchFieldGroup>
      <SearchFieldSearchIcon />
      <SearchFieldInput placeholder="Search components" />
      <SearchFieldClearButton />
    </SearchFieldGroup>
  </SearchField>
</template>
```

## Demo

::demo-search-field
::

## API

| Prop                                                 | Type     | Notes                               |
| ---------------------------------------------------- | -------- | ----------------------------------- |
| `v-model`                                            | `string` |                                     |
| `variant` / `fullWidth` / `isDisabled` / `isInvalid` |          |                                     |
| `label`                                              | `string` | accessible label bound to the input |
| `name`                                               | `string` | form submission                     |

Events: `@submit` fires on Enter (guarded during IME composition). The clear
button carries `slot="clear"` so the upstream `:has([slot="clear"])` styling
applies.
