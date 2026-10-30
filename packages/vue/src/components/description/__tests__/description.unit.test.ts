import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import Input from "../../input/input.vue";
import TextField from "../../input/text-field.vue";
import Label from "../../label/label.vue";
import Description from "../description.vue";

describe("Description", () => {
  it("renders a standalone span with the upstream slot", () => {
    const wrapper = mount(Description, {
      attrs: {class: "extra"},
      slots: {default: () => "We never share it."}
    });

    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["description", "extra"]));
    expect(wrapper.attributes("data-slot")).toBe("description");
    expect(wrapper.text()).toBe("We never share it.");
  });

  it("registers as the field description for aria-describedby", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(TextField, null, {
            default: () => [
              h(Label, null, {default: () => "Email"}),
              h(Input),
              h(Description, null, {default: () => "We never share it."})
            ]
          });
      }
    });
    const wrapper = mount(host, {attachTo: document.body});

    await nextTick();
    await nextTick();

    const input = wrapper.get("input");
    const description = wrapper.get("[data-slot='description']");

    expect(input.attributes("aria-describedby")).toContain(description.attributes("id"));
    wrapper.unmount();
  });
});
