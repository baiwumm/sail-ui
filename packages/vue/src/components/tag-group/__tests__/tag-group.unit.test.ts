import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import {Description} from "../../description";
import {Label} from "../../label";
import {Tag, TagRemoveButton} from "../../tag";
import {TagGroup, TagGroupList} from "../index";
import type {TagGroupSelection, TagKey} from "../types";

interface TagItem {
  value: string;
  label: string;
  isDisabled?: boolean;
}

const defaultItems: TagItem[] = [
  {label: "News", value: "news"},
  {label: "Travel", value: "travel"},
  {label: "Gaming", value: "gaming"},
];

interface RenderOptions {
  props?: Record<string, unknown>;
  items?: TagItem[];
  withLabel?: boolean;
  withDescription?: boolean;
  customRemove?: boolean;
  listLabel?: string | null;
}

function tagGroupSlot({
  items = defaultItems,
  customRemove = false,
  withDescription = false,
  withLabel = false,
  listLabel,
}: Pick<
  RenderOptions,
  "items" | "customRemove" | "withDescription" | "withLabel" | "listLabel"
> = {}) {
  const resolvedListLabel = listLabel === undefined ? (withLabel ? undefined : "Tags") : listLabel;

  return [
    withLabel ? h(Label, null, {default: () => "Tags"}) : null,
    h(
      TagGroupList,
      resolvedListLabel === null || resolvedListLabel === undefined
        ? {}
        : {"aria-label": resolvedListLabel},
      {
        default: () =>
          items.map((item) =>
            h(
              Tag,
              {isDisabled: item.isDisabled, key: item.value, value: item.value},
              {
                default: () => [
                  item.label,
                  customRemove ? h(TagRemoveButton, {key: "remove"}) : null,
                ],
              },
            ),
          ),
      },
    ),
    withDescription ? h(Description, null, {default: () => "Pick tags"}) : null,
  ];
}

function renderTagGroup(options: RenderOptions = {}) {
  return mount(TagGroup, {
    attachTo: document.body,
    props: options.props,
    slots: {default: () => tagGroupSlot(options)},
  });
}

const tagsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll("[data-slot='tag']");
const removeButtonsOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll("[data-slot='tag-remove-button']");

afterEach(() => {
  document.body.replaceChildren();
});

