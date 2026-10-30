<script setup lang="ts">
import {cx, searchFieldVariants} from "@sail-ui/styles";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {searchFieldContextKey, type SearchFieldRootProps} from "./types";

defineOptions({name: "SailSearchField", inheritAttrs: false});

const props = withDefaults(defineProps<SearchFieldRootProps>(), {
  variant: "primary",
  fullWidth: false,
  isDisabled: false,
  isInvalid: false,
});

const emit = defineEmits<{
  submit: [value: string];
}>();

const model = defineModel<string>({default: ""});
const {className, forwarded} = useForwardedAttrs();

const slots = computed(() =>
  searchFieldVariants({
    fullWidth: props.fullWidth,
    variant: props.variant,
  }),
);

const classes = computed(() => cx(slots.value.base(), className.value));
const isEmpty = computed(() => model.value.length === 0);

provide(searchFieldContextKey, {
  value: computed(() => model.value),
  isEmpty,
  isDisabled: computed(() => props.isDisabled),
  isInvalid: computed(() => props.isInvalid),
  setValue: (value: string) => {
    model.value = value;
  },
  clear: () => {
    model.value = "";
  },
  submit: (value: string) => {
    emit("submit", value);
  },
});
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-empty="isEmpty ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'search-field'"
  >
    <slot />
  </div>
</template>
