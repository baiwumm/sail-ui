---
title: Typography
description: Text primitives for headings, paragraphs and inline code.
---

# Typography

```vue
<script setup lang="ts">
import {TypographyCode, TypographyHeading, TypographyParagraph} from "@sail-ui/vue/typography";
</script>

<template>
  <TypographyHeading :level="2">Heading</TypographyHeading>
  <TypographyParagraph>
    Body text with <TypographyCode>inline code</TypographyCode>.
  </TypographyParagraph>
</template>
```

## Demo

::demo-typography
::

## API

### Shared

| Prop       | Type                                           | Notes       |
| ---------- | ---------------------------------------------- | ----------- |
| `color`    | `"default" \| "muted"`                         |             |
| `align`    | `"start" \| "center" \| "end" \| "justify"`    |             |
| `weight`   | `"normal" \| "medium" \| "semibold" \| "bold"` |             |
| `truncate` | `boolean`                                      | single line |

### Parts

- `TypographyHeading` adds `level` (1–6) and renders the matching `h*` tag.
- `TypographyParagraph` adds `size` (`base`/`sm`/`xs`).
- `TypographyCode` renders inline code; `TypographyProse` wraps rendered
  markdown-ish content.
