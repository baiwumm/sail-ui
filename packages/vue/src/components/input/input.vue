<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx, inputVariants} from "@sail-ui/styles";
import {
  ComboboxInput,
  FieldControl,
  injectComboboxRootContext,
  injectFieldRootContext,
} from "reka-ui";
import {computed, inject, ref, useId, type ComponentPublicInstance} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useComboboxBinding} from "../../shared/combobox-context";
import {textFieldContextKey, type InputProps} from "./types";

defineOptions({name: "SailInput", inheritAttrs: false});

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  fullWidth: false,
  isDisabled: false,
  isInvalid: false,
});

const model = defineModel<string | number | undefined>();
const {className, forwarded} = useForwardedAttrs();
const field = injectFieldRootContext(null);
const textField = inject(textFieldContextKey, null);
const combobox = useComboboxBinding();
const comboboxRoot = injectComboboxRootContext(null);
const inputRef = ref<ComponentPublicInstance | HTMLInputElement | null>(null);

// Reka assigns the combobox content id non-reactively from ComboboxContent, so
// whichever part renders first has to seed it for aria-controls to resolve.
const generatedContentId = useId();

if (comboboxRoot) {
  comboboxRoot.contentId ||= generatedContentId;
}

if (model.value === undefined && props.defaultValue !== undefined) {
  model.value = props.defaultValue;
}

const variant = computed(() => props.variant ?? textField?.variant.value);

const classes = computed(() =>
  cx(inputVariants({fullWidth: props.fullWidth, variant: variant.value}), className.value),
);

const isInvalid = computed(() => Boolean(field?.invalid.value) || props.isInvalid);
const isDisabled = computed(() => Boolean(field?.disabled.value) || props.isDisabled);

const element = computed(() => {
  const value = inputRef.value as ComponentPublicInstance | HTMLInputElement | null;

  if (!value) {
    return null;
  }

  return "$el" in value ? (value.$el as Element | null) : value;
});

const {isHovered} = useHover(element, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(element, {isDisabled});

const comboboxText = computed<string>({
  get: () => combobox?.inputValue.value ?? "",
  set: (value) => {
    if (combobox) {
      combobox.inputValue.value = value;
    }
  },
});

function updateModel(value: string | number) {
  model.value = value;
}

function handleInput(event: Event) {
  updateModel((event.target as HTMLInputElement).value);
}

function handleComboboxKeydown(event: KeyboardEvent) {
  if (!combobox || event.key !== "Enter" || event.isComposing) {
    return;
  }

  // A highlighted option is selected by Reka's listbox handler.
  if (comboboxRoot?.highlightedElement.value?.isConnected) {
    return;
  }

  if (!combobox.allowsCustomValue.value) {
    return;
  }

  const text = combobox.inputValue.value.trim();

  if (!text) {
    return;
  }

  event.preventDefault();
  combobox.setSelected(text);
  combobox.close();
}
</script>

<template>
  <ComboboxInput
    v-if="combobox"
    v-bind="forwarded"
    as-child
    :disabled="isDisabled"
    :display-value="combobox.displayValue"
    :model-value="comboboxText"
    @keydown="handleComboboxKeydown"
    @update:model-value="comboboxText = $event"
  >
    <FieldControl
      v-if="field"
      ref="inputRef"
      :aria-invalid="isInvalid ? true : undefined"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-invalid="isInvalid ? 'true' : undefined"
      :data-slot="'input'"
      :disabled="isDisabled"
      :model-value="comboboxText"
      :name="name"
      :placeholder="placeholder"
      :required="isRequired"
      :type="type"
      @update:model-value="comboboxText = String($event)"
    />
    <input
      v-else
      ref="inputRef"
      :aria-invalid="isInvalid || undefined"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-invalid="isInvalid ? 'true' : undefined"
      :data-slot="'input'"
      :disabled="isDisabled"
      :name="name"
      :placeholder="placeholder"
      :required="isRequired"
      :type="type"
      :value="comboboxText"
    />
  </ComboboxInput>
  <FieldControl
    v-else-if="field"
    ref="inputRef"
    v-bind="forwarded"
    :aria-invalid="isInvalid ? true : undefined"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'input'"
    :disabled="isDisabled"
    :model-value="model"
    :name="name"
    :placeholder="placeholder"
    :required="isRequired"
    :type="type"
    @update:model-value="updateModel"
  />
  <input
    v-else
    ref="inputRef"
    v-bind="forwarded"
    :aria-invalid="isInvalid || undefined"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'input'"
    :disabled="isDisabled"
    :name="name"
    :placeholder="placeholder"
    :required="isRequired"
    :type="type"
    :value="model"
    @input="handleInput"
  />
</template>
