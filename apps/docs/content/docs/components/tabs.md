---
title: Tabs
description: Tabbed sections with automatic or manual activation and per-tab indicators.
---

# Tabs

```vue
<script setup lang="ts">
import {Tab, TabIndicator, TabList, TabListContainer, TabPanel, Tabs} from "@sail-ui/vue/tabs";
</script>

<template>
  <Tabs v-model="value">
    <TabListContainer>
      <TabList aria-label="Project sections">
        <Tab value="overview">
          Overview
          <TabIndicator />
        </Tab>
        <Tab value="activity">
          Activity
          <TabIndicator />
        </Tab>
      </TabList>
    </TabListContainer>
    <TabPanel value="overview">Overview content</TabPanel>
    <TabPanel value="activity">Activity content</TabPanel>
  </Tabs>
</template>
```

## Demo

::demo-collections
::

## API

| Prop                | Type                         | Notes                                 |
| ------------------- | ---------------------------- | ------------------------------------- |
| `v-model`           | `string`                     | selected tab                          |
| `variant` / `align` | variants                     |                                       |
| `orientation`       | `"horizontal" \| "vertical"` |                                       |
| `manual`            | `boolean`                    | arrows move focus, Enter/Space select |

`TabListContainer` adds the scroll arrows (`data-left-scroll` / `data-right-scroll`) when tabs
overflow. Indicators animate per tab (FLIP), panels unmount when inactive and
render `inert` under `force-mount`.
