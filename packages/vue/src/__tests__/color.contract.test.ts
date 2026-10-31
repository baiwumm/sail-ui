import {flushPromises, mount} from "@vue/test-utils";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, shallowRef} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {ColorAreaRoot, ColorAreaThumb} from "../components/color-area";
import {
  ColorFieldGroup,
  ColorFieldInput,
  ColorFieldPrefix,
  ColorFieldRoot,
  ColorFieldSuffix,
} from "../components/color-field";
import {ColorPickerPopover, ColorPickerRoot, ColorPickerTrigger} from "../components/color-picker";
import {
  ColorSliderOutput,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
} from "../components/color-slider";
import {ColorSwatchRoot} from "../components/color-swatch";
import {
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
} from "../components/color-swatch-picker";
import {Label} from "../components/label";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const renderedSlots = new Set<string>();

function expectUpstreamSlots(html: string, components: string[], extras: string[] = []) {
  const expected = new Set([
    ...components.flatMap((component) => slotSnapshot.components[component] ?? []),
    ...extras,
  ]);

  for (const slot of dataSlots(html)) {
    renderedSlots.add(slot);
    expect(expected.has(slot), `unknown slot: ${slot}`).toBe(true);
  }
}

const colorParts = {
  ColorAreaRoot,
  ColorAreaThumb,
  ColorFieldGroup,
  ColorFieldInput,
  ColorFieldPrefix,
  ColorFieldRoot,
  ColorFieldSuffix,
  ColorPickerPopover,
  ColorPickerRoot,
  ColorPickerTrigger,
  ColorSliderOutput,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
  ColorSwatchRoot,
  Label,
};

const ColorPickerPage = defineComponent({
  components: colorParts,
  setup() {
    return {value: shallowRef("#ff0000")};
  },
  template: `
    <ColorPickerRoot v-model="value">
      <ColorPickerTrigger>
        <ColorSwatchRoot size="lg" />
        <Label>Pick a color</Label>
      </ColorPickerTrigger>
      <ColorPickerPopover>
        <ColorAreaRoot>
          <ColorAreaThumb />
        </ColorAreaRoot>
        <ColorSliderRoot channel="hue" color-space="hsl">
          <ColorSliderTrack>
            <ColorSliderThumb />
          </ColorSliderTrack>
        </ColorSliderRoot>
        <ColorFieldRoot>
          <ColorFieldGroup>
            <ColorFieldInput />
          </ColorFieldGroup>
        </ColorFieldRoot>
        <ColorSwatchPickerRoot>
          <ColorSwatchPickerItem color="#ff0000">
            <ColorSwatchPickerSwatch />
            <ColorSwatchPickerIndicator />
          </ColorSwatchPickerItem>
        </ColorSwatchPickerRoot>
      </ColorPickerPopover>
    </ColorPickerRoot>
  `,
});

const ColorStandalonePage = defineComponent({
  components: colorParts,
  setup() {
    return {value: shallowRef("#ff0000")};
  },
  template: `
    <ColorAreaRoot v-model="value">
      <ColorAreaThumb />
    </ColorAreaRoot>
    <ColorSliderRoot v-model="value" channel="hue" color-space="hsl">
      <Label>Hue</Label>
      <ColorSliderOutput />
      <ColorSliderTrack>
        <ColorSliderThumb />
      </ColorSliderTrack>
    </ColorSliderRoot>
    <ColorFieldRoot v-model="value">
      <Label>Color</Label>
      <ColorFieldGroup>
        <ColorFieldPrefix>
          <ColorSwatchRoot size="sm" />
        </ColorFieldPrefix>
        <ColorFieldInput />
        <ColorFieldSuffix>
          <ColorSwatchRoot size="sm" />
        </ColorFieldSuffix>
      </ColorFieldGroup>
    </ColorFieldRoot>
    <ColorSwatchPickerRoot v-model="value">
      <ColorSwatchPickerItem color="#ff0000">
        <ColorSwatchPickerSwatch />
        <ColorSwatchPickerIndicator />
      </ColorSwatchPickerItem>
    </ColorSwatchPickerRoot>
  `,
});

afterEach(() => {
  document.body.replaceChildren();
});

describe("Color contract", () => {
  it("renders only upstream slots in the standalone parts", async () => {
    const html = await renderSSR(ColorStandalonePage);

    expectUpstreamSlots(
      html,
      [
        "color-area",
        "color-field",
        "color-input-group",
        "color-slider",
        "color-swatch",
        "color-swatch-picker",
      ],
      ["label"],
    );

    for (const slot of [
      "color-area",
      "color-area-thumb",
      "color-field",
      "color-input-group",
      "color-input-group-input",
      "color-input-group-prefix",
      "color-input-group-suffix",
      "color-slider",
      "color-slider-output",
      "color-slider-thumb",
      "color-slider-track",
      "color-swatch",
      "color-swatch-picker",
      "color-swatch-picker-checkmark",
      "color-swatch-picker-indicator",
      "color-swatch-picker-item",
      "color-swatch-picker-swatch",
    ]) {
      expect(renderedSlots.has(slot), `missing slot: ${slot}`).toBe(true);
    }
  });

  it("renders a closed color picker without the popover", async () => {
    const html = await renderSSR(ColorPickerPage);

    expectUpstreamSlots(html, ["color-picker", "color-swatch"], ["label"]);
    expect(renderedSlots.has("color-picker")).toBe(true);
    expect(renderedSlots.has("color-picker-trigger")).toBe(true);
    expect(renderedSlots.has("color-swatch")).toBe(true);
    expect(renderedSlots.has("color-picker-popover")).toBe(false);

    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain("aria-controls=");
  });

  it("renders the open popover and nested parts contract", async () => {
    const wrapper = mount(ColorPickerPage, {attachTo: document.body});

    (wrapper.get('[data-slot="color-picker-trigger"]').element as HTMLElement).click();
    await flushPromises();

    const popover = document.querySelector<HTMLElement>('[data-slot="color-picker-popover"]');
    const trigger = wrapper.get('[data-slot="color-picker-trigger"]');

    expect(popover).not.toBeNull();
    expect(popover?.classList.contains("color-picker__popover")).toBe(true);
    expect(popover?.getAttribute("role")).toBe("dialog");
    expect(popover?.getAttribute("data-placement")).toBe("bottom");
    expect(popover?.hasAttribute("data-entering")).toBe(true);
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(trigger.attributes("aria-controls")).toBe(popover?.id);
    expect(popover?.getAttribute("aria-labelledby")).toBe(trigger.attributes("id"));

    const nestedSlots = new Set(dataSlots(popover?.outerHTML ?? ""));

    expect(nestedSlots.has("color-area")).toBe(true);
    expect(nestedSlots.has("color-slider")).toBe(true);
    expect(nestedSlots.has("color-field")).toBe(true);
    expect(nestedSlots.has("color-swatch-picker")).toBe(true);

    wrapper.unmount();
  });
});
