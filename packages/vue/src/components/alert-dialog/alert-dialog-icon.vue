<script setup lang="ts">
import type {Component} from "vue";

import {alertDialogVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {DangerIcon, InfoIcon, SuccessIcon, WarningIcon} from "../../shared/icons";
import type {AlertDialogIconProps} from "./types";

defineOptions({name: "SailAlertDialogIcon", inheritAttrs: false});

const props = withDefaults(defineProps<AlertDialogIconProps>(), {
  status: "danger",
});

const {className, forwarded} = useForwardedAttrs();
const classes = computed(() =>
  cx(alertDialogVariants({status: props.status}).icon(), className.value),
);

const defaultIcon = computed<Component>(() => {
  switch (props.status) {
    case "default":
    case "accent":
      return InfoIcon;
    case "success":
      return SuccessIcon;
    case "warning":
      return WarningIcon;
    case "danger":
    default:
      return DangerIcon;
  }
});
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'alert-dialog-icon'">
    <slot>
      <component :is="defaultIcon" data-slot="alert-dialog-default-icon" />
    </slot>
  </div>
</template>
