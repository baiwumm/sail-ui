import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {Label} from "../components/label";
import {Description} from "../components/description";
import {Tag} from "../components/tag";
import {TagGroup, TagGroupList} from "../components/tag-group";

const TagGroupPage = defineComponent({
  setup() {
    return () =>
      h(
        TagGroup,
        {
          "aria-describedby": "topics-help",
          defaultValue: "news",
          onRemove: () => {},
          selectionMode: "single",
        },
        {
          default: () => [
            h(Label, null, {default: () => "Topics"}),
            h(TagGroupList, null, {
              default: () => [
                h(Tag, {value: "news"}, {default: () => "News"}),
                h(Tag, {value: "travel"}, {default: () => "Travel"}),
                h(Tag, {isDisabled: true, value: "gaming"}, {default: () => "Gaming"}),
              ],
            }),
            h(Description, {id: "topics-help"}, {default: () => "Choose topics"}),
          ],
        },
      );
  },
});

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

const idOf = (tag: string) => /id="([^"]+)"/.exec(tag)?.[1];

describe("T06 tag SSR", () => {
  it("renders every upstream slot", async () => {
    const html = await renderSSR(TagGroupPage);

    for (const slot of [
      "tag-group",
      "tag-group-list",
      "label",
      "description",
      "tag",
      "tag-remove-button",
      "close-button-icon",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html.match(/role="grid"/g)).toHaveLength(1);
    expect(html.match(/role="row"/g)).toHaveLength(3);
    expect(html.match(/role="gridcell"/g)).toHaveLength(3);
    expect(html).toContain("tag-group__list");
    expect(html).toContain("tag--md");
  });

  it("wires the label to the grid and describes the rows", async () => {
    const html = await renderSSR(TagGroupPage);
    const label = tagsOf(html, "label")[0] ?? "";
    const list = tagsOf(html, "tag-group-list")[0] ?? "";

    expect(label).toContain("<span");
    expect(list).toContain(`aria-labelledby="${idOf(label)}"`);
    expect(list).toContain('aria-describedby="');
    expect(list).not.toContain("aria-label=");

    for (const tag of tagsOf(html, "tag")) {
      expect(tag).toContain('aria-label="');
      expect(tag).toContain('data-selection-mode="single"');
    }
  });

  it("renders the upstream selection and removal state attributes", async () => {
    const html = await renderSSR(TagGroupPage);
    const tags = tagsOf(html, "tag");

    expect(tags[0]).toContain('aria-selected="true"');
    expect(tags[0]).toContain('data-selected="true"');
    expect(tags[1]).toContain('aria-selected="false"');
    expect(tags[1]).not.toContain('data-selected="true"');
    expect(tags[2]).toContain('data-disabled="true"');
    expect(tags[2]).toContain('aria-disabled="true"');
    expect(tags[2]).not.toContain("aria-selected");

    for (const tag of tags) {
      expect(tag).toContain('data-allows-removing="true"');
      expect(tag).not.toContain("data-state=");
    }

    const removeButton = tagsOf(html, "tag-remove-button")[0] ?? "";

    expect(removeButton).toContain('slot="remove"');
    expect(removeButton).toContain('aria-label="Remove tag"');

    expect(await renderSSR(TagGroupPage)).toBe(html);
  });
});
