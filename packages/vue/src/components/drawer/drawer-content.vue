<script setup lang="ts">
import {cx, drawerVariants} from "@sail-ui/styles";
import {computed, provide, useAttrs} from "vue";

import {drawerContextKey, type DrawerPlacement, useDrawerContext} from "./context";
import type {DrawerContentProps} from "./types";

defineOptions({name: "SailDrawerContent", inheritAttrs: false});

const props = withDefaults(defineProps<DrawerContentProps>(), {
  placement: "bottom",
});

const attrs = useAttrs();
const context = useDrawerContext();

const mergedSlots = computed(() => ({
  ...context.slots.value,
  ...drawerVariants({placement: props.placement}),
}));
const placement = computed<DrawerPlacement>(() => props.placement);

provide(drawerContextKey, {
  ...context,
  placement,
  slots: mergedSlots,
});

const classes = computed(() => cx(mergedSlots.value.content(), attrs.class as string | undefined));
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classes"
    :data-entering="context.isEntering.value ? 'true' : undefined"
    :data-exiting="context.isExiting.value ? 'true' : undefined"
    :data-placement="placement"
    :data-slot="'drawer-content'"
  >
    <slot />
  </div>
</template>
