import type {PressEvent} from "@sail-ui/primitives";
import {mount} from "@vue/test-utils";
import {describe, expect, it, vi} from "vitest";
import {h, nextTick} from "vue";

import PaginationContent from "../pagination-content.vue";
import PaginationEllipsis from "../pagination-ellipsis.vue";
import PaginationItem from "../pagination-item.vue";
import PaginationLink from "../pagination-link.vue";
import PaginationNextIcon from "../pagination-next-icon.vue";
import PaginationNext from "../pagination-next.vue";
import PaginationPreviousIcon from "../pagination-previous-icon.vue";
import PaginationPrevious from "../pagination-previous.vue";
import PaginationRoot from "../pagination-root.vue";
import PaginationSummary from "../pagination-summary.vue";

const pointer = (element: Element, type: string) => {
  element.dispatchEvent(
    new PointerEvent(type, {bubbles: true, pointerId: 1, pointerType: "mouse"}),
  );
};

interface RenderPageOptions {
  page?: number;
  rootProps?: Record<string, unknown>;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  onPress?: (event: PressEvent) => void;
}

function renderPage(options: RenderPageOptions = {}) {
  const page = options.page ?? 1;

  return mount(PaginationRoot, {
    attachTo: document.body,
    props: options.rootProps,
    slots: {
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
                    {isDisabled: options.previousDisabled, onPress: options.onPress},
                    {default: () => [h(PaginationPreviousIcon), h("span", null, "Previous")]},
                  ),
              },
            ),
            ...[1, 2, 3].map((value) =>
              h(
                PaginationItem,
                {key: value},
                {
                  default: () =>
                    h(
                      PaginationLink,
                      {isActive: value === page, onPress: options.onPress},
                      {default: () => String(value)},
                    ),
                },
              ),
            ),
            h(PaginationItem, {key: "ellipsis"}, {default: () => h(PaginationEllipsis)}),
            h(
              PaginationItem,
              {key: "next"},
              {
                default: () =>
                  h(
                    PaginationNext,
                    {isDisabled: options.nextDisabled, onPress: options.onPress},
                    {default: () => [h("span", null, "Next"), h(PaginationNextIcon)]},
                  ),
              },
            ),
          ],
        }),
      ],
    },
  });
}

