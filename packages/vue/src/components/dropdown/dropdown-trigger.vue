<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {DropdownMenuTrigger as DropdownMenuTriggerPrimitive} from "reka-ui";
import {computed, ref, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDropdownContext} from "./context";
import type {DropdownTriggerProps} from "./types";

defineOptions({name: "SailDropdownTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<DropdownTriggerProps>(), {
  isDisabled: false,
  type: "button",
});

const context = useDropdownContext();
const {attrs, className, forwarded} = useForwardedAttrs();

// `aria-controls` names the trigger id, so a consumer changing `id` later has
// to stay in sync.
watch(
  () => attrs.id,
  (id) => {
    if (typeof id === "string" && id.length > 0) {
      context.triggerId.value = id;
    }
  },
  {immediate: true},
);

const triggerRef = ref<HTMLElement | null>(null);
const triggerId = computed(() => context.triggerId.value);
const isOpen = computed(() => context.overlay.isOpen.value);
const isDisabled = computed(() => Boolean(props.isDisabled));
const classes = computed(() => cx(context.slots.value.trigger(), className.value));

const {isHovered} = useHover(triggerRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(triggerRef, {isDisabled});

function setTriggerRef(element: unknown) {
  triggerRef.value = element instanceof HTMLElement ? element : null;
}
</script>

<template>
  <DropdownMenuTriggerPrimitive as-child>
    <button
      :id="triggerId"
      :ref="setTriggerRef"
      v-bind="forwarded"
      :aria-controls="isOpen ? context.menuId : undefined"
      :aria-expanded="isOpen"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-slot="'dropdown-trigger'"
      :data-state="undefined"
      :disabled="isDisabled || undefined"
      :type="type"
    >
      <slot />
    </button>
  </DropdownMenuTriggerPrimitive>
</template>
