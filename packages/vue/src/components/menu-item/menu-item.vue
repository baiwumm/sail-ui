<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx, menuItemVariants} from "@sail-ui/styles";
import {
  DropdownMenuItem as DropdownMenuItemPrimitive,
  DropdownMenuSubTrigger as DropdownMenuSubTriggerPrimitive,
} from "reka-ui";
import {
  computed,
  inject,
  provide,
  ref,
  useId,
  useSlots,
  type AriaAttributes,
  type Slots,
} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {descriptionContextKey} from "../../shared/description-context";
import {labelContextKey} from "../../shared/label-context";
import {containsComponent, flattenVNodes} from "../../shared/vnode";
import DescriptionRoot from "../description/description.vue";
import LabelRoot from "../label/label.vue";
import {menuSelectionContextKey, menuSubmenuContextKey} from "../menu/context";
import {menuItemContextKey} from "./context";
import type {MenuItemProps} from "./types";

type Booleanish = boolean | "true" | "false";

defineOptions({name: "SailMenuItem", inheritAttrs: false});

const props = withDefaults(defineProps<MenuItemProps>(), {
  variant: "default",
});

const menuContext = inject(menuSelectionContextKey, null);
const submenu = inject(menuSubmenuContextKey, null);
const componentSlots = useSlots() as Slots;
const {attrs, className, forwarded} = useForwardedAttrs();

if (!menuContext) {
  throw new Error("MenuItem must be used inside <Menu> or <DropdownMenu>.");
}

const menu = menuContext;

const itemRef = ref<HTMLElement | null>(null);
const labelId = useId();
const descriptionId = useId();

const slots = computed(() => menuItemVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value.item(), className.value));
const isDisabled = computed(() => props.isDisabled || menu.isDisabled(props.value));
const isSelected = computed(() => menu.isSelected(props.value));
const hasSubmenu = computed(() => submenu !== null);
const isSubmenuOpen = computed(() => submenu?.isOpen.value ?? false);

const nodes = computed(() => flattenVNodes(componentSlots.default?.() ?? []));
const hasLabel = computed(() => containsComponent(nodes.value, LabelRoot));
const hasDescription = computed(() => containsComponent(nodes.value, DescriptionRoot));

const labelledBy = computed(() => {
  const explicit = attrs["aria-labelledby"];

  if (explicit) {
    return explicit as string;
  }

  return hasLabel.value ? labelId : undefined;
});

const ariaLabel = computed(() => {
  if (attrs["aria-label"] !== undefined) {
    return attrs["aria-label"] as string;
  }

  return hasLabel.value ? undefined : props.textValue;
});

const describedBy = computed(() => {
  const explicit = attrs["aria-describedby"];

  if (explicit) {
    return explicit as string;
  }

  return hasDescription.value ? descriptionId : undefined;
});

const role = computed(() => {
  if (hasSubmenu.value) {
    return "menuitem";
  }

  switch (menu.selectionMode.value) {
    case "single":
      return "menuitemradio";
    case "multiple":
      return "menuitemcheckbox";
    default:
      return "menuitem";
  }
});

const ariaChecked = computed<Booleanish | undefined>(() => {
  if (hasSubmenu.value || menu.selectionMode.value === "none") {
    return undefined;
  }

  return isSelected.value ? "true" : "false";
});

const ariaExpanded = computed<Booleanish | undefined>(() => {
  if (!submenu) {
    return attrs["aria-expanded"] as Booleanish | undefined;
  }

  return isSubmenuOpen.value ? "true" : "false";
});

const ariaControls = computed(() => {
  if (!submenu) {
    return attrs["aria-controls"] as string | undefined;
  }

  return isSubmenuOpen.value ? submenu.menuId : undefined;
});

const ariaHaspopup = computed<AriaAttributes["aria-haspopup"]>(() => {
  if (!submenu) {
    return attrs["aria-haspopup"] as AriaAttributes["aria-haspopup"];
  }

  return "menu";
});

const resolvedId = computed(() => (submenu ? submenu.triggerId : (attrs.id as string | undefined)));
const dataSlot = computed(() => (hasSubmenu.value ? "dropdown-submenu-trigger" : "menu-item"));

const {isHovered} = useHover(itemRef, {isDisabled});
const {isPressed} = usePress(itemRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(itemRef, {isDisabled});

const surfaceAttrs = computed(() => ({
  ...forwarded.value,
  "aria-checked": ariaChecked.value,
  "aria-controls": ariaControls.value,
  "aria-describedby": describedBy.value,
  "aria-disabled": (isDisabled.value ? "true" : undefined) as Booleanish | undefined,
  "aria-expanded": ariaExpanded.value,
  "aria-haspopup": ariaHaspopup.value,
  "aria-label": ariaLabel.value,
  "aria-labelledby": labelledBy.value,
  class: classes.value,
  "data-disabled": isDisabled.value ? "true" : undefined,
  "data-focused": isFocused.value ? "true" : undefined,
  "data-focus-visible": isFocusVisible.value ? "true" : undefined,
  "data-has-submenu": hasSubmenu.value ? "true" : undefined,
  "data-highlighted": undefined,
  "data-hovered": isHovered.value ? "true" : undefined,
  "data-open": isSubmenuOpen.value ? "true" : undefined,
  "data-pressed": isPressed.value ? "true" : undefined,
  "data-selected": isSelected.value ? "true" : undefined,
  "data-selection-mode": menu.selectionMode.value === "none" ? undefined : menu.selectionMode.value,
  "data-slot": dataSlot.value,
  "data-state": undefined,
  id: resolvedId.value,
  role: role.value,
}));

provide(labelContextKey, {id: labelId, elementType: "span"});
provide(descriptionContextKey, {id: descriptionId});

provide(menuItemContextKey, {
  isSelected,
  hasSubmenu,
  isSubmenuOpen,
  indicatorClass: computed(() => slots.value.indicator()),
  submenuIndicatorClass: computed(() => slots.value.submenuIndicator()),
});

function handleSelect(event: Event) {
  event.preventDefault();

  if (isDisabled.value) {
    return;
  }

  menu.activate(props.value);
}
</script>

<template>
  <DropdownMenuSubTriggerPrimitive
    v-if="submenu"
    as-child
    :disabled="isDisabled"
    :text-value="textValue"
  >
    <div ref="itemRef" v-bind="surfaceAttrs">
      <slot v-bind="{isSelected: isSelected}" />
    </div>
  </DropdownMenuSubTriggerPrimitive>
  <DropdownMenuItemPrimitive
    v-else
    as-child
    :disabled="isDisabled"
    :text-value="textValue"
    @select="handleSelect"
  >
    <div ref="itemRef" v-bind="surfaceAttrs">
      <slot v-bind="{isSelected: isSelected}" />
    </div>
  </DropdownMenuItemPrimitive>
</template>
