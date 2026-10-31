<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {
  DropdownMenuContent as DropdownMenuContentPrimitive,
  DropdownMenuPortal,
  DropdownMenuSubContent as DropdownMenuSubContentPrimitive,
} from "reka-ui";
import {computed, inject, nextTick, onBeforeUnmount, provide, shallowRef, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {popperContentElement, useDataPlacement} from "../../shared/popper";
import {menuSubmenuContextKey, menuSurfaceContextKey} from "../menu/context";
import {useDropdownContext} from "./context";
import type {DropdownPopoverProps} from "./types";

defineOptions({name: "SailDropdownPopover", inheritAttrs: false});

const props = withDefaults(defineProps<DropdownPopoverProps>(), {
  placement: "bottom",
  align: "center",
  alignOffset: 0,
  sideOffset: 0,
  avoidCollisions: true,
});

const dropdown = useDropdownContext();
const submenu = inject(menuSubmenuContextKey, null);
const {attrs, className, forwarded} = useForwardedAttrs();

const overlay = submenu?.overlay ?? dropdown.overlay;

const contentComponent = shallowRef<unknown>(null);
const {element, attach} = useDataPlacement(() => props.placement);

const classes = computed(() => cx(dropdown.slots.value.popover(), className.value));

const forwardedAttrs = computed(() => {
  const rest = {...forwarded.value};

  delete rest.style;

  return rest;
});

const contentStyle = computed(() => [
  {
    // Reka's fixed wrapper shrinks to the content width, so the upstream
    // percentage-based floor would resolve against the text instead of the
    // viewport. Restating it in viewport units restores the intended width.
    minWidth: "min(calc(var(--spacing) * 55), calc(100svw - 2rem))",
    maxWidth: "calc(100svw - 2rem)",
    "--trigger-anchor-point": "var(--reka-popper-transform-origin)",
  },
  attrs.style,
]);

const surfaceAttrs = computed(() => ({
  ...forwardedAttrs.value,
  "aria-labelledby": attrs["aria-labelledby"] as string | undefined,
  "aria-orientation": attrs["aria-orientation"] as "horizontal" | "vertical" | undefined,
  class: classes.value,
  "data-entering": overlay.isEntering.value ? "true" : undefined,
  "data-exiting": overlay.isExiting.value ? "true" : undefined,
  "data-slot": "dropdown-popover",
  "data-state": undefined,
  id: attrs.id as string | undefined,
  role: attrs.role as string | undefined,
  style: contentStyle.value,
}));

provide(menuSubmenuContextKey, null);
provide(menuSurfaceContextKey, {
  close: () => {
    if (submenu) {
      submenu.overlay.close();
    }

    dropdown.overlay.close();
  },
});

function setContentRef(value: unknown) {
  contentComponent.value = value;
}

function syncElement() {
  attach(overlay.isMounted.value ? popperContentElement(contentComponent.value) : null);
  overlay.contentRef.value = element.value;
}

watch([() => overlay.isMounted.value, contentComponent], () => void nextTick(syncElement), {
  flush: "post",
});

onBeforeUnmount(() => {
  overlay.contentRef.value = null;
});
</script>

<template>
  <DropdownMenuPortal v-if="overlay.isMounted.value">
    <DropdownMenuContentPrimitive
      v-if="!submenu"
      :ref="setContentRef"
      as-child
      :align="align"
      :align-offset="alignOffset"
      :avoid-collisions="avoidCollisions"
      :side="placement"
      :side-offset="sideOffset"
    >
      <div v-bind="surfaceAttrs">
        <slot />
      </div>
    </DropdownMenuContentPrimitive>
    <DropdownMenuSubContentPrimitive
      v-else
      :ref="setContentRef"
      as-child
      :align-offset="alignOffset"
      :avoid-collisions="avoidCollisions"
      :side-offset="sideOffset"
    >
      <div v-bind="surfaceAttrs">
        <slot />
      </div>
    </DropdownMenuSubContentPrimitive>
  </DropdownMenuPortal>
</template>
