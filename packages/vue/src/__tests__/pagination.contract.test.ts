import {readFileSync} from "node:fs";
import {join} from "node:path";

import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationRoot,
  PaginationSummary,
} from "../components/pagination";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const uniqueSorted = (slots: string[]) => [...new Set(slots)].sort();

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(/<[a-z][^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => tag.includes(`data-slot="${slot}"`));

const tagOf = (html: string, slot: string) => tagsOf(html, slot)[0] ?? "";

const Page = defineComponent({
  setup() {
    return () =>
      h(
        PaginationRoot,
        {size: "lg"},
        {
          default: () => [
            h(PaginationSummary, null, {default: () => "Showing 1-5 of 50 results"}),
            h(PaginationContent, null, {
              default: () => [
                h(
                  PaginationItem,
                  {key: "previous"},
                  {
                    default: () =>
                      h(
                        PaginationPrevious,
                        {isDisabled: true},
                        {
                          default: () => [h(PaginationPreviousIcon), h("span", null, "Previous")],
                        },
                      ),
                  },
                ),
                h(
                  PaginationItem,
                  {key: 1},
                  {
                    default: () => h(PaginationLink, null, {default: () => "1"}),
                  },
                ),
                h(
                  PaginationItem,
                  {key: 2},
                  {
                    default: () => h(PaginationLink, {isActive: true}, {default: () => "2"}),
                  },
                ),
                h(
                  PaginationItem,
                  {key: 3},
                  {
                    default: () => h(PaginationLink, {isDisabled: true}, {default: () => "3"}),
                  },
                ),
                h(PaginationItem, {key: "ellipsis"}, {default: () => h(PaginationEllipsis)}),
                h(
                  PaginationItem,
                  {key: "next"},
                  {
                    default: () =>
                      h(PaginationNext, null, {
                        default: () => [h("span", null, "Next"), h(PaginationNextIcon)],
                      }),
                  },
                ),
              ],
            }),
          ],
        },
      );
  },
});

describe("T06 pagination data-slot parity", () => {
  it("renders every upstream slot", async () => {
    const html = await renderSSR(Page);

    expect(uniqueSorted(dataSlots(html)), "pagination data-slot parity").toEqual(
      uniqueSorted(slotSnapshot.components.pagination ?? []),
    );
  });

  it("matches the upstream element and class vocabulary", async () => {
    const html = await renderSSR(Page);
    const root = tagOf(html, "pagination");
    const summary = tagOf(html, "pagination-summary");
    const content = tagOf(html, "pagination-content");
    const items = tagsOf(html, "pagination-item");
    const links = tagsOf(html, "pagination-link");
    const previous = tagOf(html, "pagination-previous");
    const next = tagOf(html, "pagination-next");
    const ellipsis = tagOf(html, "pagination-ellipsis");

    expect(root.startsWith("<nav")).toBe(true);
    expect(root).toContain('role="navigation"');
    expect(root).toContain('aria-label="pagination"');
    expect(root).toContain("pagination--lg");
    expect(summary.startsWith("<div")).toBe(true);
    expect(summary).toContain("pagination__summary");
    expect(summary).toContain('dir="auto"');
    expect(content.startsWith("<ul")).toBe(true);
    expect(content).toContain("pagination__content");
    expect(items).toHaveLength(6);
    for (const item of items) {
      expect(item.startsWith("<li")).toBe(true);
      expect(item).toContain("pagination__item");
    }
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.startsWith("<button")).toBe(true);
      expect(link).toContain('type="button"');
      expect(link).toContain("pagination__link");
    }
    expect(previous).toContain("pagination__link--nav");
    expect(next).toContain("pagination__link--nav");
    expect(ellipsis).toContain("pagination__ellipsis");
    expect(ellipsis).toContain('aria-hidden="true"');
    expect(html.match(/pagination__link--nav/g)).toHaveLength(2);
  });

  it("moves aria-current, data-active, and the disabled contract", async () => {
    const html = await renderSSR(Page);
    const links = tagsOf(html, "pagination-link");
    const previous = tagOf(html, "pagination-previous");

    expect(links[0]).not.toContain("aria-current");
    expect(links[0]).not.toContain("data-active");
    expect(links[1]).toContain('aria-current="page"');
    expect(links[1]).toContain('data-active="true"');
    expect(links[2]).toContain('data-disabled="true"');
    expect(links[2]).toMatch(/\sdisabled(\s|>)/);
    expect(links[2]).not.toContain("aria-disabled");
    expect(previous).toContain('data-disabled="true"');
    expect(previous).toMatch(/\sdisabled(\s|>)/);
    expect(tagOf(html, "pagination-next")).not.toContain('data-disabled="true"');
  });
});

describe("T06 pagination variants and overrides", () => {
  const sizePage = (size: "sm" | "md" | "lg") =>
    defineComponent({
      setup() {
        return () =>
          h(
            PaginationRoot,
            {size},
            {
              default: () => h(PaginationEllipsis),
            },
          );
      },
    });

  it("applies the size modifier classes", async () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const html = await renderSSR(sizePage(size));

      expect(tagOf(html, "pagination")).toContain(`pagination--${size}`);
    }
  });

  it("keeps a custom aria-label and summary dir", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            PaginationRoot,
            {"aria-label": "Search results"},
            {
              default: () => h(PaginationSummary, {dir: "rtl"}, {default: () => "1 to 10 of 120"}),
            },
          );
      },
    });
    const html = await renderSSR(host);

    expect(tagOf(html, "pagination")).toContain('aria-label="Search results"');
    expect(tagOf(html, "pagination-summary")).toContain('dir="rtl"');
    expect(tagOf(html, "pagination-summary")).not.toContain('dir="auto"');
  });

  it("renders the default chevrons inside the icon slots", async () => {
    const html = await renderSSR(Page);
    const previousIcon = tagOf(html, "pagination-previous-icon");
    const nextIcon = tagOf(html, "pagination-next-icon");

    expect(previousIcon.startsWith("<span")).toBe(true);
    expect(previousIcon).toContain('aria-hidden="true"');
    expect(nextIcon.startsWith("<span")).toBe(true);
    expect(nextIcon).toContain('aria-hidden="true"');
    expect(html.match(/<svg/g)).toHaveLength(2);
  });
});
