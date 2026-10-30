<script setup lang="ts">
import {cx, descriptionVariants} from "@sail-ui/styles";
import {FieldDescription, injectFieldRootContext} from "reka-ui";
import {computed, useAttrs} from "vue";

defineOptions({name: "SailDescription", inheritAttrs: false});

const attrs = useAttrs();
const field = injectFieldRootContext(null);
const classes = computed(() => cx(descriptionVariants(), attrs.class as string | undefined));
</script>

<template>
  <FieldDescription
    v-if="field"
    v-bind="$attrs"
    as="span"
    :class="classes"
    :data-slot="'description'"
  >
    <slot />
  </FieldDescription>
  <span v-else v-bind="$attrs" :class="classes" :data-slot="'description'">
    <slot />
  </span>
</template>
