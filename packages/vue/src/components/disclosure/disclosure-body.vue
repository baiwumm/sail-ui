<script setup lang="ts">
import {disclosureVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";

defineOptions({name: "SailDisclosureBody", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const innerClasses = computed(() => cx(disclosureVariants().bodyInner(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="disclosureVariants().body()" :data-slot="'disclosure-body'">
    <div :class="innerClasses">
      <slot />
    </div>
  </div>
</template>
