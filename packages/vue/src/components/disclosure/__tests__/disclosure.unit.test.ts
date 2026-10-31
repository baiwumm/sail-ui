import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import DisclosureBody from "../disclosure-body.vue";
import DisclosureContent from "../disclosure-content.vue";
import DisclosureHeading from "../disclosure-heading.vue";
import DisclosureIndicator from "../disclosure-indicator.vue";
import DisclosureRoot from "../disclosure-root.vue";
import DisclosureTrigger from "../disclosure-trigger.vue";
import DisclosureGroupRoot from "../../disclosure-group/disclosure-group.vue";

function renderDisclosure(props: Record<string, unknown> = {}) {
  return mount(DisclosureRoot, {
    attachTo: document.body,
    props,
    slots: {
      default: () => [
        h(DisclosureHeading, null, {
          default: () => [
            h(DisclosureTrigger, null, {
              default: () => [h("span", "Details"), h(DisclosureIndicator)],
            }),
          ],
        }),
        h(DisclosureContent, null, {
          default: () => h(DisclosureBody, null, {default: () => "Hidden content"}),
        }),
      ],
    },
  });
}

const triggerOf = (wrapper: ReturnType<typeof renderDisclosure>) =>
  wrapper.get("[data-slot='disclosure-trigger']");

afterEach(() => {
  document.body.replaceChildren();
});

describe("Disclosure", () => {
  it("renders every upstream part", () => {
    const wrapper = renderDisclosure();

    expect(wrapper.get("[data-slot='disclosure']").classes()).toContain("disclosure");
    expect(wrapper.get("[data-slot='disclosure-heading']").element.tagName).toBe("H3");
    expect(triggerOf(wrapper).attributes("aria-expanded")).toBe("false");
    expect(triggerOf(wrapper).attributes("aria-controls")).toBe(
      wrapper.get("[data-slot='disclosure-content']").attributes("id"),
    );
    expect(wrapper.get("[data-slot='disclosure-content']").attributes("hidden")).toBe(
      "until-found",
    );
    expect(wrapper.get("[data-slot='disclosure-content']").attributes("role")).toBe("group");
    expect(wrapper.get("[data-slot='disclosure-body']").text()).toBe("Hidden content");
    expect(
      wrapper.get("[data-slot='disclosure-indicator']").attributes("data-expanded"),
    ).toBeUndefined();

    wrapper.unmount();
  });

  it("toggles when the trigger is clicked", async () => {
    const wrapper = renderDisclosure();

    await triggerOf(wrapper).trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:open")?.[0]).toEqual([true]);
    expect(wrapper.get("[data-slot='disclosure']").attributes("data-expanded")).toBe("true");
    expect(triggerOf(wrapper).attributes("aria-expanded")).toBe("true");
    expect(wrapper.get("[data-slot='disclosure-content']").attributes("data-expanded")).toBe(
      "true",
    );
    expect(wrapper.get("[data-slot='disclosure-content']").attributes("hidden")).toBeUndefined();
    expect(wrapper.get("[data-slot='disclosure-indicator']").attributes("data-expanded")).toBe(
      "true",
    );

    await triggerOf(wrapper).trigger("click");
    await flushPromises();

    expect(wrapper.emitted("update:open")?.[1]).toEqual([false]);
    expect(wrapper.get("[data-slot='disclosure']").attributes("data-expanded")).toBeUndefined();
    expect(wrapper.get("[data-slot='disclosure-content']").attributes("data-expanded")).toBe(
      undefined,
    );

    wrapper.unmount();
  });

  it("starts expanded with defaultOpen", () => {
    const wrapper = renderDisclosure({defaultOpen: true});

    expect(triggerOf(wrapper).attributes("aria-expanded")).toBe("true");
    expect(wrapper.get("[data-slot='disclosure-content']").attributes("hidden")).toBeUndefined();

    wrapper.unmount();
  });

  it("respects controlled open", async () => {
    const open = ref(false);

    const host = defineComponent({
      setup() {
        return () =>
          h(
            DisclosureRoot,
            {
              open: open.value,
              "onUpdate:open": (value: boolean) => {
                open.value = value;
              },
            },
            {
              default: () => [
                h(DisclosureTrigger, null, {default: () => "Toggle"}),
                h(DisclosureContent, null, {default: () => "Body"}),
              ],
            },
          );
      },
    });
    const wrapper = mount(host, {attachTo: document.body});

    await wrapper.get("[data-slot='disclosure-trigger']").trigger("click");
    await nextTick();

    expect(open.value).toBe(true);
    expect(wrapper.get("[data-slot='disclosure-trigger']").attributes("aria-expanded")).toBe(
      "true",
    );

    wrapper.unmount();
  });

  it("does not toggle when disabled", async () => {
    const wrapper = renderDisclosure({isDisabled: true});

    expect(triggerOf(wrapper).attributes("disabled")).toBeDefined();
    expect(wrapper.get("[data-slot='disclosure']").attributes("data-disabled")).toBe("true");
    await triggerOf(wrapper).trigger("click");
    expect(wrapper.emitted("update:open")).toBeUndefined();

    wrapper.unmount();
  });

  it("hands control to an enclosing DisclosureGroup", async () => {
    const wrapper = mount(DisclosureGroupRoot, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(
            DisclosureRoot,
            {id: "first"},
            {
              default: () => [
                h(DisclosureTrigger, null, {default: () => "First"}),
                h(DisclosureContent, null, {default: () => "First body"}),
              ],
            },
          ),
          h(
            DisclosureRoot,
            {id: "second"},
            {
              default: () => [
                h(DisclosureTrigger, null, {default: () => "Second"}),
                h(DisclosureContent, null, {default: () => "Second body"}),
              ],
            },
          ),
        ],
      },
    });
    const triggers = wrapper.findAll("[data-slot='disclosure-trigger']");

    await triggers[0]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:expandedKeys")?.[0]).toEqual([["first"]]);
    expect(triggers[0]!.attributes("aria-expanded")).toBe("true");
    expect(triggers[1]!.attributes("aria-expanded")).toBe("false");

    await triggers[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:expandedKeys")?.[1]).toEqual([["second"]]);
    expect(triggers[0]!.attributes("aria-expanded")).toBe("false");
    expect(triggers[1]!.attributes("aria-expanded")).toBe("true");

    wrapper.unmount();
  });

  it("keeps multiple disclosures open when the group allows it", async () => {
    const wrapper = mount(DisclosureGroupRoot, {
      attachTo: document.body,
      props: {allowsMultipleExpanded: true},
      slots: {
        default: () => [
          h(
            DisclosureRoot,
            {id: "first"},
            {
              default: () => h(DisclosureTrigger, null, {default: () => "First"}),
            },
          ),
          h(
            DisclosureRoot,
            {id: "second"},
            {
              default: () => h(DisclosureTrigger, null, {default: () => "Second"}),
            },
          ),
        ],
      },
    });
    const triggers = wrapper.findAll("[data-slot='disclosure-trigger']");

    await triggers[0]!.trigger("click");
    await triggers[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:expandedKeys")?.[1]).toEqual([["first", "second"]]);
    expect(triggers[0]!.attributes("aria-expanded")).toBe("true");
    expect(triggers[1]!.attributes("aria-expanded")).toBe("true");

    wrapper.unmount();
  });
});