describe("Pagination", () => {
  it("renders navigation semantics with the default label and md size", () => {
    const wrapper = renderPage();

    expect(wrapper.element.tagName).toBe("NAV");
    expect(wrapper.attributes("role")).toBe("navigation");
    expect(wrapper.attributes("aria-label")).toBe("pagination");
    expect(wrapper.attributes("data-slot")).toBe("pagination");
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["pagination", "pagination--md"]));
    wrapper.unmount();
  });

  it("accepts a custom label and size", () => {
    const wrapper = renderPage({
      rootProps: {size: "lg", "aria-label": "Results pages"},
    });

    expect(wrapper.attributes("aria-label")).toBe("Results pages");
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["pagination", "pagination--lg"]));
    expect(wrapper.classes()).not.toContain("pagination--md");
    wrapper.unmount();
  });

  it("renders the summary, list items, ellipsis, and icon parts", () => {
    const wrapper = renderPage();

    expect(wrapper.findAll("[data-slot='pagination-item']")).toHaveLength(6);
    expect(wrapper.findAll("[data-slot='pagination-content']")).toHaveLength(1);
    expect(wrapper.get("[data-slot='pagination-content']").element.tagName).toBe("UL");
    expect(wrapper.get("[data-slot='pagination-item']").element.tagName).toBe("LI");
    expect(wrapper.get("[data-slot='pagination-summary']").text()).toBe(
      "Showing 1-5 of 50 results",
    );
    expect(wrapper.findAll("[data-slot='pagination-previous-icon'] svg")).toHaveLength(1);
    expect(wrapper.findAll("[data-slot='pagination-next-icon'] svg")).toHaveLength(1);
    wrapper.unmount();
  });

  it("exposes aria-current and data-active only on the current page", () => {
    const wrapper = renderPage({page: 2});
    const links = wrapper.findAll("[data-slot='pagination-link']");

    expect(links).toHaveLength(3);
    expect(links[0]!.attributes("aria-current")).toBeUndefined();
    expect(links[0]!.attributes("data-active")).toBeUndefined();
    expect(links[1]!.attributes("aria-current")).toBe("page");
    expect(links[1]!.attributes("data-active")).toBe("true");
    expect(links[2]!.attributes("aria-current")).toBeUndefined();
    wrapper.unmount();
  });

  it("defaults the summary to dir=auto and accepts an explicit direction", () => {
    const auto = renderPage();
    const rtl = mount(PaginationRoot, {
      slots: {
        default: () => h(PaginationSummary, {dir: "rtl"}, {default: () => "1 to 5 of 50"}),
      },
    });

    expect(auto.get("[data-slot='pagination-summary']").attributes("dir")).toBe("auto");
    expect(rtl.get("[data-slot='pagination-summary']").attributes("dir")).toBe("rtl");

    auto.unmount();
    rtl.unmount();
  });

  it("hides the ellipsis from assistive technology", () => {
    const wrapper = renderPage();
    const ellipsis = wrapper.get("[data-slot='pagination-ellipsis']");

    expect(ellipsis.element.tagName).toBe("SPAN");
    expect(ellipsis.attributes("aria-hidden")).toBe("true");
    expect(ellipsis.text()).toBe("…");
    expect(ellipsis.attributes("tabindex")).toBeUndefined();
    expect(ellipsis.classes()).toContain("pagination__ellipsis");
    wrapper.unmount();
  });

  it("emits press once for pointer and keyboard activation", async () => {
    const onPress = vi.fn();
    const wrapper = renderPage({onPress});
    const link = wrapper.findAll("[data-slot='pagination-link']")[0]!;

    pointer(link.element, "pointerdown");
    await nextTick();
    expect(link.attributes("data-pressed")).toBe("true");

    pointer(link.element, "pointerup");
    await nextTick();
    expect(link.attributes("data-pressed")).toBeUndefined();
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress.mock.calls[0]![0]).toMatchObject({pointerType: "mouse"});

    await link.trigger("keydown", {key: "Enter"});
    await nextTick();
    expect(onPress).toHaveBeenCalledTimes(2);
    expect(onPress.mock.calls[1]![0]).toMatchObject({pointerType: "keyboard"});
    wrapper.unmount();
  });

  it("disables links natively and skips press events", async () => {
    const onPress = vi.fn();
    const wrapper = renderPage({nextDisabled: true, onPress});
    const next = wrapper.get("[data-slot='pagination-next']");

    expect(next.attributes("disabled")).toBeDefined();
    expect(next.attributes("data-disabled")).toBe("true");
    expect(next.attributes("aria-disabled")).toBeUndefined();

    pointer(next.element, "pointerdown");
    pointer(next.element, "pointerup");
    await next.trigger("keydown", {key: "Enter"});
    await nextTick();

    expect(onPress).not.toHaveBeenCalled();
    expect(next.attributes("data-pressed")).toBeUndefined();
    wrapper.unmount();
  });

  it("applies the nav modifier to previous and next buttons", () => {
    const wrapper = renderPage();
    const previous = wrapper.get("[data-slot='pagination-previous']");
    const next = wrapper.get("[data-slot='pagination-next']");

    for (const button of [previous, next]) {
      expect(button.classes()).toEqual(
        expect.arrayContaining(["pagination__link", "pagination__link--nav"]),
      );
    }

    expect(wrapper.get("[data-slot='pagination-link']").classes()).not.toContain(
      "pagination__link--nav",
    );
    wrapper.unmount();
  });

  it("tracks hover state on links", async () => {
    const wrapper = renderPage();
    const link = wrapper.findAll("[data-slot='pagination-link']")[0]!;

    link.element.dispatchEvent(new PointerEvent("pointerenter", {pointerType: "mouse"}));
    await nextTick();
    expect(link.attributes("data-hovered")).toBe("true");

    link.element.dispatchEvent(new PointerEvent("pointerleave", {pointerType: "mouse"}));
    await nextTick();
    expect(link.attributes("data-hovered")).toBeUndefined();
    wrapper.unmount();
  });

  it("replaces the default chevrons when the icon slot is provided", () => {
    const wrapper = mount(PaginationRoot, {
      slots: {
        default: () => [
          h(PaginationPrevious, null, {
            default: () =>
              h(PaginationPreviousIcon, null, {default: () => h("span", {class: "custom"})}),
          }),
          h(PaginationNext, null, {
            default: () =>
              h(PaginationNextIcon, null, {default: () => h("span", {class: "custom"})}),
          }),
        ],
      },
    });

    expect(wrapper.findAll(".custom")).toHaveLength(2);
    expect(wrapper.findAll("svg")).toHaveLength(0);
    expect(wrapper.get("[data-slot='pagination-previous-icon']").attributes("aria-hidden")).toBe(
      "true",
    );
    wrapper.unmount();
  });
});
