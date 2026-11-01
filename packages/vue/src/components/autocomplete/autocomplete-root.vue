<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {autocompleteVariants, cx} from "@sail-ui/styles";
import {ComboboxRoot as ComboboxRootPrimitive} from "reka-ui";
import {computed, getCurrentInstance, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {
  comboboxContextKey,
  createComboboxBinding,
  type ComboBoxKey,
  type ComboBoxModelValue,
} from "../../shared/combobox-context";
import {fieldContextKey} from "../../shared/field-context";
import {labelContextKey} from "../../shared/label-context";
import {autocompleteContextKey} from "./context";
import type {AutocompleteRootProps} from "./types";

defineOptions({name: "SailAutocompleteRoot", inheritAttrs: false});

const props = withDefaults(defineProps<AutocompleteRootProps>(), {
  variant: "primary",
  fullWidth: false,
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
  ignoreFilter: false,
});

const emit = defineEmits<{
  "selection-change": [value: ComboBoxModelValue];
  "update:open": [open: boolean];
}>();

const {className, forwarded} = useForwardedAttrs();
const instance = getCurrentInstance();
const vnodeProps = instance?.vnode.props ?? {};

const model = defineModel<ComboBoxKey>();
const openModel = defineModel<boolean>("open", {default: undefined as unknown as boolean});

const isValueControlled = "modelValue" in vnodeProps || "model-value" in vnodeProps;
const internalValue = ref<ComboBoxKey | undefined>(props.defaultValue);

const value = computed<ComboBoxModelValue>({
  get: () => (isValueControlled ? model.value : internalValue.value),
  set: (next) => {
    internalValue.value = next;
    model.value = next;
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
  autocompleteVariants({
    fullWidth: props.fullWidth,
    variant: props.variant,
  }),
);

const classes = computed(() => cx(slots.value.base(), className.value));
const isDisabled = computed(() => Boolean(props.isDisabled));
const isInvalid = computed(() => Boolean(props.isInvalid));

const labelId = useId();
const descriptionIds = ref<string[]>([]);
const describedBy = computed(() =>
  descriptionIds.value.length > 0 ? descriptionIds.value.join(" ") : undefined,
);

function registerDescription(id: string) {
  if (!descriptionIds.value.includes(id)) {
    descriptionIds.value = [...descriptionIds.value, id];
  }

  return () => {
    descriptionIds.value = descriptionIds.value.filter((item) => item !== id);
  };
}

provide(fieldContextKey, {
  describedBy,
  disabled: isDisabled,
  errors: computed<string[]>(() => []),
  invalid: isInvalid,
  registerDescription,
  required: computed(() => Boolean(props.isRequired)),
});

provide(labelContextKey, {id: labelId, elementType: "span"});

const {binding} = createComboboxBinding({
  allowsCustomValue: computed(() => false),
  close: overlay.close,
  displayValue: (selected) => props.displayValue?.(selected),
  inputValue: computed({get: () => "", set: () => {}}),
  isDisabled,
  isOpen: overlay.isOpen,
  modelValue: value,
  onClear: () => props.onClear?.(),
  onSelectionChange: (next) => emit("selection-change", next),
  open: overlay.open,
});

provide(comboboxContextKey, binding);

provide(autocompleteContextKey, {
  binding,
  clear: binding.clear,
  describedBy,
  isDisabled,
  isInvalid,
  labelId,
  overlay,
  placeholder: computed(() => props.placeholder),
  slots,
  triggerRef: ref<HTMLElement | null>(null),
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
    :open-on-click="false"
    :open-on-focus="false"
    @update:model-value="handleModelUpdate"
    @update:open="handleOpenChange"
  >
    <div
      v-bind="forwarded"
      :aria-invalid="isInvalid ? 'true' : undefined"
      :class="classes"
      :data-invalid="isInvalid ? 'true' : undefined"
      :data-slot="'autocomplete'"
    >
      <slot />
    </div>
  </ComboboxRootPrimitive>
</template>
