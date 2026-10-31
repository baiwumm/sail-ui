<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, getCurrentInstance, inject, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {menuIdentityKey, menuSelectionContextKey, menuSurfaceContextKey} from "../menu/context";
import type {MenuSelection} from "../menu/types";
import {useMenuSelection} from "../menu/use-menu-selection";
import {useDropdownContext} from "./context";
import type {DropdownMenuEmits, DropdownMenuProps} from "./types";

defineOptions({name: "SailDropdownMenu", inheritAttrs: false});

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  selectionMode: "none",
  shouldCloseOnSelect: undefined,
  disallowEmptySelection: undefined,
});

const emit = defineEmits<DropdownMenuEmits>();
const model = defineModel<MenuSelection>();

const dropdown = useDropdownContext();
const identity = inject(menuIdentityKey, null);
const surface = inject(menuSurfaceContextKey, null);

if (!identity || !surface) {
  throw new Error("DropdownMenu must be used inside <DropdownPopover>.");
}

const instance = getCurrentInstance();
const {attrs, className, forwarded} = useForwardedAttrs();
const classes = computed(() => cx(dropdown.slots.value.menu(), className.value));

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
    :data-selection-mode="selectionMode === 'none' ? undefined : selectionMode"
    :data-slot="'dropdown-menu'"
    role="menu"
  >
    <slot />
  </div>
</template>