describe("TagGroup", () => {
  it("renders the upstream group, list and row structure", () => {
    const wrapper = renderTagGroup({
      props: {selectionMode: "single"},
      withDescription: true,
      withLabel: true,
    });

    const root = wrapper.get("[data-slot='tag-group']");
    const list = wrapper.get("[data-slot='tag-group-list']");
    const label = wrapper.get("[data-slot='label']");
    const tags = tagsOf(wrapper);

    expect(root.classes()).toContain("tag-group");
    expect(list.classes()).toContain("tag-group__list");
    expect(list.attributes("role")).toBe("grid");
    expect(list.attributes("aria-labelledby")).toBe(label.attributes("id"));
    expect(list.attributes("aria-label")).toBeUndefined();
    expect(label.element.tagName).toBe("SPAN");

    expect(tags).toHaveLength(3);
    expect(tags[0]!.attributes("role")).toBe("row");
    expect(tags[0]!.attributes("aria-label")).toBe("News");
    expect(tags[0]!.attributes("aria-selected")).toBe("false");
    expect(tags[0]!.attributes("data-selection-mode")).toBe("single");
    expect(tags[0]!.attributes("data-slot")).toBe("tag");
    expect(tags[0]!.find("[role='gridcell']").attributes("aria-colindex")).toBe("1");
    expect(tags[0]!.find("[role='gridcell']").attributes("style")).toContain("display: contents");

    expect(wrapper.get("[data-slot='description']").text()).toBe("Pick tags");
    expect(removeButtonsOf(wrapper)).toHaveLength(0);

    wrapper.unmount();
  });

  it("forwards aria-label from the group root to the grid", () => {
    const wrapper = renderTagGroup({
      listLabel: null,
      props: {"aria-label": "Categories", selectionMode: "single"},
    });

    expect(wrapper.get("[data-slot='tag-group-list']").attributes("aria-label")).toBe("Categories");
    expect(
      wrapper.get("[data-slot='tag-group-list']").attributes("aria-labelledby"),
    ).toBeUndefined();

    wrapper.unmount();
  });

  it("selects a tag in single mode", async () => {
    const wrapper = renderTagGroup({props: {selectionMode: "single"}});

    await tagsOf(wrapper)[0]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["news"]);
    expect(wrapper.emitted("selection-change")?.[0]).toEqual(["news"]);
    expect(tagsOf(wrapper)[0]!.attributes("data-selected")).toBe("true");
    expect(tagsOf(wrapper)[0]!.attributes("aria-selected")).toBe("true");

    await tagsOf(wrapper)[1]!.trigger("click");
    await nextTick();

    expect(tagsOf(wrapper)[0]!.attributes("data-selected")).toBeUndefined();
    expect(tagsOf(wrapper)[1]!.attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("toggles multiple tags in multiple mode", async () => {
    const wrapper = renderTagGroup({props: {selectionMode: "multiple"}});

    await tagsOf(wrapper)[0]!.trigger("click");
    await nextTick();
    await tagsOf(wrapper)[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([["news", "travel"]]);
    expect(tagsOf(wrapper)[0]!.attributes("data-selected")).toBe("true");
    expect(tagsOf(wrapper)[1]!.attributes("data-selected")).toBe("true");

    await tagsOf(wrapper)[0]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([["travel"]]);
    expect(tagsOf(wrapper)[0]!.attributes("data-selected")).toBeUndefined();

    wrapper.unmount();
  });

  it("seeds an uncontrolled selection from defaultValue", async () => {
    const wrapper = renderTagGroup({
      props: {defaultValue: "travel", selectionMode: "single"},
    });

    expect(tagsOf(wrapper)[1]!.attributes("data-selected")).toBe("true");

    await tagsOf(wrapper)[2]!.trigger("click");
    await nextTick();

    expect(tagsOf(wrapper)[1]!.attributes("data-selected")).toBeUndefined();
    expect(tagsOf(wrapper)[2]!.attributes("data-selected")).toBe("true");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["gaming"]);

    wrapper.unmount();
  });

  it("supports a controlled host through v-model", async () => {
    const selected = ref<TagGroupSelection>();

    const host = defineComponent({
      setup() {
        return () =>
          h(
            TagGroup,
            {
              modelValue: selected.value,
              "onUpdate:modelValue": (value?: TagGroupSelection) => {
                selected.value = value;
              },
              selectionMode: "single",
            },
            {default: () => tagGroupSlot()},
          );
      },
    });

    const wrapper = mount(host, {attachTo: document.body});

    await tagsOf(wrapper)[1]!.trigger("click");
    await nextTick();

    expect(selected.value).toBe("travel");
    expect(tagsOf(wrapper)[1]!.attributes("data-selected")).toBe("true");

    selected.value = undefined;
    await nextTick();

    expect(tagsOf(wrapper)[1]!.attributes("data-selected")).toBeUndefined();

    wrapper.unmount();
  });

  it("disables the whole group or individual tags", async () => {
    const disabledGroup = renderTagGroup({
      props: {isDisabled: true, selectionMode: "single"},
    });

    await tagsOf(disabledGroup)[0]!.trigger("click");
    await nextTick();

    expect(disabledGroup.emitted("update:modelValue")).toBeUndefined();
    expect(tagsOf(disabledGroup)[0]!.attributes("data-disabled")).toBe("true");
    expect(tagsOf(disabledGroup)[0]!.attributes("aria-disabled")).toBe("true");
    expect(disabledGroup.get("[data-slot='tag-group-list']").attributes("data-disabled")).toBe(
      "true",
    );
    disabledGroup.unmount();

    const items = defaultItems.map((item) =>
      item.value === "gaming" ? {...item, isDisabled: true} : item,
    );
    const disabledTag = renderTagGroup({items, props: {selectionMode: "single"}});

    await tagsOf(disabledTag)[2]!.trigger("click");
    await nextTick();

    expect(disabledTag.emitted("update:modelValue")).toBeUndefined();
    expect(tagsOf(disabledTag)[2]!.attributes("data-disabled")).toBe("true");
    expect(tagsOf(disabledTag)[2]!.attributes("aria-selected")).toBeUndefined();

    disabledTag.unmount();
  });

  it("toggles selection with Enter and Space", async () => {
    const wrapper = renderTagGroup({props: {selectionMode: "single"}});

    (tagsOf(wrapper)[0]!.element as HTMLElement).focus();
    await tagsOf(wrapper)[0]!.trigger("keydown", {key: "Enter"});
    await tagsOf(wrapper)[0]!.trigger("keyup", {key: "Enter"});
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["news"]);

    await tagsOf(wrapper)[1]!.trigger("keydown", {key: " "});
    await tagsOf(wrapper)[1]!.trigger("keyup", {key: " "});
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual(["travel"]);
    expect(tagsOf(wrapper)[1]!.attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("moves focus with arrow keys and typeahead", async () => {
    const wrapper = renderTagGroup({props: {selectionMode: "single"}});
    await nextTick();
    const tags = tagsOf(wrapper);

    (tags[0]!.element as HTMLElement).focus();
    tags[0]!.element.dispatchEvent(
      new KeyboardEvent("keydown", {bubbles: true, key: "ArrowRight"}),
    );
    await nextTick();
    await nextTick();

    expect(document.activeElement).toBe(tags[1]!.element);

    tags[1]!.element.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "g"}));
    await nextTick();
    await nextTick();

    expect(document.activeElement).toBe(tags[2]!.element);

    wrapper.unmount();
  });

  it("clears the selection on Escape", async () => {
    const wrapper = renderTagGroup({
      props: {defaultValue: "news", selectionMode: "single"},
    });

    (tagsOf(wrapper)[0]!.element as HTMLElement).focus();
    await tagsOf(wrapper)[0]!.trigger("keydown", {key: "Escape"});
    await nextTick();

    expect(wrapper.emitted("selection-change")?.[0]).toEqual([undefined]);
    expect(tagsOf(wrapper)[0]!.attributes("data-selected")).toBeUndefined();

    wrapper.unmount();
  });

  it("renders default remove buttons only when remove is listened to", async () => {
    const onRemove = () => {};
    const wrapper = renderTagGroup({
      props: {defaultValue: "news", onRemove, selectionMode: "single"},
    });

    const buttons = removeButtonsOf(wrapper);

    expect(buttons).toHaveLength(3);
    expect(buttons[0]!.attributes("slot")).toBe("remove");
    expect(buttons[0]!.attributes("aria-label")).toBe("Remove tag");
    expect(buttons[0]!.attributes("type")).toBe("button");
    expect(buttons[0]!.classes()).toContain("tag__remove-button");
    expect(tagsOf(wrapper)[0]!.attributes("data-allows-removing")).toBe("true");

    await buttons[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("remove")?.[0]).toEqual([["travel"]]);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(tagsOf(wrapper)[1]!.attributes("data-selected")).toBeUndefined();
    expect(tagsOf(wrapper)[0]!.attributes("data-selected")).toBe("true");

    await buttons[0]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("remove")?.[1]).toEqual([["news"]]);
    expect(wrapper.emitted("selection-change")?.[0]).toEqual([undefined]);
    expect(tagsOf(wrapper)[0]!.attributes("data-selected")).toBeUndefined();

    wrapper.unmount();
  });

  it("keeps the default remove button out without a remove listener", () => {
    const wrapper = renderTagGroup({props: {selectionMode: "single"}});

    expect(removeButtonsOf(wrapper)).toHaveLength(0);
    expect(tagsOf(wrapper)[0]!.attributes("data-allows-removing")).toBeUndefined();

    wrapper.unmount();
  });

  it("renders a custom remove button in place of the default one", async () => {
    const onRemove = () => {};
    const wrapper = renderTagGroup({
      customRemove: true,
      props: {onRemove, selectionMode: "single"},
    });

    const buttons = removeButtonsOf(wrapper);

    expect(buttons).toHaveLength(3);
    expect(buttons[0]!.classes()).toContain("tag__remove-button");

    await buttons[0]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("remove")?.[0]).toEqual([["news"]]);

    wrapper.unmount();

    const withoutListener = renderTagGroup({customRemove: true});

    expect(removeButtonsOf(withoutListener)).toHaveLength(0);

    withoutListener.unmount();
  });

  it("removes tags with Delete and Backspace", async () => {
    const onRemove = () => {};
    const wrapper = renderTagGroup({
      props: {defaultValue: "news", onRemove, selectionMode: "single"},
    });

    (tagsOf(wrapper)[0]!.element as HTMLElement).focus();
    await tagsOf(wrapper)[0]!.trigger("keydown", {key: "Delete"});
    await nextTick();

    expect(wrapper.emitted("remove")?.[0]).toEqual([["news"]]);
    expect(wrapper.emitted("selection-change")?.[0]).toEqual([undefined]);
    expect(tagsOf(wrapper)[0]!.attributes("data-selected")).toBeUndefined();

    (tagsOf(wrapper)[1]!.element as HTMLElement).focus();
    await tagsOf(wrapper)[1]!.trigger("keydown", {key: "Backspace"});
    await nextTick();

    expect(wrapper.emitted("remove")?.[1]).toEqual([["travel"]]);

    wrapper.unmount();
  });

  it("restores focus to the next tag after a removal", async () => {
    const items = ref<TagItem[]>([...defaultItems]);
    const onRemove = (values: TagKey[]) => {
      items.value = items.value.filter((item) => !values.includes(item.value));
    };

    const host = defineComponent({
      setup() {
        return () =>
          h(
            TagGroup,
            {onRemove, selectionMode: "single"},
            {
              default: () =>
                h(
                  TagGroupList,
                  {"aria-label": "Tags"},
                  {
                    default: () =>
                      items.value.map((item) =>
                        h(Tag, {key: item.value, value: item.value}, {default: () => item.label}),
                      ),
                  },
                ),
            },
          );
      },
    });

    const wrapper = mount(host, {attachTo: document.body});
    const tags = tagsOf(wrapper);

    (tags[1]!.element as HTMLElement).focus();
    await removeButtonsOf(wrapper)[1]!.trigger("click");
    await nextTick();
    await nextTick();

    const remaining = tagsOf(wrapper);

    expect(remaining).toHaveLength(2);
    expect(remaining.map((tag) => tag.attributes("aria-label"))).toEqual(["News", "Gaming"]);
    expect(document.activeElement).toBe(remaining[1]!.element);

    wrapper.unmount();
  });

  it("exposes hover, press and focus states", async () => {
    const wrapper = renderTagGroup({props: {selectionMode: "single"}});
    const tag = tagsOf(wrapper)[0]!;
    const element = tag.element as HTMLElement;

    element.dispatchEvent(
      new PointerEvent("pointerenter", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
    );
    await nextTick();
    expect(tag.attributes("data-hovered")).toBe("true");

    element.dispatchEvent(
      new PointerEvent("pointerleave", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
    );
    await nextTick();
    expect(tag.attributes("data-hovered")).toBeUndefined();

    element.dispatchEvent(
      new PointerEvent("pointerdown", {bubbles: true, button: 0, pointerId: 1}),
    );
    await nextTick();
    expect(tag.attributes("data-pressed")).toBe("true");

    element.dispatchEvent(
      new PointerEvent("pointerup", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
    );
    await nextTick();
    expect(tag.attributes("data-pressed")).toBeUndefined();

    document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Tab"}));
    element.focus();
    await nextTick();

    expect(tag.attributes("data-focused")).toBe("true");
    expect(tag.attributes("data-focus-visible")).toBe("true");

    wrapper.unmount();
  });

  it("applies the group size and variant to every tag", () => {
    const wrapper = renderTagGroup({
      props: {selectionMode: "single", size: "lg", variant: "surface"},
    });

    for (const tag of tagsOf(wrapper)) {
      expect(tag.classes()).toContain("tag--lg");
      expect(tag.classes()).toContain("tag--surface");
    }

    wrapper.unmount();
  });

  it("omits selection attributes in selection mode none", async () => {
    const wrapper = renderTagGroup();

    expect(tagsOf(wrapper)[0]!.attributes("data-selection-mode")).toBeUndefined();
    expect(tagsOf(wrapper)[0]!.attributes("aria-selected")).toBeUndefined();

    await tagsOf(wrapper)[0]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    wrapper.unmount();
  });
});
