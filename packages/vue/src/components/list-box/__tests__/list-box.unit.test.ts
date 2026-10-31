import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import {Description} from "../../description";
import {Header} from "../../header";
import {Label} from "../../label";
import {ListBox, ListBoxItem, ListBoxItemIndicator, ListBoxSection} from "../index";
import type {ListBoxSelection} from "../types";

interface User {
  value: string;
  label: string;
  description?: string;
  isDisabled?: boolean;
}

const users: User[] = [
  {value: "bob", label: "Bob"},
  {value: "fred", label: "Fred"},
  {value: "martha", label: "Martha"},
];

const itemSlot = (user: User) => [
  h(Label, null, {default: () => user.label}),
  user.description ? h(Description, null, {default: () => user.description}) : null,
  h(ListBoxItemIndicator),
];

function listSlot(items = users) {
  return items.map((user) =>
    h(
      ListBoxItem,
      {isDisabled: user.isDisabled, key: user.value, value: user.value},
      {default: () => itemSlot(user)},
    ),
  );
}

function renderListBox(props: Record<string, unknown> = {}, options: {items?: User[]} = {}) {
  return mount(ListBox, {
    attachTo: document.body,
    props: {"aria-label": "Users", ...props},
    slots: {default: () => listSlot(options.items ?? users)},
  });
}

const itemsOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll("[data-slot='list-box-item']");
const indicatorsOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll("[data-slot='list-box-item-indicator']");

function keydown(target: Element, key: string) {
  target.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key}));
}

