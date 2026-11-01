---
title: Switch
description: Toggle control with the native checkbox form contract.
---

# Switch

```vue
<script setup lang="ts">
import {Switch, SwitchContent, SwitchControl, SwitchThumb} from "@sail-ui/vue/switch";
</script>

<template>
  <Switch v-model="notifications">
    <SwitchContent>
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      Notifications
    </SwitchContent>
  </Switch>
</template>
```

## Demo

::demo-switch
::

## API

| Prop                                      | Type      | Notes                                     |
| ----------------------------------------- | --------- | ----------------------------------------- |
| `v-model`                                 | `boolean` |                                           |
| `size`                                    | sizes     |                                           |
| `isDisabled` / `isInvalid` / `isRequired` | `boolean` |                                           |
| `name` / `value`                          | `string`  | hidden input submits with the owning form |

The DOM matches upstream: a `<label role="switch">` wrapping a hidden native
`<input type="checkbox">`.
