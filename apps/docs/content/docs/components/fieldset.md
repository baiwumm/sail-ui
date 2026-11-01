---
title: Fieldset
description: Grouped fields with native disabled and cascaded context.
---

# Fieldset

A native `<fieldset disabled>` only disables form-associated elements. Sail UI
cascades the disabled state through context to Button, Link, checkbox/radio
groups, slider and toggle groups — matching the upstream React context
injections.

```vue
<script setup lang="ts">
import {Fieldset, FieldsetLegend} from "@sail-ui/vue/fieldset";
</script>

<template>
  <Fieldset is-disabled>
    <FieldsetLegend>Contact preferences</FieldsetLegend>
    <!-- controls -->
  </Fieldset>
</template>
```

## Demo

::demo-fieldset
::

## API

| Prop         | Type      | Notes                               |
| ------------ | --------- | ----------------------------------- |
| `isDisabled` | `boolean` | native `disabled` + context cascade |
| `as`         | string    | defaults to `fieldset`              |

`FieldsetActions` groups footer buttons; `FieldGroup` arranges inline fields.
