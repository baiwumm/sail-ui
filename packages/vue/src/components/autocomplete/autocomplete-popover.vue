<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {ComboboxContent as ComboboxContentPrimitive, ComboboxPortal} from "reka-ui";
import {computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {popperContentElement, useDataPlacement} from "../../shared/popper";
import {useAutocompleteContext} from "./context";
import type {AutocompletePopoverProps} from "./types";

defineOptions({name: "SailAutocompletePopover", inheritAttrs: false});

const props = withDefaults(defineProps<AutocompletePopoverProps>(), {
  placement: "bottom",
  align: "start",
  alignOffset: 0,
  sideOffset: 4,
  avoidCollisions: true,
});

const {attrs, className, forwarded} = useForwardedAttrs();
const context = useAutocompleteContext();
const contentComponent = shallowRef<unknown>(null);
const {element, attach} = useDataPlacement(() => props.placement);

const classes = computed(() => cx(context.slots.value.popover(), className.value));

const forwardedAttrs = computed(() => {
  const rest = {...forwarded.value};

  delete rest.style;

  return rest;
});

const contentStyle = computed(() => [
  attrs.style,
  {
    "--trigger-width": "var(--reka-combobox-trigger-width)",
    "--trigger-anchor-point": "var(--reka-combobox-content-transform-origin)",
  },
]);

function setContentRef(value: unknown) {
  contentComponent.value = value;
}

function syncElement() {
  attach(context.overlay.isMounted.value ? popperContentElement(contentComponent.value) : null);
  context.overlay.contentRef.value = element.value;
}

watch([() => context.overlay.isMounted.value, contentComponent], () => void nextTick(syncElement), {
  flush: "post",
});
onMounted(() => void nextTick(syncElement));
onBeforeUnmount(() => {
  context.overlay.contentRef.value = null;
});
</script>

<template>
  <ComboboxPortal v-if="context.overlay.isMounted.value">
    <ComboboxContentPrimitive
      as-child
      position="popper"
      :align="align"
      :align-offset="alignOffset"
      :avoid-collisions="avoidCollisions"
      :reference="context.triggerRef.value ?? undefined"
      :side="placement"
      :side-offset="sideOffset"
    >
      <div
        :ref="setContentRef"
        v-bind="forwardedAttrs"
        :aria-multiselectable="undefined"
        :aria-orientation="undefined"
        :class="classes"
        :data-empty="undefined"
        :data-entering="context.overlay.isEntering.value ? 'true' : undefined"
        :data-exiting="context.overlay.isExiting.value ? 'true' : undefined"
        :data-orientation="undefined"
        :data-slot="'autocomplete-popover'"
        :data-state="undefined"
        :role="undefined"
        :style="contentStyle"
        :tabindex="undefined"
      >
        <slot />
      </div>
    </ComboboxContentPrimitive>
  </ComboboxPortal>
</template>
