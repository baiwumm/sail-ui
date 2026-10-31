<script setup lang="ts">
import {colorInputGroupVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";

defineOptions({name: "SailColorInputGroupSuffix", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(colorInputGroupVariants().suffix(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'color-input-group-suffix'">
    <slot />
  </div>
</template>
