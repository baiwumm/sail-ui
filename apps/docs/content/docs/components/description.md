---
title: Description
description: Field helper text linked to its control through the field context.
---

# Description

Inside a `TextField` (or any field family root), `Description` is
automatically associated with the control via `aria-describedby`.

```vue
<script setup lang="ts">
import {Description} from "@sail-ui/vue/description";
import {Input, TextField} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
</script>

<template>
  <TextField>
    <Label>Name</Label>
    <Input v-model="name" />
    <Description>We never share it.</Description>
  </TextField>
</template>
```

## Demo

::demo-field-messages
::

## API

Standalone usage renders a `<span>`; without a field context pass an `id`
manually to wire the association yourself.
