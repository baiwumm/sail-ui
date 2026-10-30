<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {kbdContextKey} from "./context";
import {kbdKeysLabelMap, kbdKeysMap} from "./kbd.constants";
import type {KbdAbbrProps} from "./types";

defineOptions({name: "SailKbdAbbr", inheritAttrs: false});

const props = withDefaults(defineProps<KbdAbbrProps>(), {
  as: "abbr"
});

const attrs = useAttrs();
const slots = inject(kbdContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.abbr(), attrs.class as string | undefined));
const title = computed(
  () => (attrs.title as string | undefined) ?? kbdKeysLabelMap[props.keyValue]
);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :title="title"
  >
    {{ kbdKeysMap[props.keyValue] }}
  </Primitive>
</template>
