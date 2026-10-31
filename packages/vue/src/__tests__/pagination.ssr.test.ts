import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

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

function createPage() {
  return defineComponent({
    setup() {
      return () =>
        h(
          PaginationRoot,
          {size: "sm"},
          {
            default: () => [
              h(PaginationSummary, null, {default: () => "1 to 5 of 50"}),
              h(PaginationContent, null, {
                default: () => [
                  h(PaginationItem, null, {
                    default: () =>
                      h(
                        PaginationPrevious,
                        {isDisabled: true},
                        {
                          default: () => [h(PaginationPreviousIcon), h("span", null, "Prev")],
                        },
                      ),
                  }),
                  h(PaginationItem, null, {
                    default: () => h(PaginationLink, {isActive: true}, {default: () => "1"}),
                  }),
                  h(PaginationItem, null, {
                    default: () => h(PaginationLink, null, {default: () => "2"}),
                  }),
                  h(PaginationItem, null, {default: () => h(PaginationEllipsis)}),
                  h(PaginationItem, null, {
                    default: () =>
                      h(PaginationNext, null, {
                        default: () => [h("span", null, "Next"), h(PaginationNextIcon)],
                      }),
                  }),
                ],
              }),
            ],
          },
        );
    },
  });
}

describe("T06 pagination SSR", () => {
  it("renders every part on the server", async () => {
    const html = await renderSSR(createPage());

    expect(html).toContain('data-slot="pagination"');
    expect(html).toContain('data-slot="pagination-summary"');
    expect(html).toContain('data-slot="pagination-content"');
    expect(html.match(/data-slot="pagination-item"/g)).toHaveLength(5);
    expect(html.match(/data-slot="pagination-link"/g)).toHaveLength(2);
    expect(html).toContain('data-slot="pagination-previous"');
    expect(html).toContain('data-slot="pagination-next"');
    expect(html).toContain('data-slot="pagination-ellipsis"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("pagination--sm");
    expect(html).toContain('dir="auto"');
  });

  it("keeps the server output deterministic", async () => {
    expect(await renderSSR(createPage())).toBe(await renderSSR(createPage()));
  });

  it("does not emit interaction-only attributes before hydration", async () => {
    const html = await renderSSR(createPage());

    expect(html).not.toContain("data-hovered");
    expect(html).not.toContain("data-pressed");
    expect(html).not.toContain("data-focused");
    expect(html).not.toContain("data-focus-visible");
  });
});