function pointer(target: Element, type: string) {
  target.dispatchEvent(new PointerEvent(type, {bubbles: true, pointerId: 1, pointerType: "mouse"}));
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("ListBox", () => {
  it("renders the upstream listbox, item and indicator structure", () => {
    const wrapper = renderListBox();

    const root = wrapper.get("[data-slot='list-box']");

    expect(root.attributes("role")).toBe("listbox");
    expect(root.attributes("aria-label")).toBe("Users");
    expect(root.attributes("aria-multiselectable")).toBeUndefined();
    expect(root.classes()).toEqual(expect.arrayContaining(["list-box", "list-box--default"]));

    const items = itemsOf(wrapper);

    expect(items).toHaveLength(3);
    expect(items[0]!.attributes("role")).toBe("option");
    expect(items[0]!.classes()).toEqual(
      expect.arrayContaining(["list-box-item", "list-box-item--default"]),
    );
    expect(items[0]!.attributes("aria-selected")).toBe("false");
    expect(items[0]!.attributes("data-selection-mode")).toBe("single");
    expect(items[0]!.attributes("data-selected")).toBeUndefined();
    expect(items[0]!.attributes("data-state")).toBeUndefined();
    expect(items[0]!.attributes("data-highlighted")).toBeUndefined();
    expect(items[0]!.attributes("disabled")).toBeUndefined();

    const labels = wrapper.findAll("[data-slot='label']");

    expect(labels).toHaveLength(3);
    expect(labels[0]!.element.tagName).toBe("SPAN");
    expect(items[0]!.attributes("aria-labelledby")).toBe(labels[0]!.attributes("id"));

    const indicators = indicatorsOf(wrapper);

    expect(indicators).toHaveLength(3);
    expect(indicators[0]!.attributes("aria-hidden")).toBe("true");
    expect(indicators[0]!.attributes("data-visible")).toBeUndefined();

    const checkmark = indicators[0]!.get("[data-slot='list-box-item-indicator--checkmark']");

    expect(checkmark.attributes("stroke-dashoffset")).toBe("66");
    expect(checkmark.attributes("aria-hidden")).toBe("true");

    wrapper.unmount();
  });

  it("wires Label and Description ids into the option", () => {
    const wrapper = renderListBox({}, {items: [{...users[0]!, description: "bob@example.com"}]});
    const item = itemsOf(wrapper)[0]!;
    const label = wrapper.get("[data-slot='label']");
    const description = wrapper.get("[data-slot='description']");

    expect(item.attributes("aria-labelledby")).toBe(label.attributes("id"));
    expect(item.attributes("aria-describedby")).toBe(description.attributes("id"));
    expect(description.element.tagName).toBe("SPAN");

    wrapper.unmount();
  });

  it("selects and deselects a single item", async () => {
    const wrapper = renderListBox();
    const items = itemsOf(wrapper);

    await items[1]!.trigger("click");
    await nextTick();

    expect(items[1]!.attributes("aria-selected")).toBe("true");
    expect(items[1]!.attributes("data-selected")).toBe("true");
    expect(indicatorsOf(wrapper)[1]!.attributes("data-visible")).toBe("true");
    expect(
      indicatorsOf(wrapper)[1]!
        .get("[data-slot='list-box-item-indicator--checkmark']")
        .attributes("stroke-dashoffset"),
    ).toBe("44");
    expect(wrapper.emitted("selection-change")?.[0]).toEqual(["fred"]);

    await items[1]!.trigger("click");
    await nextTick();

    expect(items[1]!.attributes("aria-selected")).toBe("false");
    expect(items[1]!.attributes("data-selected")).toBeUndefined();
    expect(indicatorsOf(wrapper)[1]!.attributes("data-visible")).toBeUndefined();
    expect(wrapper.emitted("selection-change")?.[1]).toEqual([undefined]);

    wrapper.unmount();
  });

  it("supports multiple selection and toggling", async () => {
    const wrapper = renderListBox({selectionMode: "multiple"});
    const items = itemsOf(wrapper);

    expect(wrapper.get("[data-slot='list-box']").attributes("aria-multiselectable")).toBe("true");
    expect(items[0]!.attributes("data-selection-mode")).toBe("multiple");

    await items[0]!.trigger("click");
    await items[2]!.trigger("click");
    await nextTick();

    expect(items[0]!.attributes("data-selected")).toBe("true");
    expect(items[2]!.attributes("data-selected")).toBe("true");
    expect(wrapper.emitted("selection-change")?.at(-1)).toEqual([["bob", "martha"]]);

    await items[0]!.trigger("click");
    await nextTick();

    expect(items[0]!.attributes("data-selected")).toBeUndefined();
    expect(wrapper.emitted("selection-change")?.at(-1)).toEqual([["martha"]]);

    wrapper.unmount();
  });

  it("keeps a controlled selection in sync with the host", async () => {
    const selection = ref<ListBoxSelection>();
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ListBox,
            {
              "aria-label": "Users",
              modelValue: selection.value,
              "onUpdate:modelValue": (value: ListBoxSelection) => {
                selection.value = value;
              },
            },
            {default: () => listSlot()},
          );
      },
    });

    const wrapper = mount(Host, {attachTo: document.body});

    await nextTick();
    expect(itemsOf(wrapper)[0]!.attributes("aria-selected")).toBe("false");

    await itemsOf(wrapper)[2]!.trigger("click");
    await nextTick();

    expect(selection.value).toBe("martha");
    expect(itemsOf(wrapper)[2]!.attributes("aria-selected")).toBe("true");

    selection.value = "bob";
    await nextTick();

    expect(itemsOf(wrapper)[0]!.attributes("aria-selected")).toBe("true");
    expect(itemsOf(wrapper)[2]!.attributes("aria-selected")).toBe("false");

    wrapper.unmount();
  });

  it("disables items through the item prop and disabledKeys", async () => {
    const wrapper = renderListBox(
      {disabledKeys: ["fred"]},
      {items: [users[0]!, users[1]!, {...users[2]!, isDisabled: true}]},
    );
    const items = itemsOf(wrapper);

    expect(items[1]!.attributes("data-disabled")).toBe("true");
    expect(items[1]!.attributes("aria-disabled")).toBe("true");
    expect(items[2]!.attributes("data-disabled")).toBe("true");

    await items[1]!.trigger("click");
    await items[2]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("selection-change")).toBeUndefined();
    expect(wrapper.emitted("action")).toBeUndefined();

    wrapper.unmount();
  });

  it('turns selection off and emits actions in "none" mode', async () => {
    const wrapper = renderListBox({selectionMode: "none"});
    const items = itemsOf(wrapper);

    expect(items[0]!.attributes("aria-selected")).toBeUndefined();
    expect(items[0]!.attributes("data-selection-mode")).toBeUndefined();

    await items[0]!.trigger("click");
    await nextTick();

    expect(items[0]!.attributes("data-selected")).toBeUndefined();
    expect(wrapper.emitted("selection-change")).toBeUndefined();
    expect(wrapper.emitted("action")?.[0]).toEqual(["bob"]);

    wrapper.unmount();
  });

  it("moves focus with the keyboard and selects with Enter", async () => {
    const wrapper = renderListBox();
    await nextTick();
    await nextTick();

    const items = itemsOf(wrapper);

    (items[0]!.element as HTMLElement).focus();
    keydown(items[0]!.element, "ArrowDown");
    await nextTick();

    expect(document.activeElement).toBe(items[1]!.element);
    expect(items[1]!.attributes("data-focused")).toBe("true");

    keydown(items[1]!.element, "Enter");
    await nextTick();

    expect(items[1]!.attributes("data-selected")).toBe("true");
    expect(wrapper.emitted("selection-change")?.[0]).toEqual(["fred"]);

    wrapper.unmount();
  });

  it("moves focus with Home and End", async () => {
    const wrapper = renderListBox();
    await nextTick();
    await nextTick();

    const items = itemsOf(wrapper);

    (items[0]!.element as HTMLElement).focus();
    keydown(items[0]!.element, "End");
    await nextTick();
    expect(document.activeElement).toBe(items[2]!.element);

    keydown(items[2]!.element, "Home");
    await nextTick();
    expect(document.activeElement).toBe(items[0]!.element);

    wrapper.unmount();
  });

  it("moves focus with typeahead", async () => {
    const wrapper = renderListBox();
    await nextTick();
    await nextTick();

    const items = itemsOf(wrapper);

    (items[0]!.element as HTMLElement).focus();
    keydown(items[0]!.element, "m");
    await nextTick();

    expect(document.activeElement).toBe(items[2]!.element);

    wrapper.unmount();
  });

  it("reflects hover, press and focus state attributes", async () => {
    const wrapper = renderListBox();
    await nextTick();

    const item = itemsOf(wrapper)[0]!;

    pointer(item.element, "pointerenter");
    await nextTick();
    expect(item.attributes("data-hovered")).toBe("true");

    pointer(item.element, "pointerdown");
    await nextTick();
    expect(item.attributes("data-pressed")).toBe("true");

    pointer(item.element, "pointerup");
    await nextTick();
    expect(item.attributes("data-pressed")).toBeUndefined();

    pointer(item.element, "pointerleave");
    await nextTick();
    expect(item.attributes("data-hovered")).toBeUndefined();

    keydown(document.body, "Tab");
    (item.element as HTMLElement).focus();
    await nextTick();
    expect(item.attributes("data-focused")).toBe("true");
    expect(item.attributes("data-focus-visible")).toBe("true");

    wrapper.unmount();
  });

  it("groups items in a labelled section", () => {
    const wrapper = mount(ListBox, {
      attachTo: document.body,
      props: {"aria-label": "File actions", selectionMode: "none"},
      slots: {
        default: () =>
          h(ListBoxSection, null, {
            default: () => [h(Header, null, {default: () => "Actions"}), ...listSlot([users[0]!])],
          }),
      },
    });

    const section = wrapper.get("section");
    const header = wrapper.get("[data-slot='header']");

    expect(section.classes()).toContain("list-box-section");
    expect(section.attributes("role")).toBe("group");
    expect(section.attributes("aria-labelledby")).toBe(header.attributes("id"));
    expect(section.attributes("data-slot")).toBeUndefined();
    expect(header.element.tagName).toBe("HEADER");

    wrapper.unmount();
  });

  it("applies danger variants and custom text values", () => {
    const wrapper = mount(ListBox, {
      attachTo: document.body,
      props: {"aria-label": "Danger", variant: "danger"},
      slots: {
        default: () =>
          h(
            ListBoxItem,
            {textValue: "Delete file", value: "delete", variant: "danger"},
            {
              default: () => "Delete file",
            },
          ),
      },
    });

    const root = wrapper.get("[data-slot='list-box']");
    const item = itemsOf(wrapper)[0]!;

    expect(root.classes()).toContain("list-box--danger");
    expect(item.classes()).toContain("list-box-item--danger");
    expect(item.attributes("aria-label")).toBe("Delete file");

    wrapper.unmount();
  });

  it("exposes the selected state to the indicator slot", async () => {
    const wrapper = mount(ListBox, {
      attachTo: document.body,
      props: {"aria-label": "Users"},
      slots: {
        default: () =>
          h(
            ListBoxItem,
            {value: "bob"},
            {
              default: () => [
                h(Label, null, {default: () => "Bob"}),
                h(ListBoxItemIndicator, null, {
                  default: ({isSelected}: {isSelected: boolean}) =>
                    h("span", {"data-selected-slot": String(isSelected)}),
                }),
              ],
            },
          ),
      },
    });

    await itemsOf(wrapper)[0]!.trigger("click");
    await nextTick();

    expect(
      wrapper
        .get("[data-slot='list-box-item-indicator'] [data-selected-slot]")
        .attributes("data-selected-slot"),
    ).toBe("true");

    wrapper.unmount();
  });
});
