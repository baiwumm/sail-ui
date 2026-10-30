<script setup lang="ts">
import {buttonGroupVariants, cx} from "@sail-ui/styles";
import {computed, provide, useAttrs} from "vue";

import {buttonGroupContextKey, type ButtonGroupRootProps} from "./types";

defineOptions({name: "SailButtonGroup", inheritAttrs: false});

const props = withDefaults(defineProps<ButtonGroupRootProps>(), {
  fullWidth: false,
  isDisabled: false,
  orientation: "horizontal"
});

const attrs = useAttrs();

const classes = computed(() =>
  cx(
    buttonGroupVariants({
      fullWidth: props.fullWidth,
      orientation: props.orientation
    }).base(),
    attrs.class as string | undefined
  )
);

provide(buttonGroupContextKey, {
  size: computed(() => props.size),
  variant: computed(() => props.variant),
  isDisabled: computed(() => props.isDisabled),
  fullWidth: computed(() => props.fullWidth)
});
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :class="classes"
    :data-slot="'button-group'"
  >
    <slot />
  </div>
</template>
