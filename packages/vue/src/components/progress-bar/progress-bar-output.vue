<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs, useSlots, type Slots} from "vue";

import {hasSlotContent} from "../../shared/vnode";
import {progressBarContextKey} from "./context";
import type {ProgressBarOutputProps} from "./types";

defineOptions({name: "SailProgressBarOutput", inheritAttrs: false});

withDefaults(defineProps<ProgressBarOutputProps>(), {
  as: "span"
});

const attrs = useAttrs();
const componentSlots = useSlots() as Slots;
const context = inject(progressBarContextKey, null);
const classes = computed(() =>
  cx(context?.slots.value.output(), attrs.class as string | undefined)
);
const hasContent = computed(() => hasSlotContent(componentSlots.default));
</script>

<template>
  <Primitive
    v-bind="$attrs"
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
