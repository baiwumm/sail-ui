import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, describe, expect, it, vi} from "vitest";
import {defineComponent, ref} from "vue";

import {Header} from "../../header";
import {Label} from "../../label";
import {
  Dropdown,
  DropdownMenu,
  DropdownPopover,
  DropdownSubmenuTrigger,
  DropdownTrigger,
} from "../index";
import {MenuItem, MenuItemIndicator, MenuItemSubmenuIndicator} from "../../menu-item";
import {MenuSection} from "../../menu-section";

const baseItems = [
  {value: "edit", label: "Edit"},
  {value: "duplicate", label: "Duplicate"},
  {value: "delete", label: "Delete", isDisabled: true},
];

interface HostOptions {
  current?: string;
  defaultOpen?: boolean;
  defaultValue?: unknown;
  disabledKeys?: string[];
  selectionMode?: string;
  shouldCloseOnSelect?: boolean;
}

function createHost(options: HostOptions = {}) {
  return defineComponent({
    components: {
      Dropdown,
      DropdownMenu,
      DropdownPopover,
      DropdownTrigger,
      Label,
      MenuItem,
      MenuItemIndicator,
    },
    setup() {
      return {
        action: vi.fn(),
        current: options.current ?? "edit",
        defaultOpen: options.defaultOpen ?? false,
        defaultValue: options.defaultValue,
        disabledKeys: options.disabledKeys ?? [],
        items: baseItems,
        openChange: vi.fn(),
        selection: vi.fn(),
        selectionMode: options.selectionMode ?? "single",
        shouldCloseOnSelect: options.shouldCloseOnSelect,
      };
    },
    template: `
      <Dropdown :default-open="defaultOpen" @update:open="openChange">
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownPopover>
          <DropdownMenu
            :default-value="defaultValue"
            :disabled-keys="disabledKeys"
            :selection-mode="selectionMode"
            :should-close-on-select="shouldCloseOnSelect"
            @action="action"
            @selection-change="selection"
          >
            <MenuItem
              v-for="item in items"
              :key="item.value"
              :is-disabled="item.isDisabled"
              :text-value="item.label"
              :value="item.value"
            >
              <Label>{{ item.label }}</Label>
              <MenuItemIndicator />
            </MenuItem>
          </DropdownMenu>
        </DropdownPopover>
      </Dropdown>
    `,
  });
}

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="dropdown-trigger"]');
const popoversOf = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-slot="dropdown-popover"]'));
const menuOf = () => document.querySelector<HTMLElement>('[data-slot="dropdown-menu"]');
const itemsOf = () => Array.from(document.querySelectorAll<HTMLElement>('[data-slot="menu-item"]'));
const itemByText = (text: string) =>
  itemsOf().find((element) => element.textContent?.includes(text));

function pointer(target: Element, type: string) {
  target.dispatchEvent(new PointerEvent(type, {bubbles: true, pointerId: 1, pointerType: "mouse"}));
}

function keydown(target: EventTarget, key: string) {
  target.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key}));
}

async function openMenu() {
  triggerOf()!.click();

  await vi.waitFor(() => {
    expect(popoversOf()).toHaveLength(1);
    expect(menuOf()).not.toBeNull();
  });
}

