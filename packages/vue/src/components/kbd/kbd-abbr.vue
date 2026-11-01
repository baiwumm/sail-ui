<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {kbdContextKey} from "./context";
import {kbdKeysLabelMap, kbdKeysMap} from "./kbd.constants";
import type {KbdAbbrProps} from "./types";

defineOptions({name: "SailKbdAbbr", inheritAttrs: false});

const props = withDefaults(defineProps<KbdAbbrProps>(), {
  as: "abbr",
});

const {attrs, className, forwarded} = useForwardedAttrs();
const slots = inject(kbdContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.abbr(), className.value));
const title = computed(
  () => (attrs.title as string | undefined) ?? kbdKeysLabelMap[props.keyValue],
);
</script>

<template>
  <Primitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes" :title="title">
    {{ kbdKeysMap[props.keyValue] }}
  </Primitive>
</template>
