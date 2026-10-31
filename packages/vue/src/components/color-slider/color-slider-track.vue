<script setup lang="ts">
import {colorSliderVariants, cx} from "@sail-ui/styles";
import {
  ColorSliderTrack as ColorSliderTrackPrimitive,
  colorToString,
  getChannelRange,
  getSliderGradient,
  injectColorSliderRootContext,
  setChannelValue,
} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {colorSliderContextKey} from "./types";

defineOptions({name: "SailColorSliderTrack", inheritAttrs: false});

const rootContext = injectColorSliderRootContext();
const context = inject(colorSliderContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(colorSliderVariants().track(), className.value));

const background = computed(() => {
  const color = rootContext.color.value;
  const channel = rootContext.channel.value;
  const isVertical = rootContext.orientation.value === "vertical";
  const to = isVertical ? "top" : context.dir.value === "rtl" ? "left" : "right";

  if (channel === "alpha") {
    const start = colorToString(setChannelValue(color, "alpha", 0), "rgb");
    const end = colorToString(setChannelValue(color, "alpha", 1), "rgb");

    return `linear-gradient(to ${to}, ${start}, ${end}), repeating-conic-gradient(#efefef 0% 25%, #f7f7f7 0% 50%) 50% / 16px 16px`;
  }

  return getSliderGradient(color, channel, rootContext.colorSpace.value).replace(
    "to right",
    `to ${to}`,
  );
});

const edgeColors = computed(() => {
  const color = rootContext.color.value;
  const channel = rootContext.channel.value;
  const range = getChannelRange(channel);

  return {
    end: colorToString(setChannelValue(color, channel, range.max), "rgb"),
    start: colorToString(setChannelValue(color, channel, range.min), "rgb"),
  };
});

// Reka's alpha track supplies checkerboard sizing for its own layers; the
// upstream contract uses a single repeating-conic checkerboard instead.
const style = computed(() => ({
  "--track-end-color": edgeColors.value.end,
  "--track-start-color": edgeColors.value.start,
  background: background.value,
  backgroundPosition: undefined,
  backgroundSize: undefined,
}));
</script>

<template>
  <ColorSliderTrackPrimitive as-child>
    <div
      v-bind="forwarded"
      :class="classes"
      :data-disabled="undefined"
      :data-slot="'color-slider-track'"
      :style="style"
    >
      <slot />
    </div>
  </ColorSliderTrackPrimitive>
</template>
