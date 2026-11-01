---
title: Input OTP
description: One-time-password slots with paste, caret and grouping.
---

# Input OTP

```vue
<script setup lang="ts">
import {InputOtpGroup, InputOtpRoot, InputOtpSlot} from "@sail-ui/vue/input-otp";
</script>

<template>
  <InputOtpRoot v-model="code" :max-length="6" mask>
    <InputOtpGroup>
      <InputOtpSlot :index="0" />
      <InputOtpSlot :index="1" />
      <InputOtpSlot :index="2" />
      <InputOtpSlot :index="3" />
      <InputOtpSlot :index="4" />
      <InputOtpSlot :index="5" />
    </InputOtpGroup>
  </InputOtpRoot>
</template>
```

## API

| Prop        | Type                  | Notes                                         |
| ----------- | --------------------- | --------------------------------------------- |
| `v-model`   | `string`              | gap-free string model like upstream input-otp |
| `maxLength` | `number`              | slot count                                    |
| `pattern`   | `string \| RegExp`    | whole-code validation                         |
| `inputMode` | `"numeric" \| "text"` | mobile keyboard (`numeric` default)           |
| `mask`      | `boolean`             | password-style slot inputs                    |

Events: `@complete` fires once when the code fills (guard against repeats).

Pasting distributes from slot 0 and truncates to the slot count; backspace on
an empty slot walks to the previous one. The hidden native input submits with
the owning form via `name`.
