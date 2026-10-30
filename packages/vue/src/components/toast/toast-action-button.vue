<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import Button from "../button/button.vue";
import type {ButtonProps} from "../button/types";
import {useToastProviderContext} from "./context";

defineOptions({name: "SailToastActionButton", inheritAttrs: false});

const props = defineProps<ButtonProps>();

const {className, forwarded} = useForwardedAttrs();
const provider = useToastProviderContext();
const classes = computed(() => cx(provider.slots.value.action(), className.value));
const buttonProps = computed(() => ({
  as: props.as,
  asChild: props.asChild,
  fullWidth: props.fullWidth,
  isDisabled: props.isDisabled,
  isIconOnly: props.isIconOnly,
  isLoading: props.isLoading,
  size: props.size,
  type: props.type,
  variant: props.variant,
}));
</script>

<template>
  <Button v-bind="{...forwarded, ...buttonProps}" :class="classes" data-slot="toast-action-button">
    <slot />
  </Button>
</template>
