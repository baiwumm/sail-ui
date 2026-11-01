<script setup lang="ts">
import {toggleButtonGroupVariants, cx} from "@sail-ui/styles";
import {RadioGroupRoot, ToggleGroupRoot} from "reka-ui";
import {computed, inject, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDisabledCascade} from "../../shared/disabled-cascade";
import {useDocumentDirection} from "../../shared/direction";
import {toolbarContextKey} from "../toolbar/types";
import {toggleButtonGroupContextKey, type ToggleButtonGroupRootProps} from "./types";

defineOptions({name: "SailToggleButtonGroup", inheritAttrs: false});

const props = withDefaults(defineProps<ToggleButtonGroupRootProps>(), {
  type: "single",
  isDisabled: false,
  fullWidth: false,
  isDetached: false,
});

const model = defineModel<string | string[]>();
const {className, forwarded} = useForwardedAttrs();
const toolbar = inject(toolbarContextKey, null);
const documentDirection = useDocumentDirection();

const resolvedDir = computed(() => props.dir ?? documentDirection.value);

const isSingle = computed(() => props.type !== "multiple");

// `<Fieldset isDisabled>` cascades to the group the browser cannot reach.
const cascadeDisabled = useDisabledCascade();
const isDisabled = computed(() => props.isDisabled || cascadeDisabled.value);

const orientation = computed(() => props.orientation ?? toolbar?.orientation.value ?? "horizontal");

const singleModel = computed({
  get: () => (typeof model.value === "string" ? model.value : undefined),
  set: (value: string | undefined) => {
    model.value = value;
  },
});

const multipleModel = computed({
  get: () => (Array.isArray(model.value) ? model.value : []),
  set: (value: string[]) => {
    model.value = value;
  },
});

const selected = computed<unknown[]>(() =>
  isSingle.value
    ? singleModel.value === undefined
      ? []
      : [singleModel.value]
    : multipleModel.value,
);

const classes = computed(() =>
  cx(
    toggleButtonGroupVariants({
      fullWidth: props.fullWidth,
      isDetached: props.isDetached,
      orientation: orientation.value,
    }).base(),
    className.value,
  ),
);

function isSelected(value: unknown) {
  return selected.value.includes(value);
}

function toggle(value: unknown) {
  if (isDisabled.value) {
    return;
  }

  if (isSingle.value) {
    singleModel.value = singleModel.value === value ? undefined : (value as string);

    return;
  }

  multipleModel.value = isSelected(value)
    ? multipleModel.value.filter((entry) => entry !== value)
    : [...multipleModel.value, value as string];
}

provide(toggleButtonGroupContextKey, {
  isSingle,
  isDisabled,
  size: computed(() => props.size),
  selected,
  isSelected,
  toggle,
});
</script>

<template>
  <RadioGroupRoot
    v-if="isSingle"
    v-model="singleModel"
    v-bind="forwarded"
    :class="classes"
    :data-slot="'toggle-button-group'"
    :disabled="isDisabled"
    :dir="resolvedDir"
    :orientation="orientation"
  >
    <slot />
  </RadioGroupRoot>
  <ToggleGroupRoot
    v-else
    v-model="multipleModel"
    v-bind="forwarded"
    :class="classes"
    :data-slot="'toggle-button-group'"
    :disabled="isDisabled"
    :dir="resolvedDir"
    :orientation="orientation"
    type="multiple"
  >
    <slot />
  </ToggleGroupRoot>
</template>
