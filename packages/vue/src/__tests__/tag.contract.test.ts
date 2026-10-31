import {readFileSync} from "node:fs";
import {join} from "node:path";

import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import {dataAttributesOfSlot, dataSlots, renderSSR} from "@sail-ui/testing";

import {Label} from "../components/label";
import {Tag} from "../components/tag";
import {TagGroup, TagGroupList} from "../components/tag-group";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const uniqueSorted = (slots: string[]) => [...new Set(slots)].sort();

function expectUpstreamSlots(html: string, component: string, extras: string[] = []) {
  const expected = [...(slotSnapshot.components[component] ?? []), ...extras];

  expect(uniqueSorted(dataSlots(html)), `${component} data-slot parity`).toEqual(
    uniqueSorted(expected),
  );
}

const tagItems = () => [
  h(Tag, {value: "news"}, {default: () => "News"}),
  h(Tag, {value: "travel"}, {default: () => "Travel"}),
  h(Tag, {isDisabled: true, value: "gaming"}, {default: () => "Gaming"}),
];

const SingleTagGroupHost = defineComponent({
  setup() {
    return () =>
      h(
        TagGroup,
        {
          defaultValue: "news",
          onRemove: () => {},
          selectionMode: "single",
          size: "lg",
          variant: "surface",
        },
        {
          default: () => [
            h(Label, null, {default: () => "Topics"}),
            h(TagGroupList, null, {default: tagItems}),
          ],
        },
      );
  },
});

const MultipleTagGroupHost = defineComponent({
  setup() {
    return () =>
      h(
        TagGroup,
        {defaultValue: ["news", "travel"], selectionMode: "multiple"},
        {
          default: () =>
            h(
              TagGroupList,
              {"aria-label": "Topics"},
              {
                default: () => [
                  h(Tag, {value: "news"}, {default: () => "News"}),
                  h(Tag, {value: "travel"}, {default: () => "Travel"}),
                ],
              },
            ),
        },
      );
  },
});

afterEach(() => {
  document.body.replaceChildren();
});

describe("T06 tag data-slot parity", () => {
  it("Tag and TagGroup render every upstream slot", async () => {
    const html = await renderSSR(SingleTagGroupHost);

    expectUpstreamSlots(html, "tag-group", [
      ...(slotSnapshot.components.tag ?? []),
      ...(slotSnapshot.components.label ?? []),
      "close-button-icon",
    ]);
    expect(html).toContain("tag-group__list");
    expect(html).toContain("tag--lg");
    expect(html).toContain("tag--surface");
    expect(html).toContain("tag__remove-button");
    expect(html.match(/tag__remove-button/g)).toHaveLength(3);
  });

  it("does not leak Reka's own state attributes", async () => {
    const html = await renderSSR(SingleTagGroupHost);
    const tags = dataAttributesOfSlot(html, "tag");

    expect(tags).toHaveLength(3);

    for (const tag of tags) {
      expect(tag).not.toHaveProperty("data-state");
      expect(tag).not.toHaveProperty("data-orientation");
      expect(tag["data-selection-mode"]).toBe("single");
      expect(tag["data-allows-removing"]).toBe("true");
    }

    expect(tags[0]!["data-selected"]).toBe("true");
    expect(tags[1]!).not.toHaveProperty("data-selected");
    expect(tags[2]!["data-disabled"]).toBe("true");
  });

  it("marks a multiple group as a multiselectable grid", async () => {
    const html = await renderSSR(MultipleTagGroupHost);
    const list = /<div[^>]*data-slot="tag-group-list"[^>]*>/.exec(html)?.[0] ?? "";

    expect(list).toContain('role="grid"');
    expect(list).toContain('aria-multiselectable="true"');
    expect(dataAttributesOfSlot(html, "tag")[0]).not.toHaveProperty("data-allows-removing");
  });
});

describe("T06 tag state contract", () => {
  it("moves data-selected and aria-selected with the selection", async () => {
    const wrapper = mount(SingleTagGroupHost, {attachTo: document.body});
    const tags = () => wrapper.findAll("[data-slot='tag']");

    expect(tags()[0]!.attributes("data-selected")).toBe("true");
    expect(tags()[0]!.attributes("aria-selected")).toBe("true");
    expect(tags()[1]!.attributes("aria-selected")).toBe("false");
    expect(tags()[2]!.attributes("aria-selected")).toBeUndefined();

    await tags()[1]!.trigger("click");
    await nextTick();

    expect(tags()[0]!.attributes("data-selected")).toBeUndefined();
    expect(tags()[1]!.attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("removes tags and clears the removed selection", async () => {
    const wrapper = mount(SingleTagGroupHost, {attachTo: document.body});
    const group = wrapper.findComponent(TagGroup);
    const buttons = wrapper.findAll("[data-slot='tag-remove-button']");
    const tags = () => wrapper.findAll("[data-slot='tag']");

    await buttons[1]!.trigger("click");
    await nextTick();

    expect(group.emitted("remove")?.[0]).toEqual([["travel"]]);
    expect(tags()[0]!.attributes("data-selected")).toBe("true");

    (tags()[0]!.element as HTMLElement).focus();
    tags()[0]!.element.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Delete"}));
    await nextTick();

    expect(group.emitted("remove")?.[1]).toEqual([["news"]]);
    expect(group.emitted("selection-change")?.[0]).toEqual([undefined]);
    expect(tags()[0]!.attributes("data-selected")).toBeUndefined();

    wrapper.unmount();
  });

  it("renders an empty group once the last tag is gone", async () => {
    const wrapper = mount(TagGroup, {
      attachTo: document.body,
      props: {selectionMode: "none"},
      slots: {
        default: () => h(TagGroupList, {"aria-label": "Topics"}, {default: () => []}),
      },
    });

    await nextTick();

    const list = wrapper.get("[data-slot='tag-group-list']");

    expect(list.attributes("role")).toBe("group");
    expect(list.attributes("data-empty")).toBe("");
    expect(list.attributes("tabindex")).toBe("0");

    wrapper.unmount();
  });
});
