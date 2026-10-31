import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, nextTick, shallowRef} from "vue";

import ColorSwatchPickerIndicator from "../color-swatch-picker-indicator.vue";
import ColorSwatchPickerItem from "../color-swatch-picker-item.vue";
import ColorSwatchPickerRoot from "../color-swatch-picker-root.vue";
import ColorSwatchPickerSwatch from "../color-swatch-picker-swatch.vue";

const parts = {
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
};

const colors = ["#ff0000", "#00ff00", "#0000ff"];

function mountPicker(template: string, setup: () => Record<string, unknown> = () => ({})) {
  return mount(defineComponent({components: parts, setup, template}), {
    attachTo: document.body,
  });
}

const listboxOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-slot="color-swatch-picker"]');
const itemsOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot="color-swatch-picker-item"]');

describe("ColorSwatchPicker", () => {
  it("renders the listbox and item contract", () => {
    const wrapper = mountPicker(
      `
      <ColorSwatchPickerRoot default-value="#00ff00">
        <ColorSwatchPickerItem v-for="color in colors" :key="color" :color="color">
          <ColorSwatchPickerSwatch />
          <ColorSwatchPickerIndicator />
        </ColorSwatchPickerItem>
      </ColorSwatchPickerRoot>
    `,
      () => ({colors}),
    );
    const listbox = listboxOf(wrapper);
    const items = itemsOf(wrapper);

    expect(listbox.classes()).toContain("color-swatch-picker");
    expect(listbox.classes()).toContain("color-swatch-picker--grid");
    expect(listbox.classes()).toContain("color-swatch-picker--md");
    expect(listbox.classes()).toContain("color-swatch-picker--circle");
    expect(listbox.attributes("role")).toBe("listbox");
    expect(listbox.attributes("aria-orientation")).toBe("horizontal");
    expect(items).toHaveLength(3);
    expect(items[0]?.attributes("role")).toBe("option");
    expect(items[0]?.attributes("aria-label")).toBe("vibrant red");
    expect(items[0]?.attributes("data-selected")).toBeUndefined();
    expect(items[1]?.attributes("aria-selected")).toBe("true");
    expect(items[1]?.attributes("data-selected")).toBe("true");
    expect(items[0]?.attributes("style")).toContain("rgb(255, 0, 0)");

    const swatch = wrapper.get('[data-slot="color-swatch-picker-swatch"]');
    const indicator = wrapper.get('[data-slot="color-swatch-picker-indicator"]');

    expect(swatch.classes()).toContain("color-swatch-picker__swatch");
    expect(swatch.attributes("style")).toContain("rgb(255, 0, 0)");
    expect(indicator.classes()).toContain("color-swatch-picker__indicator");
    expect(indicator.attributes("aria-hidden")).toBe("true");
    expect(indicator.find('[data-slot="color-swatch-picker-checkmark"]').exists()).toBe(true);

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("applies layout, size, variant and text-value overrides", () => {
    const wrapper = mountPicker(`
      <ColorSwatchPickerRoot layout="stack" size="xs" variant="square">
        <ColorSwatchPickerItem color="#ff0000" text-value="Brand red">
          <ColorSwatchPickerSwatch />
        </ColorSwatchPickerItem>
      </ColorSwatchPickerRoot>
    `);
    const listbox = listboxOf(wrapper);
    const item = itemsOf(wrapper)[0];

    expect(listbox.classes()).toContain("color-swatch-picker--stack");
    expect(listbox.classes()).toContain("color-swatch-picker--xs");
    expect(listbox.classes()).toContain("color-swatch-picker--square");
    expect(listbox.attributes("aria-orientation")).toBe("vertical");
    expect(item?.attributes("aria-label")).toBe("Brand red");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("selects a color with the mouse in controlled mode", async () => {
    const value = shallowRef("#ff0000");
    const changes: string[] = [];
    const wrapper = mountPicker(
      `
      <ColorSwatchPickerRoot v-model="value" @change="changes.push($event)">
        <ColorSwatchPickerItem v-for="color in colors" :key="color" :color="color">
          <ColorSwatchPickerSwatch />
        </ColorSwatchPickerItem>
      </ColorSwatchPickerRoot>
    `,
      () => ({changes, colors, value}),
    );
    const items = itemsOf(wrapper);

    items[2]?.element.dispatchEvent(new MouseEvent("click", {bubbles: true}));
    await nextTick();

    expect(value.value).toBe("#0000ff");
    expect(changes).toEqual(["#0000ff"]);
    expect(itemsOf(wrapper)[2]?.attributes("data-selected")).toBe("true");
    expect(itemsOf(wrapper)[0]?.attributes("data-selected")).toBeUndefined();

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("keeps the selection when the selected item is activated again", async () => {
    const value = shallowRef("#ff0000");
    const changes: string[] = [];
    const wrapper = mountPicker(
      `
      <ColorSwatchPickerRoot v-model="value" @change="changes.push($event)">
        <ColorSwatchPickerItem v-for="color in colors" :key="color" :color="color">
          <ColorSwatchPickerSwatch />
        </ColorSwatchPickerItem>
      </ColorSwatchPickerRoot>
    `,
      () => ({changes, colors, value}),
    );

    itemsOf(wrapper)[0]?.element.dispatchEvent(new MouseEvent("click", {bubbles: true}));
    await nextTick();

    expect(value.value).toBe("#ff0000");
    expect(changes).toHaveLength(0);

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("selects a color with the keyboard", async () => {
    const changes: string[] = [];
    const wrapper = mountPicker(
      `
      <ColorSwatchPickerRoot @change="changes.push($event)">
        <ColorSwatchPickerItem v-for="color in colors" :key="color" :color="color">
          <ColorSwatchPickerSwatch />
        </ColorSwatchPickerItem>
      </ColorSwatchPickerRoot>
    `,
      () => ({changes, colors}),
    );
    const listbox = listboxOf(wrapper);

    (listbox.element as HTMLElement).focus();
    await listbox.trigger("keydown", {key: "ArrowRight"});
    await nextTick();
    await listbox.trigger("keydown", {key: "Enter"});
    await nextTick();

    expect(changes).toEqual(["#ff0000"]);
    expect(itemsOf(wrapper)[0]?.attributes("aria-selected")).toBe("true");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("marks the whole picker and its items as disabled", () => {
    const wrapper = mountPicker(
      `
      <ColorSwatchPickerRoot is-disabled>
        <ColorSwatchPickerItem v-for="color in colors" :key="color" :color="color">
          <ColorSwatchPickerSwatch />
        </ColorSwatchPickerItem>
      </ColorSwatchPickerRoot>
    `,
      () => ({colors}),
    );

    expect(listboxOf(wrapper).attributes("data-disabled")).toBe("true");
    expect(itemsOf(wrapper)[0]?.attributes("data-disabled")).toBe("true");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("marks light colors on the indicator", () => {
    const wrapper = mountPicker(`
      <ColorSwatchPickerRoot>
        <ColorSwatchPickerItem color="#ffffff">
          <ColorSwatchPickerSwatch />
          <ColorSwatchPickerIndicator />
        </ColorSwatchPickerItem>
        <ColorSwatchPickerItem color="#000000">
          <ColorSwatchPickerSwatch />
          <ColorSwatchPickerIndicator />
        </ColorSwatchPickerItem>
      </ColorSwatchPickerRoot>
    `);
    const indicators = wrapper.findAll('[data-slot="color-swatch-picker-indicator"]');

    expect(indicators[0]?.attributes("data-light-color")).toBe("true");
    expect(indicators[1]?.attributes("data-light-color")).toBeUndefined();

    wrapper.unmount();
    document.body.replaceChildren();
  });
});
