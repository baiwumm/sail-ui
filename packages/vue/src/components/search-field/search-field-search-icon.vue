<script setup lang="ts">
import {cx, searchFieldVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {SearchIcon} from "../../shared/icons";
import type {SearchFieldSearchIconProps} from "./types";

defineOptions({name: "SailSearchFieldSearchIcon", inheritAttrs: false});

defineProps<SearchFieldSearchIconProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(searchFieldVariants().searchIcon(), className.value));
</script>

<template>
  <SearchIcon v-bind="forwarded" :class="classes" :data-slot="'search-field-search-icon'" />
</template>
