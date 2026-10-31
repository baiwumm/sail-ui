import type {Color} from "@heroui/react";

import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  Description,
  FieldError,
  Label,
  parseColor,
} from "@heroui/react";
import {useState} from "react";

const presets = ["#ff0000", "#00ff00", "#0000ff", "#ffcc00", "#ffffff", "#000000"];

function formatColor(value: Color | null) {
  return value ? value.toString("hex").toLowerCase() : "none";
}

export default function Colors() {
  const [pickerColor, setPickerColor] = useState<Color | null>(parseColor("#ff0000"));
  const [areaColor, setAreaColor] = useState<Color | null>(parseColor("#ff0000"));
  const [sliderColor, setSliderColor] = useState<Color | null>(parseColor("#00ff00"));
  const [fieldColor, setFieldColor] = useState<Color | null>(parseColor("#3366ff"));
  const [swatchPickerColor, setSwatchPickerColor] = useState<Color | null>(parseColor("#00ff00"));

  return (
    <section id="colors" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Colors</h2>
      <div className="flex flex-wrap items-start gap-8">
        <ColorPicker value={pickerColor ?? undefined} onChange={setPickerColor}>
          <ColorPicker.Trigger data-testid="color-picker-trigger">
            <ColorSwatch size="lg" />
            <Label>Pick a color</Label>
          </ColorPicker.Trigger>
          <ColorPicker.Popover>
            <div className="flex flex-col gap-3">
              <ColorArea
                className="h-40 w-64"
                colorSpace="hsl"
                data-testid="color-picker-area"
                xChannel="hue"
                yChannel="saturation"
              >
                <ColorArea.Thumb />
              </ColorArea>
              <ColorSlider channel="hue" colorSpace="hsl" data-testid="color-picker-hue">
                <ColorSlider.Output />
                <ColorSlider.Track>
                  <ColorSlider.Thumb />
                </ColorSlider.Track>
              </ColorSlider>
              <ColorSlider channel="alpha" colorSpace="hsl" data-testid="color-picker-alpha">
                <ColorSlider.Output />
                <ColorSlider.Track>
                  <ColorSlider.Thumb />
                </ColorSlider.Track>
              </ColorSlider>
              <ColorField aria-label="Hex value">
                <ColorField.Group>
                  <ColorField.Prefix>
                    <ColorSwatch size="sm" />
                  </ColorField.Prefix>
                  <ColorField.Input />
                </ColorField.Group>
              </ColorField>
              <ColorSwatchPicker aria-label="Presets">
                {presets.map((preset) => (
                  <ColorSwatchPicker.Item key={preset} color={preset}>
                    <ColorSwatchPicker.Swatch />
                    <ColorSwatchPicker.Indicator />
                  </ColorSwatchPicker.Item>
                ))}
              </ColorSwatchPicker>
            </div>
          </ColorPicker.Popover>
        </ColorPicker>

        <div className="flex flex-col gap-3">
          <Label>Color area</Label>
          <ColorArea
            className="h-40 w-64"
            colorSpace="hsl"
            data-testid="color-area"
            showDots
            value={areaColor ?? undefined}
            xChannel="hue"
            yChannel="saturation"
            onChange={setAreaColor}
          >
            <ColorArea.Thumb />
          </ColorArea>
          <p className="text-sm text-muted">
            Area: <span data-testid="color-area-value">{formatColor(areaColor)}</span>
          </p>
        </div>

        <div className="flex w-64 flex-col gap-3">
          <ColorSlider
            channel="hue"
            colorSpace="hsl"
            data-testid="color-slider"
            value={sliderColor ?? undefined}
            onChange={setSliderColor}
          >
            <Label>Hue</Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
          <ColorSlider
            channel="alpha"
            colorSpace="hsl"
            value={sliderColor ?? undefined}
            onChange={setSliderColor}
          >
            <Label>Alpha</Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
          <p className="text-sm text-muted">
            Slider: <span data-testid="color-slider-value">{formatColor(sliderColor)}</span>
          </p>
        </div>

        <div className="flex w-64 flex-col gap-6">
          <ColorField
            data-testid="color-field"
            fullWidth
            value={fieldColor ?? undefined}
            onChange={setFieldColor}
          >
            <Label>Brand color</Label>
            <ColorField.Group>
              <ColorField.Prefix>
                <ColorSwatch color={fieldColor ?? undefined} size="sm" />
              </ColorField.Prefix>
              <ColorField.Input />
              <ColorField.Suffix>
                <ColorSwatch color={fieldColor ?? undefined} shape="square" size="sm" />
              </ColorField.Suffix>
            </ColorField.Group>
            <Description>Enter a hex value such as #3366ff.</Description>
          </ColorField>
          <ColorField defaultValue={parseColor("#ff5733")} fullWidth isInvalid>
            <Label>Accent color</Label>
            <ColorField.Group>
              <ColorField.Input />
            </ColorField.Group>
            <FieldError>Enter a valid hex color.</FieldError>
          </ColorField>
          <p className="text-sm text-muted">
            Field: <span data-testid="color-field-value">{formatColor(fieldColor)}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-8">
        <div className="flex flex-col gap-3">
          <Label>Swatches</Label>
          <div className="flex items-center gap-3" data-testid="color-swatches">
            <ColorSwatch aria-label="Red" color="#ff0000" size="sm" />
            <ColorSwatch aria-label="Green" color="#00ff00" size="md" />
            <ColorSwatch aria-label="Blue" color="#0000ff" shape="square" size="lg" />
            <ColorSwatch aria-label="Transparent" color="#00000000" size="md" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Swatch picker</Label>
          <ColorSwatchPicker
            aria-label="Palette"
            data-testid="color-swatch-picker"
            value={swatchPickerColor ?? undefined}
            onChange={setSwatchPickerColor}
          >
            {presets.map((preset) => (
              <ColorSwatchPicker.Item key={preset} color={preset}>
                <ColorSwatchPicker.Swatch />
                <ColorSwatchPicker.Indicator />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker>
          <ColorSwatchPicker
            aria-label="Disabled palette"
            data-testid="color-swatch-picker-disabled"
          >
            {presets.slice(0, 3).map((preset) => (
              <ColorSwatchPicker.Item key={preset} color={preset} isDisabled>
                <ColorSwatchPicker.Swatch />
                <ColorSwatchPicker.Indicator />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker>
          <p className="text-sm text-muted">
            Selection:{" "}
            <span data-testid="color-swatch-picker-value">{formatColor(swatchPickerColor)}</span>
          </p>
        </div>
      </div>

      <p className="text-sm text-muted">
        Picker: <span data-testid="color-value">{formatColor(pickerColor)}</span>
      </p>
    </section>
  );
}
