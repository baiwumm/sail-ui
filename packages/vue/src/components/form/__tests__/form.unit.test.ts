import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h, nextTick} from "vue";

import Form from "../form-root.vue";
import Input from "../../input/input.vue";

describe("Form", () => {
  it("renders a native form without a data-slot", () => {
    const wrapper = mount(Form, {slots: {default: () => "content"}});
    const form = wrapper.get("form");

    expect(form.attributes("data-slot")).toBeUndefined();
    expect(form.text()).toBe("content");
  });

  it("emits submit with the native event", async () => {
    const wrapper = mount(Form, {
      slots: {default: () => h(Input, {name: "email"})},
    });

    await wrapper.get("form").trigger("submit");

    const events = wrapper.emitted("submit");

    expect(events).toHaveLength(1);
    expect(events?.[0]?.[0]).toBeInstanceOf(Event);
  });

  it("emits invalid when a control fails the native validation", async () => {
    const wrapper = mount(Form, {
      attachTo: document.body,
      slots: {
        default: () => h(Input, {name: "email", required: true, value: ""}),
      },
    });

    const input = wrapper.get("input");

    input.element.dispatchEvent(new Event("invalid", {bubbles: false}));
    await nextTick();

    expect(wrapper.emitted("invalid")).toHaveLength(1);

    wrapper.unmount();
  });

  it("does not submit while an IME composition is active", async () => {
    const wrapper = mount(Form, {
      slots: {default: () => h(Input, {name: "email"})},
    });

    await wrapper.get("form").trigger("keydown", {key: "Enter", isComposing: true});
    await nextTick();

    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("passes the native attributes through", () => {
    const wrapper = mount(Form, {
      props: {method: "post", action: "/subscribe", name: "newsletter"},
      slots: {default: () => "content"},
    });
    const form = wrapper.get("form");

    expect(form.attributes("method")).toBe("post");
    expect(form.attributes("action")).toBe("/subscribe");
    expect(form.attributes("name")).toBe("newsletter");
  });
});
