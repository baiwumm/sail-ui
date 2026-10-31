import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import AccordionBody from "../accordion-body.vue";
import AccordionHeading from "../accordion-heading.vue";
import AccordionIndicator from "../accordion-indicator.vue";
import AccordionItem from "../accordion-item.vue";
import AccordionPanel from "../accordion-panel.vue";
import AccordionRoot from "../accordion-root.vue";
import AccordionTrigger from "../accordion-trigger.vue";

interface RenderOptions {
  props?: Record<string, unknown>;
  items?: string[];
}

function renderAccordion({props = {}, items = ["one", "two"]}: RenderOptions = {}) {
  return mount(AccordionRoot, {
    attachTo: document.body,
    props,
    slots: {
      default: () =>
        items.map((id) =>
          h(
            AccordionItem,
            {id, key: id},
            {
              default: () => [
                h(AccordionHeading, null, {
                  default: () => [
                    h(AccordionTrigger, null, {
                      default: () => [h("span", `Trigger ${id}`), h(AccordionIndicator)],
                    }),
                  ],
                }),
                h(AccordionPanel, null, {
                  default: () => h(AccordionBody, null, {default: () => `Content ${id}`}),
                }),
              ],
            },
          ),
        ),
    },
  });
}

const triggers = (wrapper: ReturnType<typeof renderAccordion>) =>
  wrapper.findAll('[data-slot="accordion-trigger"]');
const panels = (wrapper: ReturnType<typeof renderAccordion>) =>
  wrapper.findAll('[data-slot="accordion-panel"]');

afterEach(() => {
  document.body.replaceChildren();
});

