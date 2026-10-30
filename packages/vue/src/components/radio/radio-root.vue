<script setup lang="ts">
import {radioVariants, cx} from "@sail-ui/styles";
import {computed, inject, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {radioGroupContextKey} from "../radio-group/types";
import {radioContextKey, type RadioRootProps} from "./types";

defineOptions({name: "SailRadio", inheritAttrs: false});

const props = withDefaults(defineProps<RadioRootProps>(), {
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
});

const model = defineModel<string>();
const group = inject(radioGroupContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const isSelected = computed(() =>
  group ? group.selectedValue.value === props.value : model.value === props.value,
);
const isDisabled = computed(() => group?.isDisabled.value || props.isDisabled);
const isInvalid = computed(() => group?.isInvalid.value || props.isInvalid);
const isRequired = computed(() => group?.isRequired.value || props.isRequired);
const name = computed(() => props.name ?? group?.name.value ?? props.value);

const classes = computed(() => cx(radioVariants().base(), className.value));

// Roving tab index: the selected radio is the only tab stop. Without a
// selection every radio stays reachable, matching the upstream contract.
const tabIndex = computed(() => {
  if (isDisabled.value) {
    return -1;
  }

  if (isSelected.value) {
    return 0;
  }

  return group?.hasSelection.value ? -1 : 0;
});

provide(radioContextKey, {
  isSelected,
  isDisabled,
  isInvalid,
  isRequired,
  name,
  value: computed(() => props.value),
  tabIndex,
  select: () => {
    if (isDisabled.value) {
      return;
    }

    if (group) {
      group.select(props.value);

      return;
    }

    model.value = props.value;
  },
});
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-required="isRequired ? 'true' : undefined"
    :data-selected="isSelected ? 'true' : undefined"
    :data-slot="'radio'"
  >
    <slot />
  </div>
</template>
