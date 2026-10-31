<script setup lang="ts">
import {disclosureVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";

defineOptions({name: "SailDisclosureHeading", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const classes = computed(() => cx(disclosureVariants().heading(), className.value));
</script>

<template>
  <h3 v-bind="forwarded" :class="classes" :data-slot="'disclosure-heading'">
    <slot />
  </h3>
</template>
