<script setup lang="ts">
import {switchGroupVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {SwitchGroupRootProps} from "./types";

defineOptions({name: "SailSwitchGroup", inheritAttrs: false});

const props = withDefaults(defineProps<SwitchGroupRootProps>(), {
  orientation: "vertical",
});

const {className, forwarded} = useForwardedAttrs();

const slots = computed(() => switchGroupVariants({orientation: props.orientation}));
const classes = computed(() => cx(slots.value.base(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'switch-group'">
    <div :class="slots.items()" :data-slot="'switch-group-items'">
      <slot />
    </div>
  </div>
</template>
