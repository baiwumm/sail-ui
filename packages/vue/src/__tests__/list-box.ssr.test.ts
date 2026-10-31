import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {Description} from "../components/description";
import {Header} from "../components/header";
import {Label} from "../components/label";
import {ListBox, ListBoxItem, ListBoxItemIndicator, ListBoxSection} from "../components/list-box";
import {Separator} from "../components/separator";

const users = [
  {value: "bob", label: "Bob", description: "bob@example.com"},
  {value: "fred", label: "Fred", description: "fred@example.com"},
];

const ListBoxPage = defineComponent({
  setup() {
    return () =>
      h(
        ListBox,
        {"aria-label": "Users", defaultValue: "bob", selectionMode: "single"},
        {
          default: () => [
            ...users.map((user) =>
              h(
                ListBoxItem,
                {key: user.value, value: user.value},
                {
                  default: () => [
                    h(Label, null, {default: () => user.label}),
                    h(Description, null, {default: () => user.description}),
                    h(ListBoxItemIndicator),
                  ],
                },
              ),
            ),
            h(
              ListBoxItem,
              {key: "martha", value: "martha", isDisabled: true},
              {
                default: () => h(Label, null, {default: () => "Martha"}),
              },
            ),
            h(
              ListBoxSection,
              {key: "actions"},
              {
                default: () => [
                  h(Header, null, {default: () => "Actions"}),
                  h(
                    ListBoxItem,
                    {key: "delete", value: "delete", variant: "danger"},
                    {
                      default: () => h(Label, null, {default: () => "Delete file"}),
                    },
                  ),
                ],
              },
            ),
            h(Separator, {isDecorative: true, key: "separator"}),
          ],
        },
      );
  },
});

const MultiplePage = defineComponent({
  setup() {
    return () =>
      h(
        ListBox,
        {"aria-label": "Users", defaultValue: ["bob", "fred"], selectionMode: "multiple"},
        {
          default: () =>
            users.map((user) =>
              h(
                ListBoxItem,
                {key: user.value, value: user.value},
                {
                  default: () => [
                    h(Label, null, {default: () => user.label}),
                    h(ListBoxItemIndicator),
                  ],
                },
              ),
            ),
        },
      );
  },
});

const NonePage = defineComponent({
  setup() {
    return () =>
      h(
        ListBox,
        {"aria-label": "Actions", onAction: () => {}, selectionMode: "none"},
        {
          default: () =>
            h(
              ListBoxItem,
              {value: "copy"},
              {default: () => h(Label, null, {default: () => "Copy"})},
            ),
        },
      );
  },
});

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

const idOf = (tag: string) => /id="([^"]+)"/.exec(tag)?.[1];

describe("T06 list-box SSR", () => {
  it("renders the listbox, items, indicators and sections", async () => {
    const html = await renderSSR(ListBoxPage);

    for (const slot of [
      "list-box",
      "list-box-item",
      "list-box-item-indicator",
      "list-box-item-indicator--checkmark",
      "label",
      "description",
      "header",
      "separator",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html.match(/role="listbox"/g)).toHaveLength(1);
    expect(html.match(/role="option"/g)).toHaveLength(4);
    expect(html.match(/role="group"/g)).toHaveLength(1);
    expect(html).not.toContain("aria-multiselectable");
    expect(html).not.toContain('data-slot="list-box-section"');
  });

  it("renders the upstream selection, disabled and variant attributes", async () => {
    const html = await renderSSR(ListBoxPage);
    const items = tagsOf(html, "list-box-item");

    expect(items[0]).toContain('aria-selected="true"');
    expect(items[0]).toContain('data-selected="true"');
    expect(items[0]).toContain('data-selection-mode="single"');
    expect(items[1]).toContain('aria-selected="false"');
    expect(items[1]).not.toContain('data-selected="true"');
    expect(items[2]).toContain('data-disabled="true"');
    expect(items[2]).toContain('aria-disabled="true"');
    expect(items[2]).toContain('aria-selected="false"');
    expect(items[2]).not.toContain('data-selected="true"');
    expect(items[3]).toContain("list-box-item--danger");

    for (const item of items) {
      expect(item).not.toContain("data-state=");
      expect(item).not.toContain("data-highlighted");
      expect(item).not.toContain("data-focused");
      expect(item).not.toContain("data-hovered");
      expect(item).not.toContain("data-pressed");
      expect(item).not.toContain(" disabled=");
    }

    const indicators = tagsOf(html, "list-box-item-indicator");

    expect(indicators[0]).toContain('data-visible="true"');
    expect(indicators[1]).not.toContain("data-visible");

    const checkmarks = tagsOf(html, "list-box-item-indicator--checkmark");

    expect(checkmarks[0]).toContain('stroke-dashoffset="44"');
    expect(checkmarks[1]).toContain('stroke-dashoffset="66"');
  });

  it("wires label, description and section header ids", async () => {
    const html = await renderSSR(ListBoxPage);
    const items = tagsOf(html, "list-box-item");
    const labels = tagsOf(html, "label");
    const descriptions = tagsOf(html, "description");
    const header = tagsOf(html, "header")[0] ?? "";
    const section = /<section[^>]*>/.exec(html)?.[0] ?? "";

    expect(labels[0]).toContain("<span");
    expect(items[0]).toContain(`aria-labelledby="${idOf(labels[0]!)}"`);
    expect(items[0]).toContain(`aria-describedby="${idOf(descriptions[0]!)}"`);
    expect(section).toContain(`aria-labelledby="${idOf(header)}"`);
    expect(section).toContain('role="group"');
    expect(section).toContain('class="list-box-section"');

    expect(await renderSSR(ListBoxPage)).toBe(html);
  });

  it("renders multiple selection", async () => {
    const html = await renderSSR(MultiplePage);
    const root = tagsOf(html, "list-box")[0] ?? "";
    const items = tagsOf(html, "list-box-item");

    expect(root).toContain('aria-multiselectable="true"');
    expect(items[0]).toContain('data-selection-mode="multiple"');
    expect(items[0]).toContain('data-selected="true"');
    expect(items[1]).toContain('data-selected="true"');
    expect(tagsOf(html, "list-box-item-indicator")[1]).toContain('data-visible="true"');
  });

  it('omits selection semantics in "none" mode', async () => {
    const html = await renderSSR(NonePage);
    const item = tagsOf(html, "list-box-item")[0] ?? "";

    expect(item).not.toContain("aria-selected");
    expect(item).not.toContain("data-selection-mode");
    expect(item).not.toContain("data-selected");
    expect(html).not.toContain("aria-multiselectable");
  });
});
