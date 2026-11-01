<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {hasSlotContent} from "../../shared/vnode";
import {progressBarContextKey} from "./context";
import type {ProgressBarOutputProps} from "./types";

defineOptions({name: "SailProgressBarOutput", inheritAttrs: false});

withDefaults(defineProps<ProgressBarOutputProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const componentSlots = useSlots() as Slots;
const context = inject(progressBarContextKey, null);
const classes = computed(() => cx(context?.slots.value.output(), className.value));
const hasContent = computed(() => hasSlotContent(componentSlots.default));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'progress-bar-output'"
  >
    <slot v-if="hasContent" />
    <template v-else>
      {{ context?.valueText.value }}
    </template>
  </Primitive>
</template>
