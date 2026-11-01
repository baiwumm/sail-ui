<script setup lang="ts">
import {disclosureVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";

defineOptions({name: "SailDisclosureBody", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const variants = disclosureVariants();
const outerClasses = computed(() => variants.body());
const innerClasses = computed(() => cx(variants.bodyInner(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="outerClasses" :data-slot="'disclosure-body'">
    <div :class="innerClasses">
      <slot />
    </div>
  </div>
</template>
