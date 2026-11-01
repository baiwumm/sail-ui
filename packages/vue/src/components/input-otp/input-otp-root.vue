<script setup lang="ts">
import {cx, inputOTPVariants} from "@sail-ui/styles";
import {PinInputRoot} from "reka-ui";
import {computed, provide, ref, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {inputOtpContextKey} from "./context";
import type {InputOtpRootEmits, InputOtpRootProps} from "./types";

defineOptions({name: "SailInputOtp", inheritAttrs: false});

const props = withDefaults(defineProps<InputOtpRootProps>(), {
  defaultValue: "",
  inputMode: "numeric",
  isDisabled: false,
  isInvalid: false,
  mask: false,
});

const emit = defineEmits<InputOtpRootEmits>();
const {className, forwarded} = useForwardedAttrs();

const internalValue = ref(props.defaultValue);
const value = computed(() => (props.modelValue ?? internalValue.value).slice(0, props.maxLength));
const characters = computed(() => Array.from(value.value));
const isComplete = computed(() => props.maxLength > 0 && value.value.length === props.maxLength);

const patternRegex = computed(() => {
  if (!props.pattern) {
    return null;
  }

  return typeof props.pattern === "string" ? new RegExp(props.pattern) : props.pattern;
});

// Reka keeps gaps for cleared slots; the fresh array forces it to resync to
// our canonical, gap-free value after every accepted or rejected update.
const syncToken = ref(0);
const rekaValue = computed(() => {
  void syncToken.value;

  return [...characters.value];
});

function handleUpdate(nextModelValue: string[] | null | undefined) {
  const next = (nextModelValue ?? [])
    .map((character: string | undefined) => character ?? "")
    .join("")
    .slice(0, props.maxLength);

  const pattern = patternRegex.value;

  if (next && pattern) {
    pattern.lastIndex = 0;

    if (!pattern.test(next)) {
      syncToken.value += 1;

      return;
    }
  }

  syncToken.value += 1;

  if (next === value.value) {
    return;
  }

  if (props.modelValue === undefined) {
    internalValue.value = next;
  }

  emit("update:modelValue", next);
}

watch(value, (next, previous) => {
  if (props.maxLength > 0 && next.length === props.maxLength && previous.length < props.maxLength) {
    emit("complete", next);
  }
});

const slots = computed(() => inputOTPVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value.base(), className.value));

const dataDisabled = computed(() => (props.isDisabled ? "true" : undefined));
const dataInvalid = computed(() => (props.isInvalid ? "true" : undefined));
const dataComplete = computed(() => (isComplete.value ? "true" : undefined));

const activeIndex = ref<number | null>(null);

function setActiveIndex(index: number | null) {
  activeIndex.value = index;
}

provide(inputOtpContextKey, {
  activeIndex,
  characters,
  inputClassName: computed(() => props.inputClassName),
  inputMode: computed(() => props.inputMode),
  isDisabled: computed(() => props.isDisabled),
  isInvalid: computed(() => props.isInvalid),
  setActiveIndex,
  slots,
});
</script>

<template>
  <PinInputRoot
    :id="id"
    :disabled="isDisabled"
    :mask="mask"
    :model-value="rekaValue"
    :name="name"
    :otp="true"
    :placeholder="placeholder"
    style="display: contents"
    type="text"
    @update:model-value="handleUpdate"
  >
    <div
      v-bind="forwarded"
      :class="classes"
      :data-complete="dataComplete"
      :data-disabled="dataDisabled"
      :data-invalid="dataInvalid"
      data-slot="input-otp"
    >
      <slot />
    </div>
  </PinInputRoot>
</template>
