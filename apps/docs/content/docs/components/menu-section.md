---
title: Menu Section
description: Grouped menu items with a labelled header.
---

# Menu Section

```vue
<script setup lang="ts">
import {DropdownMenu, MenuSection} from "@sail-ui/vue/dropdown";
import {MenuItem, MenuSection as MenuSectionPart} from "@sail-ui/vue/menu";
</script>

<template>
  <DropdownMenu>
    <MenuSection>
      <Header>File</Header>
      <MenuItem value="open" text-value="Open">Open</MenuItem>
    </MenuSection>
  </DropdownMenu>
</template>
```

## Demo

::demo-collections
::

## API

Sections override the selection behaviour of their items when needed (own
state per section), matching the upstream `menu-item.css`
`[data-selection-mode]` selectors.
