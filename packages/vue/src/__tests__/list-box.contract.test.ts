import {readFileSync} from "node:fs";
import {join} from "node:path";

import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {Description} from "../components/description";
import {Header} from "../components/header";
import {Label} from "../components/label";
import {ListBox, ListBoxItem, ListBoxItemIndicator, ListBoxSection} from "../components/list-box";
import {Separator} from "../components/separator";
import type {ListBoxSelection} from "../components/list-box/types";

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

const users = [
  {value: "bob", label: "Bob", description: "bob@example.com"},
  {value: "fred", label: "Fred", description: "fred@example.com"},
  {value: "martha", label: "Martha", description: "martha@example.com"},
];

const itemSlot = (user: (typeof users)[number]) => [
  h(Label, null, {default: () => user.label}),
  h(Description, null, {default: () => user.description}),
  h(ListBoxItemIndicator),
];

const itemsSlot = () => [
  ...users
    .slice(0, 2)
    .map((user) =>
      h(ListBoxItem, {key: user.value, value: user.value}, {default: () => itemSlot(user)}),
    ),
  h(
    ListBoxItem,
    {key: "martha", value: "martha", variant: "danger"},
    {default: () => itemSlot(users[2]!)},
  ),
];

const SectionPage = defineComponent({
  setup() {
    return () =>
      h(
        ListBox,
        {"aria-label": "File actions", defaultValue: "bob", selectionMode: "single"},
        {
          default: () => [
            ...itemsSlot(),
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
        {default: () => itemsSlot()},
      );
  },
});

const NonePage = defineComponent({
  setup() {
    return () =>
      h(
        ListBox,
        {"aria-label": "Actions", onAction: () => {}, selectionMode: "none"},
        {default: () => itemsSlot()},
      );
  },
});

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

const idOf = (tag: string) => /id="([^"]+)"/.exec(tag)?.[1];

afterEach(() => {
  document.body.replaceChildren();
});

describe("T06 list-box contract", () => {
  it("renders every upstream slot", async () => {
    const html = await renderSSR(SectionPage);

    expectUpstreamSlots(html, "list-box", [
      ...(slotSnapshot.components["list-box-item"] ?? []),
      "label",
      "description",
      "header",
      "separator",
    ]);

    expect(html.match(/role="listbox"/g)).toHaveLength(1);
    expect(html.match(/role="option"/g)).toHaveLength(4);

    const section = /<section[^>]*>/.exec(html)?.[0] ?? "";

    expect(section).not.toContain("data-slot");
    expect(html).toContain('class="list-box-section"');
  });

  it("keeps the upstream root and item class vocabulary", async () => {
    const html = await renderSSR(SectionPage);
    const root = tagsOf(html, "list-box")[0] ?? "";
    const items = tagsOf(html, "list-box-item");

    expect(root).toContain('class="list-box list-box--default"');
    expect(root).toContain('aria-label="File actions"');
    expect(root).not.toContain("aria-multiselectable");

    expect(items[0]).toContain("list-box-item list-box-item--default");
    expect(items[2]).toContain("list-box-item list-box-item--danger");

    const indicators = tagsOf(html, "list-box-item-indicator");

    expect(indicators).toHaveLength(3);
    expect(indicators[0]).toContain('data-visible="true"');
    expect(indicators[1]).not.toContain("data-visible");
    expect(indicators[0]!.match(/list-box-item__indicator/g)).toHaveLength(1);
  });

  it("renders the upstream selection and disabled attributes", async () => {
    const html = await renderSSR(SectionPage);
    const items = tagsOf(html, "list-box-item");

    expect(items[0]).toContain('aria-selected="true"');
    expect(items[0]).toContain('data-selected="true"');
    expect(items[0]).toContain('data-selection-mode="single"');
    expect(items[1]).toContain('aria-selected="false"');
    expect(items[1]).not.toContain('data-selected="true"');

    for (const item of items) {
      expect(item).not.toContain("data-state=");
      expect(item).not.toContain("data-highlighted");
      expect(item).not.toContain(" data-disabled");
      expect(item).not.toContain(" disabled=");
    }

    const none = await renderSSR(NonePage);
    const noneItems = tagsOf(none, "list-box-item");

    for (const item of noneItems) {
      expect(item).not.toContain("aria-selected");
      expect(item).not.toContain("data-selection-mode");
    }
  });

  it("supports multiple selection on the root", async () => {
    const html = await renderSSR(MultiplePage);
    const root = tagsOf(html, "list-box")[0] ?? "";
    const items = tagsOf(html, "list-box-item");

    expect(root).toContain('aria-multiselectable="true"');
    expect(items[0]).toContain('data-selection-mode="multiple"');
    expect(items[0]).toContain('data-selected="true"');
    expect(items[1]).toContain('data-selected="true"');
    expect(items[2]).toContain('aria-selected="false"');
  });

  it("wires label, description and section header ids", async () => {
    const html = await renderSSR(SectionPage);
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

    expect(await renderSSR(SectionPage)).toBe(html);
  });

  it("emits selection-change and action from mounted items", async () => {
    const wrapper = mount(ListBox, {
      attachTo: document.body,
      props: {"aria-label": "Users"},
      slots: {
        default: () =>
          users.map((user) =>
            h(
              ListBoxItem,
              {key: user.value, value: user.value},
              {
                default: () => [h(Label, null, {default: () => user.label})],
              },
            ),
          ),
      },
    });

    await wrapper.findAll("[data-slot='list-box-item']")[1]!.trigger("click");
    await nextTick();

    expect(wrapper.emitted("selection-change")?.[0]).toEqual(["fred"]);
    expect(wrapper.emitted("action")?.[0]).toEqual(["fred"]);

    wrapper.unmount();
  });

  it("updates a controlled host through v-model", async () => {
    const selection = ref<ListBoxSelection>("bob");
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
            {
              default: () =>
                users.map((user) =>
                  h(
                    ListBoxItem,
                    {key: user.value, value: user.value},
                    {
                      default: () => [h(Label, null, {default: () => user.label})],
                    },
                  ),
                ),
            },
          );
      },
    });

    const wrapper = mount(Host, {attachTo: document.body});

    await wrapper.findAll("[data-slot='list-box-item']")[2]!.trigger("click");
    await nextTick();

    expect(selection.value).toBe("martha");
    expect(wrapper.findComponent(ListBox).emitted("update:modelValue")?.[0]).toEqual(["martha"]);

    wrapper.unmount();
  });
});