describe("Accordion", () => {
  it("renders every upstream part", () => {
    const wrapper = renderAccordion();

    expect(wrapper.get("[data-slot='accordion']").classes()).toContain("accordion");
    expect(wrapper.findAll("[data-slot='accordion-item']")).toHaveLength(2);
    expect(triggers(wrapper)[0]!.attributes("type")).toBe("button");
    expect(triggers(wrapper)[0]!.attributes("aria-expanded")).toBe("false");
    expect(triggers(wrapper)[0]!.attributes("aria-controls")).toBe(
      panels(wrapper)[0]!.attributes("id"),
    );
    expect(panels(wrapper)[0]!.attributes("role")).toBe("group");
    expect(panels(wrapper)[0]!.attributes("hidden")).toBe("until-found");
    expect(
      wrapper.findAll("[data-slot='accordion-indicator']")[0]!.attributes("data-expanded"),
    ).toBeUndefined();
    expect(wrapper.get("[data-slot='accordion-body']").text()).toBe("Content one");

    wrapper.unmount();
  });

  it("applies the surface variant and hideSeparator", () => {
    const wrapper = renderAccordion({
      props: {variant: "surface", hideSeparator: true},
    });

    expect(wrapper.get("[data-slot='accordion']").classes()).toContain("accordion--surface");
    expect(wrapper.get("[data-slot='accordion-item']").attributes("data-hide-separator")).toBe(
      "true",
    );

    wrapper.unmount();
  });

  it("expands and collapses items in single mode", async () => {
    const wrapper = renderAccordion();

    await triggers(wrapper)[0]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:expandedKeys")?.[0]).toEqual([["one"]]);
    expect(triggers(wrapper)[0]!.attributes("aria-expanded")).toBe("true");
    expect(panels(wrapper)[0]!.attributes("data-expanded")).toBe("true");
    expect(panels(wrapper)[0]!.attributes("hidden")).toBeUndefined();
    expect(
      wrapper.findAll("[data-slot='accordion-indicator']")[0]!.attributes("data-expanded"),
    ).toBe("true");

    await triggers(wrapper)[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:expandedKeys")?.[1]).toEqual([["two"]]);
    expect(triggers(wrapper)[0]!.attributes("aria-expanded")).toBe("false");
    expect(triggers(wrapper)[1]!.attributes("aria-expanded")).toBe("true");

    await triggers(wrapper)[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:expandedKeys")?.[2]).toEqual([[]]);
    expect(triggers(wrapper)[1]!.attributes("aria-expanded")).toBe("false");

    wrapper.unmount();
  });

  it("keeps several items open when allowsMultipleExpanded is set", async () => {
    const wrapper = renderAccordion({props: {allowsMultipleExpanded: true}});

    await triggers(wrapper)[0]!.trigger("click");
    await triggers(wrapper)[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:expandedKeys")?.[1]).toEqual([["one", "two"]]);
    expect(triggers(wrapper)[0]!.attributes("aria-expanded")).toBe("true");
    expect(triggers(wrapper)[1]!.attributes("aria-expanded")).toBe("true");

    wrapper.unmount();
  });

  it("seeds expansion from controlled expandedKeys", async () => {
    const wrapper = renderAccordion({props: {expandedKeys: ["two"]}});

    expect(triggers(wrapper)[0]!.attributes("aria-expanded")).toBe("false");
    expect(triggers(wrapper)[1]!.attributes("aria-expanded")).toBe("true");
    expect(panels(wrapper)[1]!.attributes("hidden")).toBeUndefined();

    await triggers(wrapper)[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:expandedKeys")?.[0]).toEqual([[]]);

    wrapper.unmount();
  });

  it("starts expanded from defaultExpandedKeys", () => {
    const wrapper = renderAccordion({props: {defaultExpandedKeys: ["one"]}});

    expect(triggers(wrapper)[0]!.attributes("aria-expanded")).toBe("true");
    expect(panels(wrapper)[0]!.attributes("hidden")).toBeUndefined();

    wrapper.unmount();
  });

  it("disables triggers at the root and at the item", async () => {
    const disabled = renderAccordion({props: {isDisabled: true}});

    expect(triggers(disabled)[0]!.attributes("disabled")).toBeDefined();
    await triggers(disabled)[0]!.trigger("click");
    expect(disabled.emitted("update:expandedKeys")).toBeUndefined();
    disabled.unmount();

    const itemDisabled = mount(AccordionRoot, {
      slots: {
        default: () =>
          h(
            AccordionItem,
            {id: "locked", isDisabled: true},
            {
              default: () => h(AccordionTrigger, null, {default: () => "Locked"}),
            },
          ),
      },
    });

    expect(
      itemDisabled.get("[data-slot='accordion-trigger']").attributes("disabled"),
    ).toBeDefined();
    itemDisabled.unmount();
  });

  it("emits press and tracks hover, press, and focus-visible", async () => {
    const wrapper = renderAccordion({props: {expandedKeys: []}});
    const trigger = triggers(wrapper)[0]!;
    const triggerComponent = wrapper.findAllComponents(AccordionTrigger)[0]!;
    const element = trigger.element;

    element.dispatchEvent(
      new PointerEvent("pointerenter", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
    );
    await nextTick();
    expect(trigger.attributes("data-hovered")).toBe("true");

    element.dispatchEvent(
      new PointerEvent("pointerdown", {bubbles: true, button: 0, pointerId: 1}),
    );
    await nextTick();
    expect(trigger.attributes("data-pressed")).toBe("true");

    element.dispatchEvent(
      new PointerEvent("pointerup", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
    );
    await flushPromises();
    expect(triggerComponent.emitted("press")).toHaveLength(1);

    document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Tab"}));
    (element as HTMLElement).focus();
    await nextTick();
    expect(trigger.attributes("data-focus-visible")).toBe("true");

    wrapper.unmount();
  });

  it("moves focus between triggers with arrow keys", async () => {
    const wrapper = renderAccordion();
    const [first, second] = triggers(wrapper);

    (first!.element as HTMLElement).focus();
    first!.element.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "ArrowDown"}));
    await nextTick();

    expect(document.activeElement).toBe(second!.element);

    wrapper.unmount();
  });

  it("supports a controlled host with v-model semantics", async () => {
    const expanded = ref<string[]>([]);

    const host = defineComponent({
      setup() {
        return () =>
          h(
            AccordionRoot,
            {
              expandedKeys: expanded.value,
              "onUpdate:expandedKeys": (keys?: string[]) => {
                expanded.value = keys ?? [];
              },
            },
            {
              default: () =>
                h(
                  AccordionItem,
                  {id: "one"},
                  {
                    default: () => h(AccordionTrigger, null, {default: () => "One"}),
                  },
                ),
            },
          );
      },
    });
    const wrapper = mount(host, {attachTo: document.body});

    await wrapper.get("[data-slot='accordion-trigger']").trigger("click");
    await nextTick();

    expect(expanded.value).toEqual(["one"]);
    expect(wrapper.get("[data-slot='accordion-trigger']").attributes("aria-expanded")).toBe("true");

    wrapper.unmount();
  });
});
