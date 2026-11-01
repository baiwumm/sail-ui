<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {comboBoxVariants, cx} from "@sail-ui/styles";
import {ComboboxRoot as ComboboxRootPrimitive, FieldRoot} from "reka-ui";
import {computed, getCurrentInstance, provide, ref} from "vue";

import {createComboboxBinding, comboboxContextKey} from "../../shared/combobox-context";
import {useForwardedAttrs} from "../../shared/attrs";
import {comboBoxContextKey} from "./context";
import type {ComboBoxKey, ComboBoxModelValue} from "../../shared/combobox-context";
import type {ComboBoxRootProps} from "./types";

defineOptions({name: "SailComboBoxRoot", inheritAttrs: false});

const props = withDefaults(defineProps<ComboBoxRootProps>(), {
  menuTrigger: "focus",
  allowsCustomValue: false,
  ignoreFilter: false,
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
  fullWidth: false,
  defaultInputValue: "",
});

const emit = defineEmits<{
  "selection-change": [value: ComboBoxModelValue];
  "update:open": [open: boolean];
}>();

const {className, forwarded} = useForwardedAttrs();
const instance = getCurrentInstance();
const vnodeProps = instance?.vnode.props ?? {};

const model = defineModel<ComboBoxKey>();
const inputModel = defineModel<string>("inputValue");
const openModel = defineModel<boolean>("open", {default: undefined as unknown as boolean});

const isValueControlled = "modelValue" in vnodeProps || "model-value" in vnodeProps;
const isInputControlled = "inputValue" in vnodeProps || "input-value" in vnodeProps;

const internalValue = ref<ComboBoxKey | undefined>(props.defaultValue);
const internalInput = ref(props.defaultInputValue);

const value = computed<ComboBoxModelValue>({
  get: () => (isValueControlled ? model.value : internalValue.value),
  set: (next) => {
    internalValue.value = next;
    model.value = next;
  },
});

const inputValue = computed<string>({
  get: () => (isInputControlled ? (inputModel.value ?? "") : internalInput.value),
  set: (next) => {
    internalInput.value = next;
    inputModel.value = next;
  },
});

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const slots = computed(() =>
  comboBoxVariants({
    fullWidth: props.fullWidth,
  }),
);

const classes = computed(() => cx(slots.value.base(), className.value));
const isDisabled = computed(() => Boolean(props.isDisabled));

const {binding} = createComboboxBinding({
  allowsCustomValue: computed(() => props.allowsCustomValue),
  close: overlay.close,
  displayValue: (selected) => props.displayValue?.(selected),
  inputValue,
  isDisabled,
  isOpen: overlay.isOpen,
  modelValue: value,
  onClear: undefined,
  onSelectionChange: (next) => emit("selection-change", next),
  open: overlay.open,
});

provide(comboboxContextKey, binding);

// Item labels only exist after the popover mounts, so a host-provided
// displayValue seeds the closed input for the initial selection.
if (!isInputControlled && !inputValue.value && props.displayValue && value.value !== undefined) {
  const initialLabel = props.displayValue(value.value);

  if (initialLabel !== undefined) {
    inputValue.value = initialLabel;
  }
}

provide(comboBoxContextKey, {
  anchorRef: ref<HTMLElement | null>(null),
  binding,
  isDisabled,
  overlay,
  slots,
});

function handleModelUpdate(next: unknown) {
  const resolved = (next ?? undefined) as ComboBoxModelValue;

  value.value = resolved;
  emit("selection-change", resolved);
}

function handleOpenChange(isOpen: boolean) {
  if (isOpen) {
    overlay.open();
  } else {
    overlay.close();
  }
}

defineExpose({
  isOpen: overlay.isOpen,
  open: overlay.open,
  close: overlay.close,
});
</script>

<template>
  <ComboboxRootPrimitive
    as-child
    :default-value="defaultValue"
    :disabled="isDisabled"
    :ignore-filter="ignoreFilter || undefined"
    :model-value="value"
    :name="name"
    :open="overlay.isMounted.value"
    :open-on-click="menuTrigger !== 'manual'"
    :open-on-focus="menuTrigger === 'focus'"
    @update:model-value="handleModelUpdate"
    @update:open="handleOpenChange"
  >
    <FieldRoot as-child :disabled="isDisabled" :invalid="isInvalid" :required="isRequired">
      <div
        v-bind="forwarded"
        :aria-invalid="isInvalid ? 'true' : undefined"
        :class="classes"
        :data-invalid="isInvalid ? 'true' : undefined"
        :data-slot="'combo-box'"
      >
        <slot />
      </div>
    </FieldRoot>
  </ComboboxRootPrimitive>
</template>
