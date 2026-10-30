<script setup lang="ts">
import {switchVariants, cx} from "@sail-ui/styles";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {switchContextKey, type SwitchRootProps} from "./types";

defineOptions({name: "SailSwitch", inheritAttrs: false});

const props = withDefaults(defineProps<SwitchRootProps>(), {
  size: "md",
  value: "on",
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
});

const model = defineModel<boolean>({default: false});
const {className, forwarded} = useForwardedAttrs();

const isSelected = computed(() => model.value === true);
const classes = computed(() => cx(switchVariants({size: props.size}).base(), className.value));

function toggle() {
  if (props.isDisabled) {
    return;
  }

  model.value = !isSelected.value;
}

provide(switchContextKey, {
  isSelected,
  isDisabled: computed(() => props.isDisabled),
  isInvalid: computed(() => props.isInvalid),
  isRequired: computed(() => props.isRequired),
  name: computed(() => props.name),
  value: computed(() => props.value),
  toggle,
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
    :data-slot="'switch'"
  >
    <slot />
  </div>
</template>
