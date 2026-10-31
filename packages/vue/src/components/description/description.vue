<script setup lang="ts">
import {cx, descriptionVariants} from "@sail-ui/styles";
import {FieldDescription, injectFieldRootContext} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {descriptionContextKey} from "../../shared/description-context";

defineOptions({name: "SailDescription", inheritAttrs: false});

const attrs = useAttrs();
const field = injectFieldRootContext(null);
const descriptionContext = inject(descriptionContextKey, null);
const classes = computed(() => cx(descriptionVariants(), attrs.class as string | undefined));
const resolvedId = computed(() => (attrs.id as string | undefined) ?? descriptionContext?.id);
</script>

<template>
  <FieldDescription
    v-if="field"
    v-bind="$attrs"
    :id="resolvedId"
    as="span"
    :class="classes"
    :data-slot="'description'"
  >
    <slot />
  </FieldDescription>
  <span v-else v-bind="$attrs" :id="resolvedId" :class="classes" :data-slot="'description'">
    <slot />
  </span>
</template>
