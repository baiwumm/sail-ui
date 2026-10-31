import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {ColorAreaRoot, ColorAreaThumb} from "../components/color-area";
import {ColorFieldGroup, ColorFieldInput, ColorFieldRoot} from "../components/color-field";
import {ColorPickerPopover, ColorPickerRoot, ColorPickerTrigger} from "../components/color-picker";
import {ColorSliderRoot, ColorSliderThumb, ColorSliderTrack} from "../components/color-slider";
import {ColorSwatchRoot} from "../components/color-swatch";
import {
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
} from "../components/color-swatch-picker";
import {Label} from "../components/label";

const ColorPickerPage = defineComponent({
  setup() {
    return () =>
      h(
        ColorPickerRoot,
        {defaultValue: "#ff0000"},
        {
          default: () => [
            h(ColorPickerTrigger, null, {
              default: () => [
                h(ColorSwatchRoot, {size: "lg"}),
                h(Label, null, {
                  default: () => "Color",
                }),
              ],
            }),
            h(ColorPickerPopover, null, {
              default: () => [
                h(ColorAreaRoot, null, {default: () => [h(ColorAreaThumb)]}),
                h(
                  ColorSliderRoot,
                  {channel: "hue", colorSpace: "hsl"},
                  {
                    default: () => [
                      h(ColorSliderTrack, null, {default: () => [h(ColorSliderThumb)]}),
                    ],
                  },
                ),
                h(ColorFieldRoot, null, {
                  default: () => [h(ColorFieldGroup, null, {default: () => [h(ColorFieldInput)]})],
                }),
                h(ColorSwatchPickerRoot, null, {
                  default: () => [
                    h(
                      ColorSwatchPickerItem,
                      {color: "#ff0000"},
                      {
                        default: () => [h(ColorSwatchPickerSwatch), h(ColorSwatchPickerIndicator)],
                      },
                    ),
                  ],
                }),
              ],
            }),
          ],
        },
      );
  },
});

describe("T07 color SSR", () => {
  it("renders a closed color picker without the popover", async () => {
    const html = await renderSSR(ColorPickerPage);

    expect(html).toContain('data-slot="color-picker"');
    expect(html).toContain('data-slot="color-picker-trigger"');
    expect(html).toContain('data-slot="color-swatch"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('data-slot="color-picker-popover"');
    expect(html).not.toContain('data-slot="color-area"');
    expect(html).not.toContain('data-slot="color-swatch-picker"');
  });

  it("renders stable trigger ids across server renders", async () => {
    const [first, second] = await Promise.all([
      renderSSR(ColorPickerPage),
      renderSSR(ColorPickerPage),
    ]);
    const idPattern = /id="([^"]+)"[^>]*data-slot="color-picker-trigger"/;
    const firstId = first.match(idPattern)?.[1];
    const secondId = second.match(idPattern)?.[1];

    expect(firstId).toBeTruthy();
    expect(secondId).toBe(firstId);
  });
});
