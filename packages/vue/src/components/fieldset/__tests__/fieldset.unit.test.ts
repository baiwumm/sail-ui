import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import FieldGroup from "../field-group.vue";
import Fieldset from "../fieldset-root.vue";
import FieldsetActions from "../fieldset-actions.vue";
import FieldsetLegend from "../fieldset-legend.vue";

function renderFieldset(props: Record<string, unknown> = {}) {
  return mount(Fieldset, {
    props,
    slots: {
      default: () => [
        h(FieldsetLegend, null, {default: () => "Address"}),
        h(FieldGroup, null, {default: () => "Fields"}),
        h(FieldsetActions, null, {default: () => "Save"})
      ]
    }
  });
}

describe("Fieldset", () => {
  it("renders fieldset, legend, group, and actions parts", () => {
    const wrapper = renderFieldset();

    expect(wrapper.element.tagName).toBe("FIELDSET");
    expect(wrapper.classes()).toContain("fieldset");
    expect(wrapper.get("[data-slot='fieldset-legend']").element.tagName).toBe("LEGEND");
    expect(wrapper.get("[data-slot='fieldset-legend']").classes()).toContain(
      "fieldset__legend"
    );
    expect(wrapper.get("[data-slot='fieldset-field-group']").classes()).toContain(
      "fieldset__field-group"
    );
    expect(wrapper.get("[data-slot='fieldset-actions']").classes()).toContain(
      "fieldset__actions"
    );
  });

  it("disables the native fieldset and emits the state attribute", () => {
    const wrapper = renderFieldset({isDisabled: true});

    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.attributes("data-disabled")).toBe("true");
  });

  it("does not emit disabled attributes when enabled", () => {
    const wrapper = renderFieldset();

    expect(wrapper.attributes("disabled")).toBeUndefined();
    expect(wrapper.attributes("data-disabled")).toBeUndefined();
  });

  it("supports polymorphic rendering", () => {
    const wrapper = renderFieldset({as: "div"});

    expect(wrapper.element.tagName).toBe("DIV");
  });
});
