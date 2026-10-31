import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {
  Tab,
  TabIndicator,
  TabList,
  TabListContainer,
  TabPanel,
  TabSeparator,
  Tabs,
} from "../components/tabs";

const TabsPage = defineComponent({
  setup() {
    return () =>
      h(
        Tabs,
        {defaultSelectedKey: "overview", variant: "secondary"},
        {
          default: () => [
            h(TabListContainer, null, {
              default: () =>
                h(
                  TabList,
                  {"aria-label": "Sections"},
                  {
                    default: () => [
                      h(
                        Tab,
                        {value: "overview"},
                        {
                          default: () => ["Overview", h(TabIndicator)],
                        },
                      ),
                      h(
                        Tab,
                        {value: "analytics"},
                        {
                          default: () => [h(TabSeparator), "Analytics", h(TabIndicator)],
                        },
                      ),
                    ],
                  },
                ),
            }),
            h(TabPanel, {value: "overview"}, {default: () => "Overview content"}),
            h(TabPanel, {value: "analytics"}, {default: () => "Analytics content"}),
          ],
        },
      );
  },
});

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

const idOf = (tag: string) => /id="([^"]+)"/.exec(tag)?.[1];

describe("T06 tabs SSR", () => {
  it("renders every upstream slot", async () => {
    const html = await renderSSR(TabsPage);

    for (const slot of [
      "tabs",
      "tabs-list-container",
      "scroll-shadow",
      "tabs-list",
      "tabs-tab",
      "tabs-indicator",
      "tabs-separator",
      "tabs-panel",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html.match(/role="tab"/g)).toHaveLength(2);
    expect(html.match(/role="tabpanel"/g)).toHaveLength(1);
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-selected="false"');
    expect(html).toContain("Overview content");
    expect(html).not.toContain("Analytics content");
    expect(html).toContain('data-animation-ready="false"');
    expect(html).toContain("tabs--secondary");
  });

  it("wires tab ids to their panels", async () => {
    const html = await renderSSR(TabsPage);
    const tabTags = tagsOf(html, "tabs-tab");
    const overviewTriggerId = idOf(tabTags[0] ?? "") ?? "";
    const analyticsTriggerId = idOf(tabTags[1] ?? "") ?? "";
    const base = overviewTriggerId.split("-trigger-")[0];

    expect(overviewTriggerId).toBe(`${base}-trigger-overview`);
    expect(tabTags[0]).toContain(`aria-controls="${base}-content-overview"`);
    expect(tabTags[1]).toContain(`aria-controls="${base}-content-analytics"`);
    expect(tagsOf(html, "tabs-panel")[0]).toContain(`id="${base}-content-overview"`);
    expect(tagsOf(html, "tabs-panel")[0]).toContain(`aria-labelledby="${overviewTriggerId}"`);
    expect(analyticsTriggerId).toBe(`${base}-trigger-analytics`);
  });

  it("uses its own deterministic ids instead of Reka collection ids", async () => {
    const html = await renderSSR(TabsPage);

    expect(html).not.toContain("reka-tabs");
    expect(await renderSSR(TabsPage)).toBe(html);
  });
});
