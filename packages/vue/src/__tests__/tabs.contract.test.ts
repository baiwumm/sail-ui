import {readFileSync} from "node:fs";
import {join} from "node:path";

import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {
  Tab,
  TabIndicator,
  TabList,
  TabListContainer,
  TabPanel,
  TabSeparator,
  Tabs,
} from "../components/tabs";

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

const TabsHost = defineComponent({
  setup() {
    return () =>
      h(
        Tabs,
        {align: "start", defaultSelectedKey: "first", variant: "secondary"},
        {
          default: () => [
            h(TabListContainer, null, {
              default: () =>
                h(
                  TabList,
                  {"aria-label": "Contract"},
                  {
                    default: () => [
                      h(
                        Tab,
                        {value: "first"},
                        {
                          default: () => ["First", h(TabIndicator)],
                        },
                      ),
                      h(
                        Tab,
                        {value: "second"},
                        {
                          default: () => [h(TabSeparator), "Second", h(TabIndicator)],
                        },
                      ),
                      h(
                        Tab,
                        {isDisabled: true, value: "third"},
                        {
                          default: () => ["Third", h(TabIndicator)],
                        },
                      ),
                    ],
                  },
                ),
            }),
            h(TabPanel, {value: "first"}, {default: () => "First panel"}),
            h(TabPanel, {value: "second"}, {default: () => "Second panel"}),
            h(TabPanel, {value: "third"}, {default: () => "Third panel"}),
          ],
        },
      );
  },
});

afterEach(() => {
  document.body.replaceChildren();
});

describe("T06 tabs data-slot parity", () => {
  it("renders every upstream slot", async () => {
    const html = await renderSSR(TabsHost);

    expectUpstreamSlots(html, "tabs", ["scroll-shadow"]);
    expect(html).toContain("tabs--secondary");
    expect(html).toContain("tabs--align-start");
    expect(html).toContain('data-slot="tabs-list-container"');
  });
});

describe("T06 tabs state contract", () => {
  it("moves data-selected and the indicator with the selection", async () => {
    const wrapper = mount(TabsHost, {attachTo: document.body});
    const tabs = () => wrapper.findAll("[data-slot='tabs-tab']");
    const indicators = () => wrapper.findAll("[data-slot='tabs-indicator']");

    expect(tabs()[0]!.attributes("data-selected")).toBe("true");
    expect(tabs()[1]!.attributes("data-selected")).toBeUndefined();
    expect(indicators()).toHaveLength(1);
    expect(tabs()[0]!.find("[data-slot='tabs-indicator']").exists()).toBe(true);

    await tabs()[1]!.trigger("mousedown");
    await nextTick();

    expect(tabs()[0]!.attributes("data-selected")).toBeUndefined();
    expect(tabs()[1]!.attributes("data-selected")).toBe("true");
    expect(indicators()).toHaveLength(1);
    expect(tabs()[1]!.find("[data-slot='tabs-indicator']").exists()).toBe(true);
    expect(wrapper.get("[data-slot='tabs-panel']").text()).toBe("Second panel");

    wrapper.unmount();
  });

  it("reports disabled tabs through every attribute the CSS selects on", () => {
    const wrapper = mount(TabsHost, {attachTo: document.body});
    const disabled = wrapper.findAll("[data-slot='tabs-tab']")[2]!;

    expect(disabled.attributes("data-disabled")).toBe("true");
    expect(disabled.attributes("aria-disabled")).toBe("true");
    expect(disabled.attributes("aria-selected")).toBe("false");

    wrapper.unmount();
  });

  it("drives the chevron flags from the scroller dataset", async () => {
    const wrapper = mount(TabsHost, {attachTo: document.body});
    const scroller = wrapper.get("[data-slot='scroll-shadow']");

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    await nextTick();

    expect(scroller.attributes("data-left-scroll")).toBe("false");
    expect(scroller.attributes("data-right-scroll")).toBe("false");
    expect(scroller.attributes("data-top-bottom-scroll")).toBeUndefined();
    expect(scroller.classes()).toContain("tabs__list-container__scroller");

    wrapper.unmount();
  });
});
