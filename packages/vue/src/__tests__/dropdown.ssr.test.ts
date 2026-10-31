import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {Dropdown, DropdownMenu, DropdownPopover, DropdownTrigger} from "../components/dropdown";
import {Label} from "../components/label";
import {MenuItem, MenuItemIndicator} from "../components/menu-item";

function createPage(defaultOpen = false) {
  return defineComponent({
    setup() {
      return () =>
        h(
          Dropdown,
          {defaultOpen},
          {
            default: () => [
              h(DropdownTrigger, null, {default: () => "Actions"}),
              h(DropdownPopover, null, {
                default: () =>
                  h(
                    DropdownMenu,
                    {selectionMode: "single"},
                    {
                      default: () => [
                        h(
                          MenuItem,
                          {textValue: "Edit", value: "edit"},
                          {
                            default: () => [
                              h(Label, null, {default: () => "Edit"}),
                              h(MenuItemIndicator),
                            ],
                          },
                        ),
                      ],
                    },
                  ),
              }),
            ],
          },
        );
    },
  });
}

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

describe("T06 dropdown SSR", () => {
  it("renders only the trigger shell while closed", async () => {
    const html = await renderSSR(createPage());
    const trigger = tagsOf(html, "dropdown-trigger")[0] ?? "";

    expect(trigger).toBeTruthy();
    expect(trigger).toContain("<button");
    expect(trigger).toContain('aria-haspopup="menu"');
    expect(trigger).toContain('aria-expanded="false"');
    expect(trigger).toContain("dropdown__trigger");
    expect(trigger).not.toContain("aria-controls");
    expect(trigger).not.toContain("data-state");

    expect(html).not.toContain('data-slot="dropdown-popover"');
    expect(html).not.toContain('data-slot="dropdown-menu"');
    expect(html).not.toContain('data-slot="menu-item"');
    expect(html).not.toContain('role="menu"');
    expect(html).not.toContain("data-selection-mode");
  });

  it("keeps the closed server output deterministic", async () => {
    const html = await renderSSR(createPage());

    expect(await renderSSR(createPage())).toBe(html);
    expect(tagsOf(html, "dropdown-trigger")).toHaveLength(1);
  });

  it("mounts an explicitly open menu without leaking portal markup", async () => {
    const html = await renderSSR(createPage(true));
    const trigger = tagsOf(html, "dropdown-trigger")[0] ?? "";

    expect(trigger).toContain('aria-expanded="true"');
    expect(trigger).toContain("aria-controls");
    // The popover lives in a teleport that SSR buffers outside the app HTML.
    expect(html).not.toContain('data-slot="dropdown-popover"');
    expect(html).not.toContain('role="menu"');
  });
});
