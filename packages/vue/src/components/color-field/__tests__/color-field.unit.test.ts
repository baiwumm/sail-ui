import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, nextTick, shallowRef} from "vue";

import {Description} from "../../description";
import {FieldError} from "../../field-error";
import {Label} from "../../label";
import ColorSwatchRoot from "../../color-swatch/color-swatch.vue";
import ColorFieldRoot from "../color-field-root.vue";
import ColorInputGroup from "../color-input-group.vue";
import ColorInputGroupInput from "../color-input-group-input.vue";
import ColorInputGroupPrefix from "../color-input-group-prefix.vue";
import ColorInputGroupSuffix from "../color-input-group-suffix.vue";

const parts = {
  ColorFieldRoot,
  ColorInputGroup,
  ColorInputGroupInput,
  ColorInputGroupPrefix,
  ColorInputGroupSuffix,
  ColorSwatchRoot,
  Description,
  FieldError,
  Label,
};

function mountField(template: string, setup: () => Record<string, unknown> = () => ({})) {
  return mount(defineComponent({components: parts, setup, template}), {
    attachTo: document.body,
  });
}

const inputOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get<HTMLInputElement>('[data-slot="color-input-group-input"]');

describe("ColorField", () => {
  it("renders the field, group, prefix, input and suffix contract", () => {
    const wrapper = mountField(`
      <ColorFieldRoot default-value="#336699" full-width>
        <Label>Color</Label>
        <ColorInputGroup>
          <ColorInputGroupPrefix><ColorSwatchRoot /></ColorInputGroupPrefix>
          <ColorInputGroupInput />
          <ColorInputGroupSuffix>#</ColorInputGroupSuffix>
        </ColorInputGroup>
      </ColorFieldRoot>
    `);
    const field = wrapper.get('[data-slot="color-field"]');
    const group = wrapper.get('[data-slot="color-input-group"]');
    const swatch = wrapper.get('[data-slot="color-swatch"]');

    expect(field.classes()).toContain("color-field");
    expect(field.classes()).toContain("color-field--full-width");
    expect(group.classes()).toContain("color-input-group");
    expect(group.classes()).toContain("color-input-group--primary");
    expect(group.attributes("role")).toBe("group");
    expect(wrapper.get('[data-slot="color-input-group-prefix"]').classes()).toContain(
      "color-input-group__prefix",
    );
    expect(wrapper.get('[data-slot="color-input-group-suffix"]').classes()).toContain(
      "color-input-group__suffix",
    );
    expect(inputOf(wrapper).classes()).toContain("color-input-group__input");
    expect(inputOf(wrapper).element.value).toBe("#336699");
    expect(swatch.attributes("style")).toContain("rgb(51, 102, 153)");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("commits a typed hex value on blur", async () => {
    const value = shallowRef("#ff0000");
    const changes: string[] = [];
    const wrapper = mountField(
      `
      <ColorFieldRoot v-model="value" @change="changes.push($event)">
        <ColorInputGroup>
          <ColorInputGroupInput />
        </ColorInputGroup>
      </ColorFieldRoot>
    `,
      () => ({changes, value}),
    );
    const input = inputOf(wrapper);

    await input.setValue("#00ff00");
    await input.trigger("blur");

    expect(value.value).toBe("#00ff00");
    expect(changes.at(-1)).toBe("#00ff00");
    expect(input.element.value).toBe("#00ff00");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("commits an uncontrolled value", async () => {
    const changes: string[] = [];
    const wrapper = mountField(
      `
      <ColorFieldRoot default-value="#ff0000" @change="changes.push($event)">
        <ColorInputGroup>
          <ColorInputGroupInput />
        </ColorInputGroup>
      </ColorFieldRoot>
    `,
      () => ({changes}),
    );
    const input = inputOf(wrapper);

    await input.setValue("#0000ff");
    await input.trigger("keydown", {key: "Enter"});

    expect(changes.at(-1)).toBe("#0000ff");
    expect(input.element.value).toBe("#0000ff");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("ignores invalid input and restores the current color", async () => {
    const value = shallowRef("#ff0000");
    const changes: string[] = [];
    const wrapper = mountField(
      `
      <ColorFieldRoot v-model="value" @change="changes.push($event)">
        <ColorInputGroup>
          <ColorInputGroupInput />
        </ColorInputGroup>
      </ColorFieldRoot>
    `,
      () => ({changes, value}),
    );
    const input = inputOf(wrapper);

    await input.setValue("#zzz");
    await input.trigger("blur");

    expect(changes).toHaveLength(0);
    expect(value.value).toBe("#ff0000");
    expect(input.element.value).toBe("#ff0000");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("commits numeric channels", async () => {
    const changes: string[] = [];
    const wrapper = mountField(
      `
      <ColorFieldRoot
        channel="red"
        color-space="rgb"
        default-value="#336699"
        @change="changes.push($event)"
      >
        <ColorInputGroup>
          <ColorInputGroupInput />
        </ColorInputGroup>
      </ColorFieldRoot>
    `,
      () => ({changes}),
    );
    const input = inputOf(wrapper);

    expect(input.element.value).toBe("51");

    await input.trigger("keydown", {key: "ArrowUp"});

    expect(input.element.value).toBe("52");
    expect(changes.at(-1)).toBe("#346699");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("wires the label, description and error through the field context", async () => {
    const wrapper = mountField(`
      <ColorFieldRoot default-value="#ff0000" is-invalid>
        <Label>Color</Label>
        <ColorInputGroup>
          <ColorInputGroupInput />
        </ColorInputGroup>
        <Description>Pick a color</Description>
        <FieldError>Enter a valid color</FieldError>
      </ColorFieldRoot>
    `);
    await nextTick();

    const field = wrapper.get('[data-slot="color-field"]');
    const label = wrapper.get('[data-slot="label"]');
    const description = wrapper.get('[data-slot="description"]');
    const error = wrapper.get('[data-slot="field-error"]');
    const input = inputOf(wrapper);

    expect(field.attributes("data-invalid")).toBe("true");
    expect(wrapper.get('[data-slot="color-input-group"]').attributes("data-invalid")).toBe("true");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-labelledby")).toBe(label.attributes("id"));
    expect(error.text()).toBe("Enter a valid color");
    expect(error.attributes("data-visible")).toBe("true");

    const describedBy = input.attributes("aria-describedby")?.split(" ") ?? [];

    expect(describedBy).toContain(description.attributes("id"));
    expect(describedBy).toContain(error.attributes("id"));

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("marks a disabled or read-only field", () => {
    const wrapper = mountField(`
      <ColorFieldRoot default-value="#ff0000" is-disabled is-read-only>
        <ColorInputGroup>
          <ColorInputGroupInput />
        </ColorInputGroup>
      </ColorFieldRoot>
    `);
    const field = wrapper.get('[data-slot="color-field"]');
    const group = wrapper.get('[data-slot="color-input-group"]');
    const input = inputOf(wrapper);

    expect(field.attributes("data-disabled")).toBe("true");
    expect(field.attributes("data-readonly")).toBe("true");
    expect(group.attributes("data-disabled")).toBe("true");
    expect(input.attributes("data-disabled")).toBe("true");
    expect(input.attributes("data-readonly")).toBe("true");
    expect(input.element.disabled).toBe(true);
    expect(input.element.readOnly).toBe(true);

    wrapper.unmount();
    document.body.replaceChildren();
  });
});