async function waitClosed(count = 0) {
  await vi.waitFor(() => {
    expect(popoversOf()).toHaveLength(count);
  });
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("Dropdown", () => {
  it("renders the trigger without popover DOM while closed", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    const trigger = triggerOf()!;

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.getAttribute("data-slot")).toBe("dropdown-trigger");
    expect(trigger.classList.contains("dropdown__trigger")).toBe(true);
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(trigger.hasAttribute("data-state")).toBe(false);
    expect(trigger.hasAttribute("data-disabled")).toBe(false);
    expect(popoversOf()).toHaveLength(0);
    expect(menuOf()).toBeNull();

    wrapper.unmount();
  });

  it("opens a popover wrapper around the role=menu surface", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openMenu();

    const trigger = triggerOf()!;
    const popover = popoversOf()[0]!;
    const menu = menuOf()!;

    expect(popover.classList.contains("dropdown__popover")).toBe(true);
    expect(popover.getAttribute("role")).toBeNull();
    expect(popover.getAttribute("data-state")).toBeNull();
    expect(popover.getAttribute("data-slot")).toBe("dropdown-popover");
    expect(menu.getAttribute("role")).toBe("menu");
    expect(menu.classList.contains("dropdown__menu")).toBe(true);
    expect(menu.id).toBeTruthy();
    expect(menu.getAttribute("aria-labelledby")).toBe(trigger.id);

    await vi.waitFor(() => {
      expect(popover.getAttribute("data-placement")).toBe("bottom");
    });

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(menu.id);
    expect(popover.contains(menu)).toBe(true);

    wrapper.unmount();
  });

  it("renders single-selection items with checkmark state and wiring", async () => {
    const wrapper = mount(createHost({defaultValue: "edit"}), {
      attachTo: document.body,
    });
    await flushPromises();
    await openMenu();

    const menu = menuOf()!;
    const items = itemsOf();
    const labels = document.querySelectorAll<HTMLElement>('[data-slot="label"]');

    expect(items).toHaveLength(3);

    for (const item of items) {
      expect(item.getAttribute("role")).toBe("menuitemradio");
      expect(item.getAttribute("data-slot")).toBe("menu-item");
      expect(item.getAttribute("data-selection-mode")).toBe("single");
      expect(item.hasAttribute("data-state")).toBe(false);
      expect(item.hasAttribute("data-highlighted")).toBe(false);
      expect(item.hasAttribute("disabled")).toBe(false);
      expect(menu.contains(item)).toBe(true);
    }

    expect(items[0]!.getAttribute("aria-checked")).toBe("true");
    expect(items[0]!.getAttribute("data-selected")).toBe("true");
    expect(items[0]!.getAttribute("aria-labelledby")).toBe(labels[0]!.id);
    expect(items[1]!.getAttribute("aria-checked")).toBe("false");
    expect(items[1]!.hasAttribute("data-selected")).toBe(false);

    const indicators = document.querySelectorAll<HTMLElement>('[data-slot="menu-item-indicator"]');

    expect(indicators[0]!.getAttribute("data-visible")).toBe("true");
    expect(indicators[0]!.getAttribute("data-type")).toBe("checkmark");
    expect(indicators[1]!.hasAttribute("data-visible")).toBe(false);

    wrapper.unmount();
  });

  it("emits action and selection, then closes on a single select", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openMenu();

    itemByText("Duplicate")!.click();

    await vi.waitFor(() => {
      expect(popoversOf()).toHaveLength(0);
    });

    const vm = wrapper.vm as unknown as {
      action: ReturnType<typeof vi.fn>;
      selection: ReturnType<typeof vi.fn>;
    };

    expect(vm.action).toHaveBeenCalledWith("duplicate");
    expect(vm.selection).toHaveBeenCalledWith("duplicate");

    wrapper.unmount();
  });

  it("keeps a multiple menu open and toggles values", async () => {
    const wrapper = mount(createHost({defaultValue: [], selectionMode: "multiple"}), {
      attachTo: document.body,
    });
    await flushPromises();
    await openMenu();

    expect(itemsOf()[0]!.getAttribute("role")).toBe("menuitemcheckbox");
    expect(itemsOf()[0]!.getAttribute("data-selection-mode")).toBe("multiple");
    expect(menuOf()!.hasAttribute("data-selection-mode")).toBe(true);

    itemByText("Edit")!.click();
    await vi.waitFor(() => {
      expect(itemsOf()[0]!.getAttribute("aria-checked")).toBe("true");
    });

    itemByText("Duplicate")!.click();
    await vi.waitFor(() => {
      expect(itemsOf()[1]!.getAttribute("aria-checked")).toBe("true");
    });

    expect(popoversOf()).toHaveLength(1);

    const vm = wrapper.vm as unknown as {selection: ReturnType<typeof vi.fn>};

    expect(vm.selection).toHaveBeenLastCalledWith(["edit", "duplicate"]);

    itemByText("Edit")!.click();
    await vi.waitFor(() => {
      expect(itemsOf()[0]!.getAttribute("aria-checked")).toBe("false");
    });
    expect(vm.selection).toHaveBeenLastCalledWith(["duplicate"]);

    wrapper.unmount();
  });

  it("honors disabledKeys and the item isDisabled prop", async () => {
    const wrapper = mount(createHost({disabledKeys: ["duplicate"]}), {
      attachTo: document.body,
    });
    await flushPromises();
    await openMenu();

    const duplicate = itemByText("Duplicate")!;
    const remove = itemByText("Delete")!;

    expect(duplicate.getAttribute("aria-disabled")).toBe("true");
    expect(duplicate.getAttribute("data-disabled")).toBe("true");
    expect(remove.getAttribute("aria-disabled")).toBe("true");
    expect(remove.getAttribute("data-disabled")).toBe("true");

    duplicate.click();
    remove.click();
    await flushPromises();

    const vm = wrapper.vm as unknown as {
      action: ReturnType<typeof vi.fn>;
      selection: ReturnType<typeof vi.fn>;
    };

    expect(vm.action).not.toHaveBeenCalled();
    expect(vm.selection).not.toHaveBeenCalled();
    expect(popoversOf()).toHaveLength(1);

    wrapper.unmount();
  });

  it("closes on Escape and reports the open change", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openMenu();

    const vm = wrapper.vm as unknown as {openChange: ReturnType<typeof vi.fn>};

    keydown(document, "Escape");
    await waitClosed();

    expect(vm.openChange).toHaveBeenCalledWith(false);

    wrapper.unmount();
  });

  it("reflects hover and press state attributes", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openMenu();

    const item = itemByText("Edit")!;

    pointer(item, "pointerenter");
    await vi.waitFor(() => {
      expect(item.getAttribute("data-hovered")).toBe("true");
    });

    pointer(item, "pointerdown");
    await vi.waitFor(() => {
      expect(item.getAttribute("data-pressed")).toBe("true");
    });

    pointer(item, "pointerup");
    await vi.waitFor(() => {
      expect(item.hasAttribute("data-pressed")).toBe(false);
    });

    pointer(item, "pointerleave");
    await vi.waitFor(() => {
      expect(item.hasAttribute("data-hovered")).toBe(false);
    });

    keydown(document.body, "Tab");
    item.focus();
    await vi.waitFor(() => {
      expect(item.getAttribute("data-focused")).toBe("true");
      expect(item.getAttribute("data-focus-visible")).toBe("true");
    });

    wrapper.unmount();
  });

  it("moves focus with the keyboard and selects with Enter", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    keydown(triggerOf()!, "ArrowDown");
    await vi.waitFor(() => {
      expect(menuOf()).not.toBeNull();
    });

    const items = itemsOf();

    await vi.waitFor(() => {
      expect(document.activeElement).toBe(items[0]);
    });

    keydown(document.activeElement ?? document.body, "ArrowDown");
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(items[1]);
    });

    keydown(items[1]!, "Enter");
    await waitClosed();

    expect(
      (wrapper.vm as unknown as {selection: ReturnType<typeof vi.fn>}).selection,
    ).toHaveBeenCalledWith("duplicate");

    wrapper.unmount();
  });

  it("supports v-model:open from the host", async () => {
    const isOpen = ref(false);
    const Host = defineComponent({
      components: {Dropdown, DropdownMenu, DropdownPopover, DropdownTrigger, Label, MenuItem},
      setup() {
        return {isOpen};
      },
      template: `
        <Dropdown v-model:open="isOpen">
          <DropdownTrigger>Actions</DropdownTrigger>
          <DropdownPopover>
            <DropdownMenu selection-mode="none">
              <MenuItem text-value="Edit" value="edit"><Label>Edit</Label></MenuItem>
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>
      `,
    });

    const wrapper = mount(Host, {attachTo: document.body});
    await flushPromises();

    expect(triggerOf()!.getAttribute("aria-expanded")).toBe("false");

    isOpen.value = true;

    await vi.waitFor(() => {
      expect(popoversOf()).toHaveLength(1);
    });
    expect(triggerOf()!.getAttribute("aria-expanded")).toBe("true");

    keydown(document, "Escape");
    await waitClosed();

    expect(isOpen.value).toBe(false);

    wrapper.unmount();
  });

  it("submenus open a nested popover and close the root on selection", async () => {
    const action = vi.fn();
    const Host = defineComponent({
      components: {
        Dropdown,
        DropdownMenu,
        DropdownPopover,
        DropdownSubmenuTrigger,
        DropdownTrigger,
        Label,
        MenuItem,
        MenuItemSubmenuIndicator,
      },
      setup() {
        return {action};
      },
      template: `
        <Dropdown default-open>
          <DropdownTrigger>Actions</DropdownTrigger>
          <DropdownPopover>
            <DropdownMenu selection-mode="none">
              <MenuItem text-value="Edit" value="edit"><Label>Edit</Label></MenuItem>
              <DropdownSubmenuTrigger>
                <MenuItem text-value="Share" value="share">
                  <Label>Share</Label>
                  <MenuItemSubmenuIndicator />
                </MenuItem>
                <DropdownPopover>
                  <DropdownMenu selection-mode="none" @action="action">
                    <MenuItem text-value="Email" value="email"><Label>Email</Label></MenuItem>
                    <MenuItem text-value="Copy link" value="copy"><Label>Copy link</Label></MenuItem>
                  </DropdownMenu>
                </DropdownPopover>
              </DropdownSubmenuTrigger>
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>
      `,
    });

    const wrapper = mount(Host, {attachTo: document.body});

    await vi.waitFor(() => {
      expect(menuOf()).not.toBeNull();
    });

    const submenuTrigger = document.querySelector<HTMLElement>(
      '[data-slot="dropdown-submenu-trigger"]',
    )!;

    expect(submenuTrigger.getAttribute("role")).toBe("menuitem");
    expect(submenuTrigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(submenuTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(submenuTrigger.hasAttribute("aria-controls")).toBe(false);
    expect(submenuTrigger.getAttribute("data-has-submenu")).toBe("true");
    expect(submenuTrigger.querySelector('[data-slot="submenu-indicator"]')).not.toBeNull();
    expect(popoversOf()).toHaveLength(1);

    submenuTrigger.click();

    await vi.waitFor(() => {
      expect(popoversOf()).toHaveLength(2);
    });

    const submenuMenu = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="dropdown-menu"]'),
    ).find((element) => element.textContent?.includes("Copy link"))!;

    expect(submenuTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(submenuTrigger.getAttribute("aria-controls")).toBe(submenuMenu.id);
    expect(submenuTrigger.getAttribute("data-open")).toBe("true");
    expect(submenuMenu.getAttribute("aria-labelledby")).toBe(submenuTrigger.id);

    itemByText("Email")!.click();

    await waitClosed();

    expect(action).toHaveBeenCalledWith("email");

    wrapper.unmount();
  });

  it("sections can override the selection mode and stay open", async () => {
    const rootSelection = vi.fn();
    const sectionSelection = vi.fn();
    const Host = defineComponent({
      components: {
        Dropdown,
        DropdownMenu,
        DropdownPopover,
        DropdownTrigger,
        Header,
        Label,
        MenuItem,
        MenuItemIndicator,
        MenuSection,
      },
      setup() {
        return {rootSelection, sectionSelection};
      },
      template: `
        <Dropdown default-open>
          <DropdownTrigger>Actions</DropdownTrigger>
          <DropdownPopover>
            <DropdownMenu
              default-value="edit"
              selection-mode="single"
              @selection-change="rootSelection"
            >
              <MenuItem text-value="Edit" value="edit">
                <Label>Edit</Label>
                <MenuItemIndicator />
              </MenuItem>
              <MenuSection
                selection-mode="multiple"
                @selection-change="sectionSelection"
              >
                <Header>Share</Header>
                <MenuItem text-value="Email" value="email">
                  <Label>Email</Label>
                  <MenuItemIndicator />
                </MenuItem>
                <MenuItem text-value="Copy link" value="copy">
                  <Label>Copy link</Label>
                  <MenuItemIndicator />
                </MenuItem>
              </MenuSection>
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>
      `,
    });

    const wrapper = mount(Host, {attachTo: document.body});

    await vi.waitFor(() => {
      expect(menuOf()).not.toBeNull();
    });

    const section = document.querySelector<HTMLElement>("section")!;
    const header = document.querySelector<HTMLElement>('[data-slot="header"]')!;
    const items = itemsOf();

    expect(section.getAttribute("role")).toBe("group");
    expect(section.classList.contains("menu-section")).toBe(true);
    expect(section.hasAttribute("data-slot")).toBe(false);
    expect(section.getAttribute("aria-labelledby")).toBe(header.id);

    expect(items[0]!.getAttribute("data-selection-mode")).toBe("single");
    expect(items[1]!.getAttribute("data-selection-mode")).toBe("multiple");
    expect(items[2]!.getAttribute("data-selection-mode")).toBe("multiple");
    expect(items[1]!.getAttribute("role")).toBe("menuitemcheckbox");

    itemByText("Email")!.click();
    await flushPromises();
    itemByText("Copy link")!.click();
    await flushPromises();

    expect(sectionSelection).toHaveBeenLastCalledWith(["email", "copy"]);
    expect(rootSelection).not.toHaveBeenCalled();
    expect(items[1]!.getAttribute("aria-checked")).toBe("true");
    expect(items[2]!.getAttribute("aria-checked")).toBe("true");
    expect(popoversOf()).toHaveLength(1);

    itemByText("Edit")!.click();
    await waitClosed();

    expect(rootSelection).toHaveBeenCalledWith("edit");

    wrapper.unmount();
  });
});
