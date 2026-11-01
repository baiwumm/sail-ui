---
title: Table
description: Data-driven grid with sorting, selection, resizing and virtualization.
---

# Table

Sail UI's table is **data-driven** (`columns` + `data`), not a collection of
RAC-style parts (ADR 0005). TanStack table powers the data model; the DOM,
ARIA grid semantics and 2D keyboard navigation are implemented on the Sail UI
contract.

```vue
<script setup lang="ts">
import {Table} from "@sail-ui/vue/table";
import type {TableColumn} from "@sail-ui/vue/table";

const columns: TableColumn[] = [
  {key: "name", header: "Name", allowsSorting: true, isRowHeader: true},
  {key: "role", header: "Role"},
];
</script>

<template>
  <Table :columns="columns" :data="rows" :get-row-key="(row) => row.id" />
</template>
```

## Demo

::demo-table
::

## API

### Core props

| Prop                        | Type                               | Notes                                                  |
| --------------------------- | ---------------------------------- | ------------------------------------------------------ |
| `columns`                   | `TableColumn[]`                    | `key`, `header`, `allowsSorting`, `align`, width hints |
| `data`                      | `Row[]`                            | plain objects                                          |
| `getRowKey`                 | `(row, index) => string \| number` | stable row identity                                    |
| `selectionMode`             | `"none" \| "single" \| "multiple"` | checkbox selection column                              |
| `sortDescriptor`            | `{column, direction}`              | controlled sorting                                     |
| `isResizable`               | `boolean`                          | pointer-drag column widths                             |
| `isVirtualized`             | `boolean`                          | fixed `rowHeight` (44px default)                       |
| `hasMore` / `isLoadingMore` | `boolean`                          | `#loadMore` sentinel + `@load-more`                    |

### Slots

- `#cell-<key>` / `#header-<key>` — custom cell and header content
  (`row` is the original data row).
- `#empty` — empty state; `#loading` — loading row.

## React → Vue differences

- No `TableContent` / `TableRow` parts — map your data with `columns`/`data`.
- Virtualized mode renders a `role="grid"` div structure (rows/cells wrapped in
  `role="presentation"`); consumer CSS targeting `<table>` elements does not
  apply there.
