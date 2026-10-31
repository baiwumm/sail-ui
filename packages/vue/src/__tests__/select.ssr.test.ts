import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {Label} from "../components/label";
import {
  Select,
  SelectClearButton,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "../components/select";

const states = [
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
];

function createPage(defaultValue?: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          Select,
          {
            defaultValue,
            fullWidth: true,
            name: "state",
            placeholder: "Select one",
          },
          {
            default: () => [
              h(Label, null, {default: () => "State"}),
              h(SelectTrigger, null, {
                default: () => [h(SelectValue), h(SelectClearButton), h(SelectIndicator)],
              }),
              h(SelectPopover, null, {
                default: () => [
                  h(SelectListBox, null, {
                    default: () =>
                      states.map((item) =>
                        h(
                          SelectItem,
                          {key: item.id, textValue: item.label, value: item.id},
                          {default: () => [item.label, h(SelectItemIndicator)]},
                        ),
                      ),
                  }),
                ],
              }),
            ],
          },
        );
    },
  });
}

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

const idOf = (tag: string) => /id="([^"]+)"/.exec(tag)?.[1];

describe("T06 select SSR", () => {
  it("renders only the trigger shell while closed", async () => {
    const html = await renderSSR(createPage());

    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Select one");
    expect(html).toContain('data-placeholder="true"');
    expect(html).not.toContain('aria-controls="');
    expect(html).not.toContain('data-slot="select-popover"');
    expect(html).not.toContain('data-slot="list-box"');
    expect(html).not.toContain('role="listbox"');
    expect(html).not.toContain("data-state=");
  });

  it("keeps the server output deterministic and placeholder-only for default values", async () => {
    const html = await renderSSR(createPage("california"));

    expect(html).toBe(await renderSSR(createPage("california")));
    // Reka registers option labels only after mount, so the server cannot render
    // the selected text. The placeholder state follows the rendered text to avoid
    // a hydration mismatch; the client fills in the label on mount.
    expect(html).toContain("Select one");
    expect(html).toContain('data-placeholder="true"');
    expect(html).not.toContain("California");
    expect(html).not.toContain('data-slot="select-popover"');
  });

  it("associates the root Label with the trigger", async () => {
    const html = await renderSSR(createPage());
    const label = tagsOf(html, "label")[0] ?? "";
    const trigger = tagsOf(html, "select-trigger")[0] ?? "";
    const triggerId = idOf(trigger);

    expect(label).toBeTruthy();
    expect(triggerId).toBeTruthy();
    expect(label).toContain(`for="${triggerId}"`);
  });
});
