<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAutocompleteContext} from "./context";
import type {AutocompleteFilterProps} from "./types";

defineOptions({name: "SailAutocompleteFilter", inheritAttrs: false});

defineProps<AutocompleteFilterProps>();

const context = useAutocompleteContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(context.slots.value.filter(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'autocomplete-filter'">
    <slot />
  </div>
</template>
