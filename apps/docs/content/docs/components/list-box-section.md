---
title: List Box Section
description: Grouped rows with an automatically associated header.
---

# List Box Section

```vue
<script setup lang="ts">
import {ListBox, ListBoxItem, ListBoxItemIndicator, ListBoxSection} from "@sail-ui/vue/list-box";
import {Header} from "@sail-ui/vue/header";
</script>

<template>
  <ListBox v-model="value" aria-label="Produce" class="w-56">
    <ListBoxSection>
      <Header>Fruits</Header>
      <ListBoxItem value="apple" text-value="Apple">
        <Label>Apple</Label>
        <ListBoxItemIndicator />
      </ListBoxItem>
    </ListBoxSection>
  </ListBox>
</template>
```

## Demo

::demo-collections
::

## API

The section renders `role="group"` with `aria-labelledby` pointing at the
header — no `data-slot`, matching the upstream DOM.
