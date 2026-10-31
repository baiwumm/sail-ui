<script setup lang="ts">
import {cx, menuSectionVariants} from "@sail-ui/styles";
import {computed, getCurrentInstance, inject, provide, useId, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {headerContextKey} from "../../shared/header-context";
import {containsComponent, flattenVNodes} from "../../shared/vnode";
import HeaderRoot from "../header/header.vue";
import {menuSelectionContextKey, menuSurfaceContextKey} from "../menu/context";
import type {MenuSelection} from "../menu/types";
import {useMenuSelection} from "../menu/use-menu-selection";
import type {MenuSectionEmits, MenuSectionProps} from "./types";

defineOptions({name: "SailMenuSection", inheritAttrs: false});

const props = withDefaults(defineProps<MenuSectionProps>(), {
  shouldCloseOnSelect: undefined,
  disallowEmptySelection: undefined,
});
const emit = defineEmits<MenuSectionEmits>();
const model = defineModel<MenuSelection>();

const instance = getCurrentInstance();
const componentSlots = useSlots() as Slots;
const {attrs, className, forwarded} = useForwardedAttrs();
const parent = inject(menuSelectionContextKey, null);
const surface = inject(menuSurfaceContextKey, null);

if (!parent || !surface) {
  throw new Error("MenuSection must be used inside <Menu> or <DropdownMenu>.");
}

const headerId = useId();
const classes = computed(() => cx(menuSectionVariants(), className.value));
const hasHeader = computed(() =>
  containsComponent(flattenVNodes(componentSlots.default?.() ?? []), HeaderRoot),
);
const labelledBy = computed(() => {
  const explicit = attrs["aria-labelledby"];

  if (explicit) {
    return explicit as string;
  }

  return hasHeader.value ? headerId : undefined;
});

const vnodeProps = instance?.vnode.props ?? {};
const selection = useMenuSelection({
  parent,
  selectionMode: () => props.selectionMode,
  defaultValue: () => props.defaultValue,
  model,
  isControlled: "modelValue" in vnodeProps || "model-value" in vnodeProps,
  disabledKeys: () => props.disabledKeys,
  shouldCloseOnSelect: () => props.shouldCloseOnSelect,
  disallowEmptySelection: () => props.disallowEmptySelection,
  onSelectionChange: (value) => emit("selection-change", value),
  onAction: (key) => emit("action", key),
  requestClose: surface.close,
});

provide(menuSelectionContextKey, selection);
provide(headerContextKey, {id: headerId});
</script>

<template>
  <section v-bind="forwarded" :aria-labelledby="labelledBy" :class="classes" role="group">
    <slot />
  </section>
</template>
