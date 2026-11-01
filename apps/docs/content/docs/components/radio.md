---
title: Radio
description: Single radio part with control and indicator sub-parts.
---

# Radio

A standalone `Radio` maps to a native radio input. For a group use
[Radio Group](/docs/components/radio-group); a `Radio` inside a group inherits
its state.

```vue
<script setup lang="ts">
import {Radio, RadioContent, RadioControl, RadioIndicator} from "@sail-ui/vue/radio";
</script>

<template>
  <Radio value="free">
    <RadioContent>
      <RadioControl>
        <RadioIndicator />
      </RadioControl>
      Free
    </RadioContent>
  </Radio>
</template>
```

## Demo

::demo-radio
::

## API

| Prop                                      | Type      | Notes                                           |
| ----------------------------------------- | --------- | ----------------------------------------------- |
| `value`                                   | `string`  | submitted key                                   |
| `name`                                    | `string`  | without a name the radio leaves form submission |
| `isDisabled` / `isInvalid` / `isRequired` | `boolean` |                                                 |

The DOM contract matches upstream: a `<label>` wrapping a visually hidden
native `<input type="radio">`.
