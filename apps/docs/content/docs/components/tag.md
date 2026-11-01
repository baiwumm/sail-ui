---
title: Tag
description: Removable/selection chip inside a TagGroup grid.
---

# Tag

```vue
<script setup lang="ts">
import {Tag} from "@sail-ui/vue/tag";
import {TagGroup, TagGroupList} from "@sail-ui/vue/tag-group";
</script>

<template>
  <TagGroup v-model="tags">
    <TagGroupList>
      <Tag v-for="tag in tags" :key="tag" :value="tag" :text-value="tag">
        {{ tag }}
      </Tag>
    </TagGroupList>
  </TagGroup>
</template>
```

## Demo

::demo-collections
::

## API

| Prop         | Type      | Notes                 |
| ------------ | --------- | --------------------- |
| `value`      | `TagKey`  | selection/removal key |
| `textValue`  | `string`  | typeahead text        |
| `isDisabled` | `boolean` |                       |

The remove button renders only when the group listens for removal, carries
`slot="remove"` and `aria-label="Remove tag"`. Backspace/Delete on a selected
tag removes all selected values (upstream `useTag` semantics).
