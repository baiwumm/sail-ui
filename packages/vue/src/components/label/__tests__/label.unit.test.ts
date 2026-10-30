import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import Input from "../../input/input.vue";
import TextField from "../../input/text-field.vue";
import {labelContextKey} from "../../../shared/label-context";
import Label from "../label.vue";

describe("Label", () => {
  it("renders a label with the upstream slot and base class", () => {
    const wrapper = mount(Label, {slots: {default: () => "Email"}});

    expect(wrapper.element.tagName).toBe("LABEL");
    expect(wrapper.attributes("data-slot")).toBe("label");
    expect(wrapper.classes()).toContain("label");
  });

  it("maps state props to variant classes", () => {
    const wrapper = mount(Label, {
      props: {isDisabled: true, isInvalid: true, isRequired: true},
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["label--disabled", "label--invalid", "label--required"]),
    );
  });

  it("links to the control through a FieldRoot", () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(TextField, null, {
            default: () => [h(Label, null, {default: () => "Email"}), h(Input)],
          });
      },
    });
    const wrapper = mount(host, {attachTo: document.body});

    expect(wrapper.get("label").attributes("for")).toBe(wrapper.get("input").attributes("id"));
    wrapper.unmount();
  });

  it("renders a span when the label context asks for non-labelable widgets", () => {
    const host = defineComponent({
      setup() {
        return () => h(Label, {id: "progress-label"}, {default: () => "Loading"});
      },
    });
    const wrapper = mount(host, {
      global: {
        provide: {
          [labelContextKey]: {id: "progress-label", elementType: "span"},
        },
      },
    });

    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.attributes("id")).toBe("progress-label");
  });

  it("accepts explicit ids outside a field", () => {
    const wrapper = mount(Label, {attrs: {id: "email-label"}, slots: {default: () => "Email"}});

    expect(wrapper.attributes("id")).toBe("email-label");
    expect(wrapper.attributes("for")).toBeUndefined();
  });
});
