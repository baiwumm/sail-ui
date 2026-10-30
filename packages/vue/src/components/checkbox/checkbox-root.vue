<script setup lang="ts">
import {checkboxVariants, cx} from "@sail-ui/styles";
import {computed, inject, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {checkboxGroupContextKey} from "../checkbox-group/types";
import {checkboxContextKey, type CheckboxRootProps} from "./types";

defineOptions({name: "SailCheckbox", inheritAttrs: false});

const props = withDefaults(defineProps<CheckboxRootProps>(), {
  value: "on",
  variant: "primary",
  isDisabled: false,
  isInvalid: false,
  isRequired: false
});

const model = defineModel<boolean | "indeterminate">({default: false});
const group = inject(checkboxGroupContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const isSelected = computed(() =>
  group ? group.isSelected(props.value) : model.value === true
);
const isIndeterminate = computed(() =>
  group ? false : model.value === "indeterminate"
);
const isDisabled = computed(() => group?.isDisabled.value || props.isDisabled);
const isInvalid = computed(() => group?.isInvalid.value || props.isInvalid);
const isRequired = computed(() => group?.isRequired.value || props.isRequired);

const classes = computed(() =>
  cx(checkboxVariants({variant: props.variant}).base(), className.value)
);

function toggle() {
  if (isDisabled.value) {
    return;
  }

  if (group) {
    group.toggle(props.value);

    return;
  }

  if (isIndeterminate.value) {
    model.value = true;

    return;
  }

  model.value = !isSelected.value;
}

provide(checkboxContextKey, {
  isSelected,
  isIndeterminate,
  isDisabled,
  isInvalid,
  isRequired,
  name: computed(() => props.name ?? group?.name.value),
  value: computed(() => props.value),
  toggle
});
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-indeterminate="isIndeterminate ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-required="isRequired ? 'true' : undefined"
    :data-selected="isSelected ? 'true' : undefined"
    :data-slot="'checkbox'"
  >
    <slot />
  </div>
</template>
