<script setup lang="ts">
import {useHover} from "@sail-ui/primitives";
import {cx, searchFieldVariants} from "@sail-ui/styles";
import {computed, inject, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {searchFieldContextKey, type SearchFieldGroupProps} from "./types";

defineOptions({name: "SailSearchFieldGroup", inheritAttrs: false});

defineProps<SearchFieldGroupProps>();

const context = inject(searchFieldContextKey, null);
const {className, forwarded} = useForwardedAttrs();
const groupRef = ref<HTMLElement | null>(null);
const isFocusWithin = ref(false);

const isDisabled = computed(() => context?.isDisabled.value ?? false);

const {isHovered} = useHover(groupRef, {isDisabled});

const classes = computed(() =>
  cx(searchFieldVariants().group(), className.value)
);

function handleFocusIn() {
  isFocusWithin.value = true;
}

function handleFocusOut(event: FocusEvent) {
  const group = groupRef.value;
  const next = event.relatedTarget as Node | null;

  if (group && next && group.contains(next)) {
    return;
  }

  isFocusWithin.value = false;
}
</script>

<template>
  <div
    ref="groupRef"
    v-bind="forwarded"
    role="group"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-within="isFocusWithin ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="context?.isInvalid.value ? 'true' : undefined"
    :data-slot="'search-field-group'"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <slot />
  </div>
</template>
