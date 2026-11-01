<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx, textAreaVariants} from "@sail-ui/styles";
import {FieldControl, injectFieldRootContext} from "reka-ui";
import {computed, inject, nextTick, onMounted, ref, watch, type ComponentPublicInstance} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {textFieldContextKey} from "../input/types";
import type {TextAreaRootProps} from "./types";

defineOptions({name: "SailTextarea", inheritAttrs: false});

const props = withDefaults(defineProps<TextAreaRootProps>(), {
  fullWidth: false,
  isDisabled: false,
  isInvalid: false,
  autoResize: false,
});

const model = defineModel<string>();
const {className, forwarded} = useForwardedAttrs();
const field = injectFieldRootContext(null);
const textField = inject(textFieldContextKey, null);

const textareaRef = ref<ComponentPublicInstance | HTMLTextAreaElement | null>(null);

const variant = computed(() => props.variant ?? textField?.variant.value);
const isInvalid = computed(() => Boolean(field?.invalid.value) || props.isInvalid);
const isDisabled = computed(() => Boolean(field?.disabled.value) || props.isDisabled);

const classes = computed(() =>
  cx(textAreaVariants({fullWidth: props.fullWidth, variant: variant.value}), className.value),
);

const element = computed(() => {
  const value = textareaRef.value as ComponentPublicInstance | HTMLTextAreaElement | null;

  if (!value) {
    return null;
  }

  return "$el" in value ? (value.$el as Element | null) : value;
});

const {isHovered} = useHover(element, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(element, {isDisabled});

function resize() {
  const value = textareaRef.value as ComponentPublicInstance | HTMLTextAreaElement | null;
  const textarea = value && "$el" in value ? (value.$el as HTMLTextAreaElement) : value;

  if (!textarea || !props.autoResize) {
    return;
  }

  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

watch(model, () => nextTick(resize));

// Initial content must also drive the height, otherwise autoResize starts
// from the rows attribute until the first input.
onMounted(resize);

function handleInput(event: Event) {
  model.value = (event.target as HTMLTextAreaElement).value;
  resize();
}
</script>

<template>
  <FieldControl
    v-if="field"
    ref="textareaRef"
    v-bind="forwarded"
    as="textarea"
    :aria-invalid="isInvalid ? true : undefined"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'textarea'"
    :disabled="isDisabled"
    :model-value="model"
    :name="name"
    :rows="rows"
    @update:model-value="model = $event"
  />
  <textarea
    v-else
    ref="textareaRef"
    v-bind="forwarded"
    :aria-invalid="isInvalid || undefined"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'textarea'"
    :disabled="isDisabled"
    :name="name"
    :rows="rows"
    :value="model"
    @input="handleInput"
  />
</template>
