import {readFileSync} from "node:fs";
import {join} from "node:path";

import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import {dataAttributesOfSlot, dataSlots, renderSSR} from "@sail-ui/testing";

import {
  Accordion,
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../components/accordion";
import {
  Disclosure,
  DisclosureBody,
  DisclosureContent,
  DisclosureHeading,
  DisclosureIndicator,
  DisclosureTrigger,
} from "../components/disclosure";
import {DisclosureGroup} from "../components/disclosure-group";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const uniqueSorted = (slots: string[]) => [...new Set(slots)].sort();

function expectUpstreamSlots(html: string, component: string, extras: string[] = []) {
  const expected = [...(slotSnapshot.components[component] ?? []), ...extras];

  expect(uniqueSorted(dataSlots(html)), `${component} data-slot parity`).toEqual(
    uniqueSorted(expected),
  );
}

const AccordionHost = defineComponent({
  setup() {
    return () =>
      h(
        Accordion,
        {variant: "surface", hideSeparator: true},
        {
          default: () => [
            h(
              AccordionItem,
              {id: "one"},
              {
                default: () => [
                  h(AccordionHeading, null, {
                    default: () =>
                      h(AccordionTrigger, null, {
                        default: () => ["One", h(AccordionIndicator)],
                      }),
                  }),
                  h(AccordionPanel, null, {
                    default: () => h(AccordionBody, null, {default: () => "Content"}),
                  }),
                ],
              },
            ),
          ],
        },
      );
  },
});

const DisclosureHost = defineComponent({
  setup() {
    return () =>
      h(
        DisclosureGroup,
        {defaultExpandedKeys: ["details"]},
        {
          default: () => [
            h(
              Disclosure,
              {id: "details"},
              {
                default: () => [
                  h(DisclosureHeading, null, {
                    default: () =>
                      h(DisclosureTrigger, null, {
                        default: () => ["Details", h(DisclosureIndicator)],
                      }),
                  }),
                  h(DisclosureContent, null, {
                    default: () => h(DisclosureBody, null, {default: () => "Content"}),
                  }),
                ],
              },
            ),
          ],
        },
      );
  },
});

afterEach(() => {
  document.body.replaceChildren();
});

describe("T06 collections data-slot parity", () => {
  it("Accordion renders every upstream slot", async () => {
    const html = await renderSSR(AccordionHost);

    expectUpstreamSlots(html, "accordion");
    expect(html).toContain("accordion--surface");
    expect(html).toContain('data-hide-separator="true"');
    expect(html).toMatch(/data-slot="accordion-panel"[^>]*hidden="until-found"/);
  });

  it("Disclosure and DisclosureGroup render their upstream slots", async () => {
    const html = await renderSSR(DisclosureHost);

    expectUpstreamSlots(html, "disclosure-group", [
      ...(slotSnapshot.components["disclosure"] ?? []),
    ]);
    expect(html).toContain("disclosure-group");
    expect(html).toContain('data-slot="disclosure"');
    expect(dataAttributesOfSlot(html, "disclosure")[0]).toHaveProperty("data-expanded", "true");
  });
});

describe("T06 collections state contract", () => {
  it("Accordion mirrors expansion into the attributes the CSS selects on", async () => {
    const wrapper = mount(AccordionHost, {attachTo: document.body});
    const trigger = wrapper.get("[data-slot='accordion-trigger']");

    expect(trigger.attributes("data-state")).toBe("closed");
    expect(wrapper.get("[data-slot='accordion-panel']").attributes("aria-hidden")).toBe("true");

    await trigger.trigger("click");
    await nextTick();

    expect(trigger.attributes("data-state")).toBe("open");
    expect(trigger.attributes("data-expanded")).toBeUndefined();
    expect(wrapper.get("[data-slot='accordion-item']").attributes("data-expanded")).toBe("true");
    expect(wrapper.get("[data-slot='accordion-panel']").attributes("data-expanded")).toBe("true");
    expect(wrapper.get("[data-slot='accordion-indicator']").attributes("data-expanded")).toBe(
      "true",
    );
    expect(wrapper.get("[data-slot='accordion-panel']").attributes("aria-hidden")).toBe("false");

    wrapper.unmount();
  });

  it("Disclosure reports disabled at both the group and the item", async () => {
    const group = mount(DisclosureGroup, {
      attachTo: document.body,
      props: {isDisabled: true},
      slots: {
        default: () =>
          h(
            Disclosure,
            {id: "details"},
            {
              default: () => [
                h(DisclosureTrigger, null, {default: () => "Details"}),
                h(DisclosureContent, null, {default: () => "Body"}),
              ],
            },
          ),
      },
    });

    expect(group.get("[data-slot='disclosure-group']").attributes("data-disabled")).toBe("true");
    expect(group.get("[data-slot='disclosure']").attributes("data-disabled")).toBe("true");
    expect(group.get("[data-slot='disclosure-trigger']").attributes("disabled")).toBeDefined();

    group.unmount();
  });

  it("DisclosureGroup keeps a single open item unless multiple expansion is allowed", async () => {
    const wrapper = mount(DisclosureHost, {attachTo: document.body});
    const trigger = wrapper.get("[data-slot='disclosure-trigger']");

    expect(trigger.attributes("aria-expanded")).toBe("true");

    await trigger.trigger("click");
    await nextTick();

    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.get("[data-slot='disclosure']").attributes("data-expanded")).toBeUndefined();

    wrapper.unmount();
  });
});
