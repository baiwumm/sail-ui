---
title: Label
description: Form label associated with its control through the field context.
---

# Label

Inside a field root, `Label` associates itself with the control. In number
fields and sliders it renders a real `<label for>`; in non-labelable widgets it
renders as a `span` wired through `aria-labelledby`, matching the upstream RAC
behaviour.

```vue
<script setup lang="ts">
import {Input, TextField} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
</script>

<template>
  <TextField>
    <Label>Name</Label>
    <Input v-model="name" />
  </TextField>
</template>
```

## Demo

::demo-field-messages
::

## API

| Prop         | Type      | Notes                            |
| ------------ | --------- | -------------------------------- |
| `isDisabled` | `boolean` | inherited from the field context |
| `isInvalid`  | `boolean` |                                  |
| `isRequired` | `boolean` |                                  |
