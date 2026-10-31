<script setup lang="ts">
import {ColorAreaRoot, ColorAreaThumb} from "@sail-ui/vue/color-area";
import {
  ColorFieldGroup,
  ColorFieldInput,
  ColorFieldPrefix,
  ColorFieldRoot,
  ColorFieldSuffix,
} from "@sail-ui/vue/color-field";
import {ColorPickerPopover, ColorPickerRoot, ColorPickerTrigger} from "@sail-ui/vue/color-picker";
import {
  ColorSliderOutput,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
} from "@sail-ui/vue/color-slider";
import {ColorSwatchRoot} from "@sail-ui/vue/color-swatch";
import {
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
} from "@sail-ui/vue/color-swatch-picker";
import {Description} from "@sail-ui/vue/description";
import {FieldError} from "@sail-ui/vue/field-error";
import {Label} from "@sail-ui/vue/label";
import {computed, ref} from "vue";

type DemoColor =
  | string
  | {space: "rgb"; r: number; g: number; b: number; alpha: number}
  | {space: "hsl"; h: number; s: number; l: number; alpha: number}
  | {space: "hsb"; h: number; s: number; b: number; alpha: number};

const pickerColor = ref<DemoColor>("#ff0000");
const areaColor = ref<DemoColor>("#ff0000");
const sliderColor = ref<DemoColor>("#00ff00");
const fieldColor = ref<DemoColor>("#3366ff");
const swatchPickerColor = ref<DemoColor>("#00ff00");
const presets = ["#ff0000", "#00ff00", "#0000ff", "#ffcc00", "#ffffff", "#000000"];

function formatColor(value: DemoColor): string {
  if (typeof value === "string") {
    return value;
  }

  if (value.space === "rgb") {
    return value.alpha < 1
      ? `rgba(${value.r}, ${value.g}, ${value.b}, ${value.alpha})`
      : `rgb(${value.r}, ${value.g}, ${value.b})`;
  }

  if (value.space === "hsl") {
    return `hsl(${value.h}, ${value.s}%, ${value.l}%)`;
  }

  return `hsb(${value.h}, ${value.s}%, ${value.b}%)`;
}

const pickerLabel = computed(() => formatColor(pickerColor.value));
const areaLabel = computed(() => formatColor(areaColor.value));
const sliderLabel = computed(() => formatColor(sliderColor.value));
const fieldLabel = computed(() => formatColor(fieldColor.value));
const swatchPickerLabel = computed(() => formatColor(swatchPickerColor.value));
</script>

