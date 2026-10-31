<script setup lang="ts">
import {cx, headerVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {headerContextKey} from "../../shared/header-context";
import type {HeaderRootProps} from "./types";

defineOptions({name: "SailHeader", inheritAttrs: false});

withDefaults(defineProps<HeaderRootProps>(), {
  as: "header",
});

const attrs = useAttrs();
const headerContext = inject(headerContextKey, null);
const classes = computed(() => cx(headerVariants(), attrs.class as string | undefined));
const resolvedId = computed(() => (attrs.id as string | undefined) ?? headerContext?.id);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :id="resolvedId"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'header'"
  >
    <slot />
  </Primitive>
</template>
