import {flushPromises, mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, nextTick, ref, shallowRef} from "vue";

import ColorSwatchRoot from "../../color-swatch/color-swatch.vue";
import {Label} from "../../label";
import ColorAreaRoot from "../../color-area/color-area-root.vue";
import ColorAreaThumb from "../../color-area/color-area-thumb.vue";
import ColorFieldGroup from "../../color-field/color-input-group.vue";
import ColorFieldInput from "../../color-field/color-input-group-input.vue";
import ColorFieldRoot from "../../color-field/color-field-root.vue";
import ColorSwatchPickerIndicator from "../../color-swatch-picker/color-swatch-picker-indicator.vue";
import ColorSwatchPickerItem from "../../color-swatch-picker/color-swatch-picker-item.vue";
import ColorSwatchPickerRoot from "../../color-swatch-picker/color-swatch-picker-root.vue";
import ColorSwatchPickerSwatch from "../../color-swatch-picker/color-swatch-picker-swatch.vue";
import ColorPickerPopover from "../color-picker-popover.vue";
import ColorPickerRoot from "../color-picker-root.vue";
import ColorPickerTrigger from "../color-picker-trigger.vue";

const presets = ["#ff0000", "#00ff00", "#0000ff"];

const parts = {
  ColorAreaRoot,
  ColorAreaThumb,
  ColorFieldGroup,
  ColorFieldInput,
  ColorFieldRoot,
  ColorPickerPopover,
  ColorPickerRoot,
  ColorPickerTrigger,
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
  ColorSwatchRoot,
  Label,
};

function createHost(options: {disabled?: boolean} = {}) {
  return defineComponent({
    components: parts,
    setup() {
      const value = shallowRef("#ff0000");
      const open = ref(false);
      const changes: string[] = [];
      const colors: unknown[] = [];

      return {changes, colors, open, presets, value, disabled: options.disabled ?? false};
    },
    template: `
      <ColorPickerRoot v-model="value" v-model:open="open" @change="changes.push($event)" @update:color="colors.push($event)">
        <ColorPickerTrigger :is-disabled="disabled">
          <ColorSwatchRoot size="lg" />
          <Label>Pick a color</Label>
        </ColorPickerTrigger>
        <ColorPickerPopover>
          <ColorAreaRoot
            aria-label="Color area"
            color-space="hsb"
            x-channel="saturation"
            y-channel="brightness"
          >
            <ColorAreaThumb />
          </ColorAreaRoot>
          <ColorSwatchPickerRoot>
            <ColorSwatchPickerItem v-for="preset in presets" :key="preset" :color="preset">
              <ColorSwatchPickerSwatch />
              <ColorSwatchPickerIndicator />
            </ColorSwatchPickerItem>
          </ColorSwatchPickerRoot>
          <ColorFieldRoot aria-label="Color field">
            <ColorFieldGroup>
              <ColorFieldInput />
            </ColorFieldGroup>
          </ColorFieldRoot>
        </ColorPickerPopover>
      </ColorPickerRoot>
    `,
  });
}

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="color-picker-trigger"]')!;
const popoverOf = () => document.querySelector<HTMLElement>('[data-slot="color-picker-popover"]');
const swatchOf = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-slot="color-swatch"]');

const pressEscape = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key: "Escape"}),
  );
};

describe("ColorPicker", () => {
  it("renders the closed picker and trigger contract", () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const root = wrapper.get('[data-slot="color-picker"]');
    const trigger = triggerOf();

    expect(root.classes()).toContain("color-picker");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.classList.contains("color-picker__trigger")).toBe(true);
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(swatchOf(wrapper).attributes("aria-label")).toBe("vibrant red");
    expect(popoverOf()).toBeNull();

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("opens the popover and binds nested parts to the picker color", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    const popover = popoverOf();
    const trigger = triggerOf();

    expect(popover).not.toBeNull();
    expect(popover?.classList.contains("color-picker__popover")).toBe(true);
    expect(popover?.getAttribute("role")).toBe("dialog");
    expect(popover?.getAttribute("data-placement")).toBe("bottom");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(popover?.id);
    expect(popover?.getAttribute("aria-labelledby")).toBe(trigger.id);

    const thumb = document.querySelector<HTMLElement>('[data-slot="color-area-thumb"]');

    expect(thumb?.getAttribute("aria-valuenow")).toBe("100");

    const items = document.querySelectorAll<HTMLElement>('[data-slot="color-swatch-picker-item"]');

    expect(items[0]?.getAttribute("aria-selected")).toBe("true");

    const fieldInput = document.querySelector<HTMLInputElement>(
      '[data-slot="color-input-group-input"]',
    );

    expect(fieldInput?.value).toBe("#ff0000");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("updates the picker from a nested swatch selection", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    const items = document.querySelectorAll<HTMLElement>('[data-slot="color-swatch-picker-item"]');

    items[2]?.dispatchEvent(new MouseEvent("click", {bubbles: true}));
    await flushPromises();
    await nextTick();

    const state = wrapper.vm as unknown as {changes: string[]; colors: unknown[]; value: string};

    expect(state.value).toBe("#0000ff");
    expect(state.changes).toEqual(["#0000ff"]);
    expect(state.colors).toHaveLength(1);
    expect(swatchOf(wrapper).attributes("aria-label")).toBe("vibrant blue-violet");
    expect(items[2]?.getAttribute("aria-selected")).toBe("true");

    const fieldInput = document.querySelector<HTMLInputElement>(
      '[data-slot="color-input-group-input"]',
    );

    expect(fieldInput?.value).toBe("#0000ff");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("keeps an uncontrolled picker value from the default", async () => {
    const changes: string[] = [];
    const wrapper = mount(
      defineComponent({
        components: parts,
        setup: () => ({changes, presets}),
        template: `
          <ColorPickerRoot default-value="#ff0000" @change="changes.push($event)">
            <ColorPickerTrigger aria-label="Pick a color">
              <ColorSwatchRoot />
            </ColorPickerTrigger>
            <ColorPickerPopover>
              <ColorSwatchPickerRoot>
                <ColorSwatchPickerItem v-for="preset in presets" :key="preset" :color="preset">
                  <ColorSwatchPickerSwatch />
                </ColorSwatchPickerItem>
              </ColorSwatchPickerRoot>
            </ColorPickerPopover>
          </ColorPickerRoot>
        `,
      }),
      {attachTo: document.body},
    );

    expect(swatchOf(wrapper).attributes("aria-label")).toBe("vibrant red");

    triggerOf().click();
    await flushPromises();

    const items = document.querySelectorAll<HTMLElement>('[data-slot="color-swatch-picker-item"]');

    items[1]?.dispatchEvent(new MouseEvent("click", {bubbles: true}));
    await flushPromises();
    await nextTick();

    expect(changes.at(-1)).toBe("#00ff00");
    expect(swatchOf(wrapper).attributes("aria-label")).toBe("vibrant green");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.click();
    await flushPromises();

    expect(popoverOf()).not.toBeNull();

    pressEscape();
    await nextTick();

    expect(popoverOf()?.getAttribute("data-exiting")).toBe("true");

    await flushPromises();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(popoverOf()).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("does not open from a disabled trigger", async () => {
    const wrapper = mount(createHost({disabled: true}), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    expect(triggerOf().hasAttribute("disabled")).toBe(true);
    expect(triggerOf().getAttribute("data-disabled")).toBe("true");
    expect(popoverOf()).toBeNull();

    wrapper.unmount();
    document.body.replaceChildren();
  });
});
