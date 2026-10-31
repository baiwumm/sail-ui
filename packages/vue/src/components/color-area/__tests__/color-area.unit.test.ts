import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, nextTick, shallowRef} from "vue";

import ColorAreaRoot from "../color-area-root.vue";
import ColorAreaThumb from "../color-area-thumb.vue";

const parts = {ColorAreaRoot, ColorAreaThumb};

const areaOf = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-slot="color-area"]');
const thumbOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-slot="color-area-thumb"]');

describe("ColorArea", () => {
  it("renders the area and thumb contract", () => {
    const wrapper = mount(
      defineComponent({
        components: parts,
        template: `
          <ColorAreaRoot default-value="#ff0000">
            <ColorAreaThumb />
          </ColorAreaRoot>
        `,
      }),
    );

    const area = areaOf(wrapper);
    const thumb = thumbOf(wrapper);

    expect(area.classes()).toContain("color-area");
    expect(area.attributes("data-disabled")).toBeUndefined();
    expect(area.attributes("style")).toContain("--color-area-background");
    expect(thumb.classes()).toContain("color-area__thumb");
    expect(thumb.attributes("role")).toBe("slider");
    expect(thumb.attributes("aria-label")).toBe("Hue, Saturation");
    expect(thumb.attributes("aria-valuenow")).toBe("0");
    expect(thumb.attributes("aria-valuemax")).toBe("360");
    expect(thumb.attributes("tabindex")).toBe("0");
    expect(thumb.attributes("style")).toContain("--color-area-thumb-color");

    wrapper.unmount();
  });

  it("adds the show-dots variant class", () => {
    const wrapper = mount(
      defineComponent({
        components: parts,
        template: `
          <ColorAreaRoot default-value="#ff0000" show-dots>
            <ColorAreaThumb />
          </ColorAreaRoot>
        `,
      }),
    );

    expect(areaOf(wrapper).classes()).toContain("color-area--show-dots");

    wrapper.unmount();
  });

  it("steps the channel with the keyboard and emits change", async () => {
    const changes: string[] = [];
    const wrapper = mount(
      defineComponent({
        components: parts,
        setup: () => ({changes}),
        template: `
          <ColorAreaRoot default-value="#ff0000" @change="changes.push($event)">
            <ColorAreaThumb />
          </ColorAreaRoot>
        `,
      }),
    );
    const area = areaOf(wrapper);

    await area.trigger("keydown", {key: "ArrowRight"});

    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatch(/^#[0-9a-f]{6}$/);
    expect(changes[0]).not.toBe("#ff0000");
    expect(thumbOf(wrapper).attributes("aria-valuenow")).toBe("1");

    wrapper.unmount();
  });

  it("updates a controlled model", async () => {
    const value = shallowRef("#ff0000");
    const colors: unknown[] = [];
    const wrapper = mount(
      defineComponent({
        components: parts,
        setup: () => ({colors, value}),
        template: `
          <ColorAreaRoot v-model="value" @update:color="colors.push($event)">
            <ColorAreaThumb />
          </ColorAreaRoot>
        `,
      }),
    );

    await areaOf(wrapper).trigger("keydown", {key: "ArrowRight"});

    expect(value.value).not.toBe("#ff0000");
    expect(value.value).toMatch(/^#[0-9a-f]{6}$/);
    expect(colors).toHaveLength(1);

    wrapper.unmount();
  });

  it("does not change a disabled area", async () => {
    const changes: string[] = [];
    const wrapper = mount(
      defineComponent({
        components: parts,
        setup: () => ({changes}),
        template: `
          <ColorAreaRoot default-value="#ff0000" is-disabled @change="changes.push($event)">
            <ColorAreaThumb />
          </ColorAreaRoot>
        `,
      }),
    );

    expect(areaOf(wrapper).attributes("data-disabled")).toBe("true");
    expect(thumbOf(wrapper).attributes("data-disabled")).toBe("true");
    expect(thumbOf(wrapper).attributes("tabindex")).toBeUndefined();

    await areaOf(wrapper).trigger("keydown", {key: "ArrowRight"});

    expect(changes).toHaveLength(0);

    wrapper.unmount();
  });

  it("tracks the dragging state from pointer events", async () => {
    const wrapper = mount(
      defineComponent({
        components: parts,
        template: `
          <ColorAreaRoot default-value="#ff0000">
            <ColorAreaThumb />
          </ColorAreaRoot>
        `,
      }),
      {attachTo: document.body},
    );

    areaOf(wrapper).element.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    await nextTick();

    expect(thumbOf(wrapper).attributes("data-dragging")).toBe("true");

    window.dispatchEvent(new PointerEvent("pointerup", {pointerId: 1}));
    await nextTick();

    expect(thumbOf(wrapper).attributes("data-dragging")).toBeUndefined();

    wrapper.unmount();
  });
});
