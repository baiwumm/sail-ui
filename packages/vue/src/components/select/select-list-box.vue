<script setup lang="ts">
import {cx, listboxVariants} from "@sail-ui/styles";
import {injectFieldRootContext, injectSelectRootContext} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {SelectListBoxProps} from "./types";

defineOptions({name: "SailSelectListBox", inheritAttrs: false});

const props = defineProps<SelectListBoxProps>();

const {attrs, className, forwarded} = useForwardedAttrs();
const rootContext = injectSelectRootContext();
const field = injectFieldRootContext(null);

const classes = computed(() => cx(listboxVariants({variant: props.variant}), className.value));

const labelledBy = computed(() => {
  const explicit = attrs["aria-labelledby"];

  if (explicit) {
    return explicit as string;
  }

  return field?.labelId.value;
});
</script>

<template>
  <div
    v-bind="forwarded"
    :id="rootContext.contentId"
    :aria-labelledby="labelledBy"
    :aria-multiselectable="rootContext.multiple.value ? 'true' : undefined"
    :class="classes"
    :data-slot="'list-box'"
    role="listbox"
  >
    <slot />
  </div>
</template>
