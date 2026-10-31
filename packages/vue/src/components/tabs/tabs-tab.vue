<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {TabsTrigger as TabsTriggerPrimitive} from "reka-ui";
import {computed, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {tabItemContextKey, useTabsContext} from "./context";
import type {TabsTabEmits, TabsTabProps} from "./types";

defineOptions({name: "SailTab", inheritAttrs: false});

const props = withDefaults(defineProps<TabsTabProps>(), {isDisabled: false});
const emit = defineEmits<TabsTabEmits>();

const root = useTabsContext();
const {className, forwarded} = useForwardedAttrs();

const triggerRef = ref<HTMLElement | null>(null);
const isSelected = computed(() => root.selectedKey.value === props.value);
const isDisabled = computed(() => root.isDisabled.value || props.isDisabled);
const classes = computed(() => cx(root.slots.value.tab(), className.value));

const {isHovered} = useHover(triggerRef, {isDisabled});
const {isPressed} = usePress(triggerRef, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(triggerRef, {isDisabled});

provide(tabItemContextKey, {
  isSelected,
  triggerEl: triggerRef,
  value: props.value,
});
</script>

<template>
  <TabsTriggerPrimitive as-child :disabled="isDisabled" :value="value">
    <div
      v-bind="forwarded"
      :id="root.triggerId(value)"
      ref="triggerRef"
      :aria-controls="root.contentId(value)"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-pressed="isPressed ? 'true' : undefined"
      :data-selected="isSelected ? 'true' : undefined"
      :data-slot="'tabs-tab'"
      :disabled="undefined"
      :type="undefined"
    >
      <slot />
    </div>
  </TabsTriggerPrimitive>
</template>
