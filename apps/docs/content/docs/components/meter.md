---
title: Meter
description: Semantic role="meter" gauge for resource usage values.
---

# Meter

A meter is **not** a progress bar: it reports a resource level (disk, battery,
storage) rather than task progress, so it renders `role="meter"` — never a
progressbar impersonation (ADR 0005).

```vue
<script setup lang="ts">
import {Meter, MeterFill, MeterOutput, MeterTrack} from "@sail-ui/vue/meter";
</script>

<template>
  <Meter :value="72" aria-label="Disk usage">
    <MeterTrack>
      <MeterFill />
    </MeterTrack>
    <MeterOutput />
  </Meter>
</template>
```

## API

| Prop                    | Type                       | Notes                                          |
| ----------------------- | -------------------------- | ---------------------------------------------- |
| `value`                 | `number`                   | clamped to min/max in the ARIA output          |
| `minValue` / `maxValue` | `number`                   | e.g. 0–100                                     |
| `valueLabel`            | `string`                   | custom label (`aria-valuetext`)                |
| `formatOptions`         | `Intl.NumberFormatOptions` | default renders a percent                      |
| `showValueLabel`        | `boolean`                  | hides the visible text, keeps `aria-valuetext` |
| `color`                 | meter colors               | e.g. danger when nearly full                   |
| `isDisabled`            | `boolean`                  | presence-semantic `data-disabled`              |

The default `aria-valuetext` is the percent form of `value` between the
bounds, matching RAC's meter.
