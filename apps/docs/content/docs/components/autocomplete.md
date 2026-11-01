---
title: Autocomplete
description: Searchable input with filtered options and clear button.
---

# Autocomplete

```vue
<script setup lang="ts">
import {AutocompleteInput, AutocompleteItem, AutocompleteRoot} from "@sail-ui/vue/autocomplete";
</script>

<template>
  <AutocompleteRoot v-model="value" :items="items">
    <AutocompleteInput placeholder="Search…" />
    <AutocompleteItem v-for="item in items" :key="item" :value="item">
      {{ item }}
    </AutocompleteItem>
  </AutocompleteRoot>
</template>
```

## Demo

::demo-date-color
::

## API

| Prop           | Type                  | Notes                                 |
| -------------- | --------------------- | ------------------------------------- |
| `v-model`      | `key`                 |                                       |
| `ignoreFilter` | `boolean`             | server-side/async filtering           |
| `displayValue` | `(key) => string`     | label for a selected key before mount |
| `variant`      | autocomplete variants | propagated to the inner input         |
| `name`         | `string`              | hidden form control                   |

A custom indicator receives all forwarded attributes (not just class/data
attributes). `onClear` fires from the clear button.
