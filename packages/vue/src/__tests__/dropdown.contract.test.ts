import {readFileSync} from "node:fs";
import {join} from "node:path";

import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {dataSlots} from "@sail-ui/testing";

import {Description} from "../components/description";
import {
  Dropdown,
  DropdownMenu,
  DropdownPopover,
  DropdownSubmenuTrigger,
  DropdownTrigger,
} from "../components/dropdown";
import {Header} from "../components/header";
import {Label} from "../components/label";
import {Menu} from "../components/menu";
import {MenuItem, MenuItemIndicator, MenuItemSubmenuIndicator} from "../components/menu-item";
import {MenuSection} from "../components/menu-section";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const uniqueSorted = (slots: string[]) => [...new Set(slots)].sort();

function expectUpstreamSlots(html: string, extras: string[] = []) {
  const expected = [
    ...(slotSnapshot.components["dropdown"] ?? []),
    ...(slotSnapshot.components["menu-item"] ?? []),
    ...extras,
  ];

  expect(uniqueSorted(dataSlots(html))).toEqual(uniqueSorted(expected));
}

const rootItems = () => [
  h(
    MenuItem,
    {key: "edit", textValue: "Edit", value: "edit"},
    {
      default: () => [
        h(Label, null, {default: () => "Edit"}),
        h(Description, null, {default: () => "Edit this item"}),
        h(MenuItemIndicator),
      ],
    },
  ),
  h(
    MenuItem,
    {key: "duplicate", textValue: "Duplicate", value: "duplicate"},
    {
      default: () => [
        h(Label, null, {default: () => "Duplicate"}),
        h(MenuItemIndicator, {type: "dot"}),
      ],
    },
  ),
  h(
    MenuItem,
    {key: "delete", textValue: "Delete", value: "delete", variant: "danger"},
    {default: () => [h(Label, null, {default: () => "Delete"}), h(MenuItemIndicator)]},
  ),
];

const sectionBlock = () =>
  h(
    MenuSection,
    {key: "share", selectionMode: "multiple"},
    {
      default: () => [
        h(Header, null, {default: () => "Share"}),
        h(
          MenuItem,
          {key: "email", textValue: "Email", value: "email"},
          {default: () => [h(Label, null, {default: () => "Email"}), h(MenuItemIndicator)]},
        ),
      ],
    },
  );

const submenuBlock = () =>
  h(
    DropdownSubmenuTrigger,
    {key: "social"},
    {
      default: () => [
        h(
          MenuItem,
          {textValue: "Social", value: "social"},
          {
            default: () => [h(Label, null, {default: () => "Social"}), h(MenuItemSubmenuIndicator)],
          },
        ),
        h(DropdownPopover, null, {
          default: () =>
            h(
              DropdownMenu,
              {selectionMode: "none"},
              {
                default: () => [
                  h(
                    MenuItem,
                    {key: "mastodon", textValue: "Mastodon", value: "mastodon"},
                    {default: () => h(Label, null, {default: () => "Mastodon"})},
                  ),
                ],
              },
            ),
        }),
      ],
    },
  );

const DropdownPage = defineComponent({
  setup() {
    return () =>
      h(
        Dropdown,
        {defaultOpen: true},
        {
          default: () => [
            h(DropdownTrigger, null, {default: () => "Actions"}),
            h(DropdownPopover, null, {
              default: () =>
                h(
                  DropdownMenu,
                  {defaultValue: "edit", selectionMode: "single"},
                  {
                    default: () => [...rootItems(), sectionBlock(), submenuBlock()],
                  },
                ),
            }),
          ],
        },
      );
  },
});

