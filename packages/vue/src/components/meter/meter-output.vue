<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {hasSlotContent} from "../../shared/vnode";
import {meterContextKey} from "./context";
import type {MeterOutputProps} from "./types";

defineOptions({name: "SailMeterOutput", inheritAttrs: false});

withDefaults(defineProps<MeterOutputProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const componentSlots = useSlots() as Slots;
const context = inject(meterContextKey, null);
const classes = computed(() => cx(context?.slots.value.output(), className.value));
const hasContent = computed(() => hasSlotContent(componentSlots.default));
const defaultText = computed(() =>
  context && context.showValueLabel.value ? context.valueText.value : undefined,
);
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'meter-output'"
  >
    <slot v-if="hasContent" />
    <template v-else>{{ defaultText }}</template>
  </Primitive>
</template>
