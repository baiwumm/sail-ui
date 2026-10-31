<script setup lang="ts">
import {useFocusRing} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {injectDateFieldRootContext} from "reka-ui";
import {computed, inject, onBeforeUnmount, onMounted, ref, useAttrs} from "vue";

import {fieldContextKey} from "../../shared/field-context";
import DateInputGroupProvider from "../date-input-group/date-input-group-provider.vue";
import type {DateSegmentContent} from "../date-input-group/types";
import {useDatePickerContext} from "./context";

defineOptions({name: "SailDatePickerFieldShell", inheritAttrs: false});

const props = defineProps<{
  segments: DateSegmentContent[];
  labelId: string;
  isReadOnly: boolean;
}>();

const attrs = useAttrs();
const context = useDatePickerContext();
const field = inject(fieldContextKey, null);
const rekaField = injectDateFieldRootContext();

const rootRef = ref<HTMLElement | null>(null);

const isDisabled = computed(() => field?.disabled.value ?? rekaField.disabled.value);
const isInvalid = computed(() => field?.invalid.value ?? rekaField.isInvalid.value);
const isRequired = computed(() => field?.required.value ?? false);

const {isFocused, isFocusVisible} = useFocusRing(rootRef, {
  isDisabled,
  within: true,
});

const forwarded = computed(() => {
  const rest: Record<string, unknown> = {...attrs};

  // Reka renders the field root as a segmented `role="group"`; upstream's
  // picker root is a plain container, and the group role belongs to
  // `DateInputGroup`.
  for (const key of [
    "class",
    "role",
    "dir",
    "aria-disabled",
    "aria-labelledby",
    "aria-describedby",
    "aria-invalid",
    "data-disabled",
    "data-readonly",
    "data-invalid",
  ]) {
    delete rest[key];
  }

  return rest;
});

const classes = computed(() => cx(context.slots.value.base(), attrs.class as string | undefined));

function updateAnchor() {
  const next = rootRef.value?.querySelector<HTMLElement>('[data-slot="date-input-group"]') ?? null;

  if (context.anchorRef.value !== next) {
    context.anchorRef.value = next;
  }
}

let observer: MutationObserver | undefined;

onMounted(() => {
  updateAnchor();
  observer = new MutationObserver(updateAnchor);
  observer.observe(rootRef.value as HTMLElement, {childList: true, subtree: true});
});

onBeforeUnmount(() => {
  observer?.disconnect();
  context.anchorRef.value = null;
});
</script>

<template>
  <div
    ref="rootRef"
    v-bind="forwarded"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focus-within="isFocused ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-open="context.overlay.isOpen.value ? 'true' : undefined"
    :data-readonly="isReadOnly ? 'true' : undefined"
    :data-required="isRequired ? 'true' : undefined"
    :data-slot="'date-picker'"
  >
    <DateInputGroupProvider
      kind="date"
      :is-read-only="isReadOnly"
      :label-id="labelId"
      :segments="props.segments"
    >
      <slot />
    </DateInputGroupProvider>
  </div>
</template>