const MenuPage = defineComponent({
  setup() {
    return () =>
      h(
        Dropdown,
        {defaultOpen: true},
        {
          default: () => [
            h(DropdownTrigger, null, {default: () => "Actions"}),
            h(DropdownPopover, null, {
              default: () =>
                h(
                  Menu,
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

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="dropdown-trigger"]')!;
const popoverOf = () => document.querySelector<HTMLElement>('[data-slot="dropdown-popover"]')!;
const dropdownMenuOf = () => document.querySelector<HTMLElement>('[data-slot="dropdown-menu"]')!;
const itemsOf = () => Array.from(document.querySelectorAll<HTMLElement>('[data-slot="menu-item"]'));
const itemByText = (text: string) =>
  itemsOf().find((element) => element.textContent?.includes(text))!;
const submenuTriggerOf = () =>
  document.querySelector<HTMLElement>('[data-slot="dropdown-submenu-trigger"]')!;

async function mountPage(page: ReturnType<typeof defineComponent>) {
  const wrapper = mount(page, {attachTo: document.body});

  await flushPromises();
  await Promise.resolve();
  await flushPromises();

  return wrapper;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("T06 dropdown contract", () => {
  it("renders every upstream data-slot", async () => {
    const wrapper = await mountPage(DropdownPage);

    expect(dropdownMenuOf()).not.toBeNull();
    expectUpstreamSlots(document.body.innerHTML, ["label", "description", "header"]);

    wrapper.unmount();
  });

  it("keeps the upstream class and role vocabulary", async () => {
    const wrapper = await mountPage(DropdownPage);

    const trigger = triggerOf();
    const popover = popoverOf();
    const menu = dropdownMenuOf();

    expect(trigger.classList.contains("dropdown__trigger")).toBe(true);
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(menu.id);

    expect(popover.classList.contains("dropdown__popover")).toBe(true);
    expect(popover.getAttribute("role")).toBeNull();
    expect(popover.hasAttribute("data-state")).toBe(false);

    expect(menu.getAttribute("role")).toBe("menu");
    expect(menu.classList.contains("dropdown__menu")).toBe(true);
    expect(menu.getAttribute("data-selection-mode")).toBe("single");
    expect(menu.getAttribute("aria-labelledby")).toBe(trigger.id);

    const section = document.querySelector<HTMLElement>("section")!;
    const header = document.querySelector<HTMLElement>('[data-slot="header"]')!;

    expect(section.getAttribute("role")).toBe("group");
    expect(section.classList.contains("menu-section")).toBe(true);
    expect(section.hasAttribute("data-slot")).toBe(false);
    expect(section.getAttribute("aria-labelledby")).toBe(header.id);

    wrapper.unmount();
  });

  it("renders the upstream selection, disabled and submenu attributes", async () => {
    const wrapper = await mountPage(DropdownPage);

    const items = itemsOf();
    const edit = itemByText("Edit");
    const duplicate = itemByText("Duplicate");
    const remove = itemByText("Delete");
    const sectionItem = itemByText("Email");

    expect(items).toHaveLength(4);

    expect(edit.getAttribute("role")).toBe("menuitemradio");
    expect(edit.getAttribute("aria-checked")).toBe("true");
    expect(edit.getAttribute("data-selected")).toBe("true");
    expect(edit.getAttribute("data-selection-mode")).toBe("single");
    expect(edit.classList.contains("menu-item")).toBe(true);
    expect(edit.classList.contains("menu-item--default")).toBe(true);

    expect(duplicate.getAttribute("aria-checked")).toBe("false");
    expect(duplicate.hasAttribute("data-selected")).toBe(false);
    expect(remove.classList.contains("menu-item--danger")).toBe(true);

    expect(sectionItem.getAttribute("role")).toBe("menuitemcheckbox");
    expect(sectionItem.getAttribute("data-selection-mode")).toBe("multiple");
    expect(sectionItem.getAttribute("aria-checked")).toBe("false");

    for (const item of items) {
      expect(item.hasAttribute("data-state")).toBe(false);
      expect(item.hasAttribute("data-highlighted")).toBe(false);
      expect(item.hasAttribute("disabled")).toBe(false);
    }

    const submenuTrigger = submenuTriggerOf();

    expect(submenuTrigger.getAttribute("role")).toBe("menuitem");
    expect(submenuTrigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(submenuTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(submenuTrigger.hasAttribute("aria-controls")).toBe(false);
    expect(submenuTrigger.hasAttribute("aria-checked")).toBe(false);
    expect(submenuTrigger.getAttribute("data-has-submenu")).toBe("true");
    expect(submenuTrigger.querySelector('[data-slot="submenu-indicator"]')).not.toBeNull();

    wrapper.unmount();
  });

  it("wires labels and descriptions into the items", async () => {
    const wrapper = await mountPage(DropdownPage);

    const edit = itemByText("Edit");
    const label = edit.querySelector<HTMLElement>('[data-slot="label"]')!;
    const description = edit.querySelector<HTMLElement>('[data-slot="description"]')!;

    expect(label.tagName).toBe("SPAN");
    expect(edit.getAttribute("aria-labelledby")).toBe(label.id);
    expect(edit.getAttribute("aria-describedby")).toBe(description.id);

    wrapper.unmount();
  });

  it("renders the upstream indicator structure", async () => {
    const wrapper = await mountPage(DropdownPage);

    const edit = itemByText("Edit");
    const duplicate = itemByText("Duplicate");
    const editIndicator = edit.querySelector<HTMLElement>('[data-slot="menu-item-indicator"]')!;
    const dotIndicator = duplicate.querySelector<HTMLElement>('[data-slot="menu-item-indicator"]')!;
    const checkmark = editIndicator.querySelector<SVGElement>(
      '[data-slot="menu-item-indicator--checkmark"]',
    )!;

    expect(editIndicator.classList.contains("menu-item__indicator")).toBe(true);
    expect(editIndicator.getAttribute("data-type")).toBe("checkmark");
    expect(editIndicator.getAttribute("data-visible")).toBe("true");
    expect(editIndicator.getAttribute("aria-hidden")).toBe("true");
    expect(checkmark.getAttribute("stroke-dashoffset")).toBe("44");
    expect(checkmark.getAttribute("stroke-dasharray")).toBe("22");

    expect(dotIndicator.getAttribute("data-type")).toBe("dot");
    expect(dotIndicator.hasAttribute("data-visible")).toBe(false);
    expect(dotIndicator.querySelector('[data-slot="menu-item-indicator--dot"]')).not.toBeNull();

    wrapper.unmount();
  });

  it("renders the standalone Menu surface with the menu slot", async () => {
    const wrapper = await mountPage(MenuPage);

    const menu = document.querySelector<HTMLElement>('[data-slot="menu"]')!;

    expect(menu.getAttribute("role")).toBe("menu");
    expect(menu.classList.contains("menu")).toBe(true);
    expect(menu.querySelector('[data-slot="menu-item"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="dropdown-menu"]')).toBeNull();

    expect(uniqueSorted(dataSlots(document.body.innerHTML))).toEqual(
      uniqueSorted([
        "dropdown-popover",
        "dropdown-trigger",
        "label",
        "menu",
        "menu-item",
        "menu-item-indicator",
        "menu-item-indicator--checkmark",
      ]),
    );

    wrapper.unmount();
  });
});
