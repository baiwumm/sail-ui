---
title: Tag Group
description: Keyboard-navigable tag collection with selection and removal.
---

# Tag Group

```vue
<script setup lang="ts">
import {Tag} from "@sail-ui/vue/tag";
import {TagGroup, TagGroupList} from "@sail-ui/vue/tag-group";
</script>

<template>
  <TagGroup v-model="tags" @remove="onRemove">
    <TagGroupList aria-label="Tags">
      <Tag v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</Tag>
    </TagGroupList>
  </TagGroup>
</template>
```

## Demo

::demo-collections
::

## API

| Prop            | Type                               | Notes                      |
| --------------- | ---------------------------------- | -------------------------- |
| `v-model`       | `key \| key[]`                     | depends on `selectionMode` |
| `selectionMode` | `"none" \| "single" \| "multiple"` |                            |
| `disabledKeys`  | `Iterable<key>`                    |                            |

Events: `@remove` (with the removed values), Escape clears selection.

Keyboard mirrors the upstream RAC grid: arrows move between tags,
Home/End jump, typeahead matches, focus returns to the next tag after removal.
Description/ErrorMessage association is explicit (ADR 0010).
