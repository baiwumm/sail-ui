import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import Toolbar from "../toolbar-root.vue";
import Button from "../../button/button.vue";

describe("Toolbar", () => {
  it("renders the upstream slot and orientation", () => {
    const wrapper = mount(Toolbar, {
      props: {orientation: "vertical", isAttached: true},
      slots: {default: () => h(Button, null, {default: () => "Bold"})},
    });
    const toolbar = wrapper.get('[data-slot="toolbar"]');

    expect(toolbar.attributes("role")).toBe("toolbar");
    expect(toolbar.attributes("aria-orientation")).toBe("vertical");
    expect(toolbar.attributes("data-orientation")).toBe("vertical");
    expect(toolbar.classes()).toContain("toolbar--attached");
  });

  it("moves the focus with the arrow keys", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Toolbar, null, {
              default: () => [
                h(Button, {key: "a"}, {default: () => "A"}),
                h(Button, {key: "b"}, {default: () => "B"}),
                h(Button, {key: "c"}, {default: () => "C"}),
              ],
            });
        },
      }),
      {attachTo: document.body},
    );

    const buttons = wrapper.findAll("button");

    (buttons[0]!.element as HTMLElement).focus();
    await nextTick();

    await wrapper.get('[data-slot="toolbar"]').trigger("keydown", {key: "ArrowRight"});
    expect(document.activeElement).toBe(buttons[1]!.element);

    await wrapper.get('[data-slot="toolbar"]').trigger("keydown", {key: "ArrowRight"});
    expect(document.activeElement).toBe(buttons[2]!.element);

    await wrapper.get('[data-slot="toolbar"]').trigger("keydown", {key: "ArrowLeft"});
    expect(document.activeElement).toBe(buttons[1]!.element);

    wrapper.unmount();
  });

  it("moves the focus backwards in RTL", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Toolbar,
              {dir: "rtl"},
              {
                default: () => [
                  h(Button, {key: "a"}, {default: () => "A"}),
                  h(Button, {key: "b"}, {default: () => "B"}),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    const buttons = wrapper.findAll("button");

    (buttons[1]!.element as HTMLElement).focus();
    await nextTick();

    await wrapper.get('[data-slot="toolbar"]').trigger("keydown", {key: "ArrowRight"});
    expect(document.activeElement).toBe(buttons[0]!.element);

    wrapper.unmount();
  });
});
