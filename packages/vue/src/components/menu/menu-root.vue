<script setup lang="ts">
import {cx, menuVariants} from "@sail-ui/styles";
import {computed, getCurrentInstance, inject, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {menuIdentityKey, menuSelectionContextKey, menuSurfaceContextKey} from "./context";
import type {MenuRootEmits, MenuRootProps, MenuSelection} from "./types";
import {useMenuSelection} from "./use-menu-selection";

defineOptions({name: "SailMenu", inheritAttrs: false});

const props = withDefaults(defineProps<MenuRootProps>(), {
  selectionMode: "none",
  shouldCloseOnSelect: undefined,
  disallowEmptySelection: undefined,
});

const emit = defineEmits<MenuRootEmits>();
const model = defineModel<MenuSelection>();

const instance = getCurrentInstance();
const {attrs, className, forwarded} = useForwardedAttrs();
const identity = inject(menuIdentityKey, null);
const surface = inject(menuSurfaceContextKey, null);

if (!identity || !surface) {
  throw new Error("Menu must be used inside <DropdownPopover>.");
}

const slots = computed(() => menuVariants());
const classes = computed(() => cx(slots.value, className.value));

const vnodeProps = instance?.vnode.props ?? {};
const selection = useMenuSelection({
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

const labelledBy = computed(() => {
  const explicit = attrs["aria-labelledby"];

  if (explicit) {
    return explicit as string;
  }

  return attrs["aria-label"] !== undefined ? undefined : identity.triggerId.value;
});
</script>

<template>
  <div
    v-bind="forwarded"
    :id="identity.menuId"
    :aria-labelledby="labelledBy"
    :class="classes"
    :data-slot="'menu'"
    role="menu"
  >
    <slot />
  </div>
</template>
