<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {PinInputInput} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {inputOtpContextKey} from "./context";
import type {InputOtpSlotProps} from "./types";

defineOptions({name: "SailInputOtpSlot", inheritAttrs: false});

const props = defineProps<InputOtpSlotProps>();

const {className, forwarded} = useForwardedAttrs();
const context = inject(inputOtpContextKey, null);
const classes = computed(() => cx(context?.slots.value.slot(), className.value));
const inputClasses = computed(() =>
  cx(context?.slots.value.input(), context?.inputClassName.value),
);
const character = computed(() => context?.characters.value[props.index]);
const isActive = computed(() => context?.activeIndex.value === props.index);
const isDisabled = computed(() => context?.isDisabled.value ?? false);
const isInvalid = computed(() => context?.isInvalid.value ?? false);
const isFilled = computed(() => Boolean(character.value));

const inputStyle = {
  background: "transparent",
  border: "0",
  color: "transparent",
  cursor: "text",
  height: "100%",
  inset: "0",
  margin: "0",
  opacity: "0",
  outline: "none",
  padding: "0",
  position: "absolute",
  width: "100%",
} as const;

function handleFocusIn() {
  context?.setActiveIndex(props.index);
}

function handleFocusOut() {
  if (context?.activeIndex.value === props.index) {
    context.setActiveIndex(null);
  }
}
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-active="isActive ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-filled="isFilled ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    data-slot="input-otp-slot"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <PinInputInput
      :class="inputClasses"
      :index="index"
      :inputmode="context?.inputMode.value"
      :style="inputStyle"
      :tabindex="index === 0 ? undefined : -1"
    />
    <div v-if="isFilled" :class="context?.slots.value.slotValue()" data-slot="input-otp-slot-value">
      {{ character }}
    </div>
    <div
      v-if="isActive && !isFilled"
      :class="context?.slots.value.caret()"
      data-slot="input-otp-caret"
    />
  </div>
</template>
