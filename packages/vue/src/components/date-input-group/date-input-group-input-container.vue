<script setup lang="ts">
import {cx, dateInputGroupVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {DateInputGroupInputContainerProps} from "./types";

defineOptions({name: "SailDateInputGroupInputContainer", inheritAttrs: false});

defineProps<DateInputGroupInputContainerProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(dateInputGroupVariants().inputContainer(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'date-input-group-input-container'">
    <slot />
  </div>
</template>
