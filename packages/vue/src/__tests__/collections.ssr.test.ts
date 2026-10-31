import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

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

const AccordionPage = defineComponent({
  setup() {
    return () =>
      h(
        Accordion,
        {defaultExpandedKeys: ["install"]},
        {
          default: () => [
            h(
              AccordionItem,
              {id: "install"},
              {
                default: () => [
                  h(AccordionHeading, null, {
                    default: () =>
                      h(AccordionTrigger, null, {
                        default: () => ["Install", h(AccordionIndicator)],
                      }),
                  }),
                  h(AccordionPanel, null, {
                    default: () => h(AccordionBody, null, {default: () => "pnpm add @sail-ui/vue"}),
                  }),
                ],
              },
            ),
            h(
              AccordionItem,
              {id: "usage"},
              {
                default: () => [
                  h(AccordionHeading, null, {
                    default: () =>
                      h(AccordionTrigger, null, {
                        default: () => ["Usage", h(AccordionIndicator)],
                      }),
                  }),
                  h(AccordionPanel, null, {
                    default: () => h(AccordionBody, null, {default: () => "Import the component"}),
                  }),
                ],
              },
            ),
          ],
        },
      );
  },
});

const DisclosurePage = defineComponent({
  setup() {
    return () =>
      h(
        Disclosure,
        {defaultOpen: true},
        {
          default: () => [
            h(DisclosureHeading, null, {
              default: () =>
                h(DisclosureTrigger, null, {
                  default: () => ["Details", h(DisclosureIndicator)],
                }),
            }),
            h(DisclosureContent, null, {
              default: () => h(DisclosureBody, null, {default: () => "Rich content"}),
            }),
          ],
        },
      );
  },
});

const DisclosureGroupPage = defineComponent({
  setup() {
    return () =>
      h(
        DisclosureGroup,
        {defaultExpandedKeys: ["first"]},
        {
          default: () => [
            h(
              Disclosure,
              {id: "first"},
              {
                default: () => [
                  h(DisclosureTrigger, null, {default: () => "First"}),
                  h(DisclosureContent, null, {default: () => "First body"}),
                ],
              },
            ),
            h(
              Disclosure,
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
      );
  },
});

describe("T06 collections SSR", () => {
  it("renders every accordion slot with upstream state attributes", async () => {
    const html = await renderSSR(AccordionPage);

    for (const slot of [
      "accordion",
      "accordion-item",
      "accordion-heading",
      "accordion-trigger",
      "accordion-indicator",
      "accordion-panel",
      "accordion-body",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-expanded="false"');
    expect(html.match(/role="group"/g)).toHaveLength(2);
    expect(html).toContain('hidden="until-found"');
  });

  it("wires trigger ids to their panels", async () => {
    const html = await renderSSR(AccordionPage);

    const tagOf = (slot: string) => new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`).exec(html)?.[0];
    const triggerId = /id="([^"]+)"/.exec(tagOf("accordion-trigger") ?? "")?.[1];
    const panelId = /id="([^"]+)"/.exec(tagOf("accordion-panel") ?? "")?.[1];

    expect(triggerId).toBeTruthy();
    expect(panelId).toBeTruthy();
    expect(html).toContain(`aria-controls="${panelId}"`);
    expect(html).toContain(`aria-labelledby="${triggerId}"`);
  });

  it("renders disclosure and disclosure-group on the server", async () => {
    const disclosure = await renderSSR(DisclosurePage);

    for (const slot of [
      "disclosure",
      "disclosure-heading",
      "disclosure-trigger",
      "disclosure-indicator",
      "disclosure-content",
      "disclosure-body",
    ]) {
      expect(disclosure, slot).toContain(`data-slot="${slot}"`);
    }

    expect(disclosure).toContain('aria-expanded="true"');
    expect(disclosure).not.toContain("until-found");

    const group = await renderSSR(DisclosureGroupPage);

    expect(group).toContain('data-slot="disclosure-group"');
    expect(group.match(/data-slot="disclosure"/g)).toHaveLength(2);
    expect(group).toContain('aria-expanded="true"');
    expect(group).toContain('aria-expanded="false"');
    expect(group).toContain('hidden="until-found"');
  });

  it("is deterministic across renders", async () => {
    for (const page of [AccordionPage, DisclosurePage, DisclosureGroupPage]) {
      expect(await renderSSR(page)).toBe(await renderSSR(page));
    }
  });
});