<template>
  <section id="colors" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Colors</h2>
    <div class="flex flex-wrap items-start gap-8">
      <ColorPickerRoot v-model="pickerColor" data-testid="color-picker">
        <ColorPickerTrigger data-testid="color-picker-trigger">
          <ColorSwatchRoot size="lg" />
          <Label>Pick a color</Label>
        </ColorPickerTrigger>
        <ColorPickerPopover>
          <div class="flex flex-col gap-3">
            <ColorAreaRoot
              class="h-40 w-64"
              color-space="hsl"
              data-testid="color-picker-area"
              x-channel="hue"
              y-channel="saturation"
            >
              <ColorAreaThumb />
            </ColorAreaRoot>
            <ColorSliderRoot channel="hue" color-space="hsl" data-testid="color-picker-hue">
              <ColorSliderOutput />
              <ColorSliderTrack>
                <ColorSliderThumb />
              </ColorSliderTrack>
            </ColorSliderRoot>
            <ColorSliderRoot channel="alpha" color-space="hsl" data-testid="color-picker-alpha">
              <ColorSliderOutput />
              <ColorSliderTrack>
                <ColorSliderThumb />
              </ColorSliderTrack>
            </ColorSliderRoot>
            <ColorFieldRoot aria-label="Hex value">
              <ColorFieldGroup>
                <ColorFieldPrefix>
                  <ColorSwatchRoot size="sm" />
                </ColorFieldPrefix>
                <ColorFieldInput />
              </ColorFieldGroup>
            </ColorFieldRoot>
            <ColorSwatchPickerRoot aria-label="Presets">
              <ColorSwatchPickerItem v-for="preset in presets" :key="preset" :color="preset">
                <ColorSwatchPickerSwatch />
                <ColorSwatchPickerIndicator />
              </ColorSwatchPickerItem>
            </ColorSwatchPickerRoot>
          </div>
        </ColorPickerPopover>
      </ColorPickerRoot>

      <div class="flex flex-col gap-3">
        <Label>Color area</Label>
        <ColorAreaRoot
          v-model="areaColor"
          class="h-40 w-64"
          color-space="hsl"
          data-testid="color-area"
          show-dots
          x-channel="hue"
          y-channel="saturation"
        >
          <ColorAreaThumb />
        </ColorAreaRoot>
        <p class="text-sm text-muted">
          Area: <span data-testid="color-area-value">{{ areaLabel }}</span>
        </p>
      </div>

      <div class="flex w-64 flex-col gap-3">
        <ColorSliderRoot
          v-model="sliderColor"
          channel="hue"
          color-space="hsl"
          data-testid="color-slider"
        >
          <Label>Hue</Label>
          <ColorSliderOutput />
          <ColorSliderTrack>
            <ColorSliderThumb />
          </ColorSliderTrack>
        </ColorSliderRoot>
        <ColorSliderRoot v-model="sliderColor" channel="alpha" color-space="hsl">
          <Label>Alpha</Label>
          <ColorSliderOutput />
          <ColorSliderTrack>
            <ColorSliderThumb />
          </ColorSliderTrack>
        </ColorSliderRoot>
        <p class="text-sm text-muted">
          Slider: <span data-testid="color-slider-value">{{ sliderLabel }}</span>
        </p>
      </div>

      <div class="flex w-64 flex-col gap-6">
        <ColorFieldRoot v-model="fieldColor" data-testid="color-field" full-width>
          <Label>Brand color</Label>
          <ColorFieldGroup>
            <ColorFieldPrefix>
              <ColorSwatchRoot size="sm" />
            </ColorFieldPrefix>
            <ColorFieldInput />
            <ColorFieldSuffix>
              <ColorSwatchRoot size="sm" shape="square" />
            </ColorFieldSuffix>
          </ColorFieldGroup>
          <Description>Enter a hex value such as #3366ff.</Description>
        </ColorFieldRoot>
        <ColorFieldRoot default-value="#ff5733" full-width is-invalid>
          <Label>Accent color</Label>
          <ColorFieldGroup>
            <ColorFieldInput />
          </ColorFieldGroup>
          <FieldError>Enter a valid hex color.</FieldError>
        </ColorFieldRoot>
        <p class="text-sm text-muted">
          Field: <span data-testid="color-field-value">{{ fieldLabel }}</span>
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-start gap-8">
      <div class="flex flex-col gap-3">
        <Label>Swatches</Label>
        <div class="flex items-center gap-3" data-testid="color-swatches">
          <ColorSwatchRoot color="#ff0000" label="Red" size="sm" />
          <ColorSwatchRoot color="#00ff00" label="Green" size="md" />
          <ColorSwatchRoot color="#0000ff" label="Blue" shape="square" size="lg" />
          <ColorSwatchRoot color="#00000000" label="Transparent" size="md" />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <Label>Swatch picker</Label>
        <ColorSwatchPickerRoot
          v-model="swatchPickerColor"
          aria-label="Palette"
          data-testid="color-swatch-picker"
        >
          <ColorSwatchPickerItem v-for="preset in presets" :key="preset" :color="preset">
            <ColorSwatchPickerSwatch />
            <ColorSwatchPickerIndicator />
          </ColorSwatchPickerItem>
        </ColorSwatchPickerRoot>
        <ColorSwatchPickerRoot
          aria-label="Disabled palette"
          is-disabled
          data-testid="color-swatch-picker-disabled"
        >
          <ColorSwatchPickerItem
            v-for="preset in presets.slice(0, 3)"
            :key="preset"
            :color="preset"
          >
            <ColorSwatchPickerSwatch />
            <ColorSwatchPickerIndicator />
          </ColorSwatchPickerItem>
        </ColorSwatchPickerRoot>
        <p class="text-sm text-muted">
          Selection: <span data-testid="color-swatch-picker-value">{{ swatchPickerLabel }}</span>
        </p>
      </div>
    </div>

    <p class="text-sm text-muted">
      Picker: <span data-testid="color-value">{{ pickerLabel }}</span>
    </p>
  </section>
</template>
