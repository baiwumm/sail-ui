<script setup lang="ts">
import {colorSliderVariants, cx} from "@sail-ui/styles";
import {injectColorSliderRootContext, type ColorChannel} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";

defineOptions({name: "SailColorSliderOutput", inheritAttrs: false});

const rootContext = injectColorSliderRootContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(colorSliderVariants().output(), className.value));

function formatChannelValue(channel: ColorChannel, value: number) {
  const rounded = Math.round(value);

  if (channel === "hue") {
    return `${rounded}°`;
  }

  if (channel === "red" || channel === "green" || channel === "blue") {
    return String(rounded);
  }

  return `${rounded}%`;
}

const label = computed(() =>
  formatChannelValue(rootContext.channel.value, rootContext.channelValue.value),
);
</script>

<template>
  <output v-bind="forwarded" :class="classes" :data-slot="'color-slider-output'">
    <slot>{{ label }}</slot>
  </output>
</template>
