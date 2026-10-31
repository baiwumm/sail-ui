<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {ComboboxTrigger as ComboboxTriggerPrimitive, injectComboboxRootContext} from "reka-ui";
import {computed, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {ChevronDownIcon} from "../../shared/icons";
import {useComboBoxContext} from "./context";
import type {ComboBoxTriggerProps} from "./types";

defineOptions({name: "SailComboBoxTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<ComboBoxTriggerProps>(), {
  isDisabled: false,
});

const context = useComboBoxContext();
const rootContext = injectComboboxRootContext();
const {className, forwarded} = useForwardedAttrs();
const buttonRef = ref<HTMLButtonElement | null>(null);

// See Input: the trigger usually renders first, so it seeds Reka's content id.
const generatedContentId = useId();

rootContext.contentId ||= generatedContentId;

const isDisabled = computed(() => context.isDisabled.value || props.isDisabled);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isPressed} = usePress(buttonRef, {isDisabled});
const {isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

const classes = computed(() => cx(context.slots.value.trigger(), className.value));
</script>

<template>
  <ComboboxTriggerPrimitive as-child :disabled="isDisabled">
    <button
      ref="buttonRef"
      v-bind="forwarded"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-open="context.overlay.isOpen.value ? 'true' : undefined"
      :data-pressed="isPressed ? 'true' : undefined"
      :data-slot="'combo-box-trigger'"
      :data-state="undefined"
      type="button"
    >
      <slot>
        <ChevronDownIcon data-slot="combo-box-trigger-default-icon" />
      </slot>
    </button>
  </ComboboxTriggerPrimitive>
</template>
