import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import ButtonGroup from "../button-group-root.vue";
import ButtonGroupSeparator from "../button-group-separator.vue";
import Button from "../../button/button.vue";

describe("ButtonGroup", () => {
  it("renders the upstream slots and orientation class", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(ButtonGroup, {orientation: "vertical"}, {
              default: () => [
                h(Button, null, {default: () => "A"}),
                h(ButtonGroupSeparator),
                h(Button, null, {default: () => "B"})
              ]
            });
        }
      })
    );

    const group = wrapper.get('[data-slot="button-group"]');

    expect(group.attributes("role")).toBe("group");
    expect(group.classes()).toContain("button-group--vertical");
    expect(wrapper.get('[data-slot="button-group-separator"]').attributes("aria-hidden")).toBe(
      "true"
    );
  });

  it("propagates the size and the variant to the buttons", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(ButtonGroup, {size: "lg", variant: "outline"}, {
              default: () => [h(Button, null, {default: () => "A"})]
            });
        }
      })
    );

    const button = wrapper.get("button");

    expect(button.classes()).toContain("button--lg");
    expect(button.classes()).toContain("button--outline");
  });

  it("lets a button override the group", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(ButtonGroup, {size: "lg"}, {
              default: () => [h(Button, {size: "sm"}, {default: () => "A"})]
            });
        }
      })
    );

    expect(wrapper.get("button").classes()).toContain("button--sm");
  });

  it("disables the buttons of the group", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(ButtonGroup, {isDisabled: true}, {
              default: () => [h(Button, null, {default: () => "A"})]
            });
        }
      })
    );

    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
  });
});
