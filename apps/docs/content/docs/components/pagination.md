---
title: Pagination
description: Page navigation with summary, ellipsis and RTL-aware arrows.
---

# Pagination

```vue
<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationSummary,
} from "@sail-ui/vue/pagination";
</script>

<template>
  <Pagination aria-label="Docs pages">
    <PaginationSummary>Page {{ page }} of {{ total }}</PaginationSummary>
    <PaginationContent>
      <PaginationItem>
        <PaginationLink :is-active="page === 1" @press="page = 1">1</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationPrevious :is-disabled="page === 1" @press="page--">
          <PaginationPreviousIcon />
          Previous
        </PaginationPrevious>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</template>
```

## Demo

::demo-collections
::

## API

Parts: `PaginationSummary` (`dir="auto"`), `PaginationContent`,
`PaginationItem`, `PaginationLink` (`isActive`), `PaginationPrevious` /
`PaginationNext` (native buttons, disabled at the edges, RTL arrow flip via
the upstream CSS) and `PaginationEllipsis`.

The current page carries `aria-current="page"`.
