<script setup lang="ts">
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {cx, toggleButtonVariants} from "@sail-ui/styles";
import {RadioGroupItem, Toggle, ToggleGroupItem} from "reka-ui";
import {computed, inject, ref, type ComponentPublicInstance} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {toggleButtonGroupContextKey} from "../toggle-button-group/types";
import type {ToggleButtonRootProps} from "./types";

defineOptions({name: "SailToggleButton", inheritAttrs: false});

const props = withDefaults(defineProps<ToggleButtonRootProps>(), {
  variant: "default",
  size: undefined,
  isIconOnly: false,
  isDisabled: false,
});

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const model = defineModel<boolean>();
const group = inject(toggleButtonGroupContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const toggleRef = ref<ComponentPublicInstance | null>(null);
const element = computed(() => (toggleRef.value?.$el as Element | null | undefined) ?? null);

const size = computed(() => props.size ?? group?.size.value);
const isDisabled = computed(() => group?.isDisabled.value || props.isDisabled);
const isSelected = computed(() => (group ? group.isSelected(props.value) : model.value === true));

const {isHovered} = useHover(element, {isDisabled});
const {isPressed} = usePress(element, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(element, {isDisabled});

const classes = computed(() =>
  cx(
    toggleButtonVariants({
      isIconOnly: props.isIconOnly,
      size: size.value,
      variant: props.variant,
    }),
    className.value,
  ),
);

const stateAttrs = computed(() => ({
  "data-disabled": isDisabled.value ? "true" : undefined,
  "data-focused": isFocused.value ? "true" : undefined,
  "data-focus-visible": isFocusVisible.value ? "true" : undefined,
  "data-hovered": isHovered.value ? "true" : undefined,
  "data-pressed": isPressed.value ? "true" : undefined,
  "data-selected": isSelected.value ? "true" : undefined,
  "data-slot": "toggle-button",
}));
</script>

<template>
  <ToggleGroupItem
    v-if="group && !group.isSingle.value"
    ref="toggleRef"
    v-bind="{...forwarded, ...stateAttrs}"
    :class="classes"
    :disabled="isDisabled"
    :value="value ?? ''"
  >
    <slot :is-selected="isSelected" />
  </ToggleGroupItem>
  <RadioGroupItem
    v-else-if="group"
    ref="toggleRef"
    v-bind="{...forwarded, ...stateAttrs}"
    :class="classes"
    :disabled="isDisabled"
    :value="value ?? ''"
  >
    <slot :is-selected="isSelected" />
  </RadioGroupItem>
  <Toggle
    v-else
    ref="toggleRef"
    v-bind="{...forwarded, ...stateAttrs}"
    v-model="model"
    :class="classes"
    :disabled="isDisabled"
  >
    <slot :is-selected="isSelected" />
  </Toggle>
</template>
