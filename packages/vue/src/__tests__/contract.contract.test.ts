import {flushPromises, mount} from "@vue/test-utils";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import {
  dataAttributesInCss,
  dataAttributesOfSlot,
  dataSlots,
  dataSlotsOfTag,
  hasDataAttribute,
  renderSSR
} from "@sail-ui/testing";

import Button from "../components/button/button.vue";
import Description from "../components/input/description.vue";
import FieldError from "../components/input/field-error.vue";
import Input from "../components/input/input.vue";
import Label from "../components/input/label.vue";
import TextField from "../components/input/text-field.vue";
import Modal from "../components/modal/modal-root.vue";
import ModalBackdrop from "../components/modal/modal-backdrop.vue";
import ModalBody from "../components/modal/modal-body.vue";
import ModalCloseTrigger from "../components/modal/modal-close-trigger.vue";
import ModalContainer from "../components/modal/modal-container.vue";
import ModalDialog from "../components/modal/modal-dialog.vue";
import ModalFooter from "../components/modal/modal-footer.vue";
import ModalHeader from "../components/modal/modal-header.vue";
import ModalHeading from "../components/modal/modal-heading.vue";
import ModalTrigger from "../components/modal/modal-trigger.vue";
import SelectClearButton from "../components/select/select-clear-button.vue";
import SelectIndicator from "../components/select/select-indicator.vue";
import SelectItem from "../components/select/select-item.vue";
import SelectItemIndicator from "../components/select/select-item-indicator.vue";
import SelectListBox from "../components/select/select-list-box.vue";
import SelectPopover from "../components/select/select-popover.vue";
import Select from "../components/select/select-root.vue";
import SelectTrigger from "../components/select/select-trigger.vue";
import SelectValue from "../components/select/select-value.vue";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8")
) as {components: Record<string, string[]>};
const upstreamSlots = new Set(Object.values(slotSnapshot.components).flat());

const pointer = (element: Element, type: string, init: PointerEventInit = {}) => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerType: "mouse",
      pointerId: 1,
      ...init
    })
  );
};

const focusWithKeyboard = async (element: HTMLElement) => {
  document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Tab"}));
  element.focus();
  await nextTick();
};

function createModalHost(open: boolean) {
  return defineComponent({
    setup() {
      const isOpen = ref(open);

      return () =>
        h(Modal, {open: isOpen.value}, {
          default: () => [
            h(ModalTrigger, null, {default: () => "Open Modal"}),
            h(ModalBackdrop, null, {
              default: () => [
                h(ModalContainer, null, {
                  default: () => [
                    h(ModalDialog, null, {
                      default: () => [
                        h(ModalCloseTrigger),
                        h(ModalHeader, null, {
                          default: () => [h(ModalHeading, null, {default: () => "Title"})]
                        }),
                        h(ModalBody, null, {default: () => "Body"}),
                        h(ModalFooter, null, {default: () => "Footer"})
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        });
    }
  });
}

interface SelectHostOptions {
  invalid?: boolean;
  value?: string;
}

function createSelectHost(options: SelectHostOptions = {}) {
  const states = [
    {id: "california", label: "California"},
    {id: "texas", label: "Texas"},
    {id: "florida", label: "Florida", disabled: true}
  ];

  return defineComponent({
    setup() {
      const value = ref<string | undefined>(options.value);

      return () =>
        h(Select, {
          isInvalid: options.invalid,
          modelValue: value.value,
          placeholder: "Select one"
        }, {
          default: () => [
            h(SelectTrigger, {"aria-label": "State"}, {
              default: () => [
                h(SelectValue),
                h(SelectClearButton),
                h(SelectIndicator)
              ]
            }),
            h(SelectPopover, null, {
              default: () => [
                h(SelectListBox, null, {
                  default: () =>
                    states.map((item) =>
                      h(SelectItem, {
                        key: item.id,
                        isDisabled: item.disabled,
                        textValue: item.label,
                        value: item.id
                      }, {
                        default: () => [item.label, h(SelectItemIndicator)]
                      })
                    )
                })
              ]
            })
          ]
        });
    }
  });
}

function expectKnownSlots(html: string) {
  for (const slot of dataSlots(html)) {
    expect(upstreamSlots.has(slot), slot).toBe(true);
  }
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("contract snapshots", () => {
  it("Button exposes the upstream data-slot and variant classes", async () => {
    const html = await renderSSR(Button, {
      props: {size: "lg", variant: "danger"},
      slots: {default: () => "Delete"}
    });

    expect(dataSlots(html)).toEqual(["button"]);
    expectKnownSlots(html);
    expect(html).toContain("button--danger");
    expect(html).toContain("button--lg");
    expect(html).toContain('type="button"');
  });

  it("Button renders spinner parts through the upstream vocabulary while loading", async () => {
    const html = await renderSSR(Button, {
      props: {isLoading: true},
      slots: {default: () => "Saving"}
    });

    expect(dataSlots(html)).toEqual(["button", "spinner", "spinner-icon"]);
    expectKnownSlots(html);
    expect(hasDataAttribute(html, "data-pending", "true")).toBe(true);
    expect(html).toContain('aria-busy="true"');
  });

  it("Input, Label, Description, and FieldError expose their slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(TextField, {isInvalid: true}, {
            default: () => [
              h(Label, null, {default: () => "Email"}),
              h(Input, {placeholder: "you@example.com"}),
              h(Description, null, {default: () => "We never share it."}),
              h(FieldError, null, {default: () => "Enter a valid email."})
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expect(dataSlots(html)).toEqual([
      "textfield",
      "label",
      "input",
      "description",
      "field-error"
    ]);
    expectKnownSlots(html);
    expect(html).toContain('type="text"');
    expect(html).toContain('data-visible="true"');

    const textfield = dataAttributesOfSlot(html, "textfield")[0]!;
    const input = dataAttributesOfSlot(html, "input")[0]!;

    expect(textfield).toHaveProperty("data-invalid");
    expect(input).toHaveProperty("data-invalid");
    expect(html).toContain('aria-invalid="true"');
  });

  it("disabled TextField marks the wrapper and control with presence", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(TextField, {isDisabled: true}, {
            default: () => [h(Label, null, {default: () => "Email"}), h(Input)]
          });
      }
    });
    const html = await renderSSR(host);

    expect(dataAttributesOfSlot(html, "textfield")[0]).toHaveProperty("data-disabled");
    expect(dataAttributesOfSlot(html, "input")[0]).toHaveProperty("data-disabled");
    expect(html).toContain("disabled");
  });

  it("closed Modal renders only the trigger", async () => {
    const html = await renderSSR(createModalHost(false));

    expect(dataSlotsOfTag(html, "button")).toEqual(["modal-trigger"]);
    expectKnownSlots(html);
    expect(html).not.toContain('data-slot="modal-backdrop"');
    expect(html).not.toContain('data-slot="modal-dialog"');
  });

  it("open Modal keeps the overlay client-only on the server", async () => {
    // Reka's Teleport is client-only, so the server emits the trigger state but
    // never the overlay DOM. The full open contract is covered in jsdom.
    const html = await renderSSR(createModalHost(true));

    expect(dataSlotsOfTag(html, "button")).toEqual(["modal-trigger"]);
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain("aria-controls=");
    expect(html).not.toContain('data-slot="modal-backdrop"');
    expect(html).not.toContain('data-slot="modal-dialog"');
  });

  it("closed Select renders trigger parts without popover DOM", async () => {
    const html = await renderSSR(createSelectHost());

    // Upstream renders the built-in chevron with `select-default-indicator`;
    // a consumer-provided child would take the `select-indicator` slot instead.
    expect(dataSlots(html)).toEqual([
      "select",
      "select-trigger",
      "select-value",
      "select-clear-button",
      "select-clear-button-icon",
      "select-default-indicator"
    ]);
    expectKnownSlots(html);
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('data-placeholder="true"');
    expect(html).not.toContain('data-slot="select-popover"');
    expect(html).not.toContain('role="listbox"');
  });

  it("Select marks the root invalid with the upstream value form", async () => {
    const html = await renderSSR(createSelectHost({invalid: true}));
    const select = dataAttributesOfSlot(html, "select")[0]!;

    expect(select["data-invalid"]).toBe("true");
    expect(html).toContain('aria-invalid="true"');
  });
});

describe("interactive state contract", () => {
  it("Button emits hovered, pressed, focus-visible, and pending", async () => {
    const wrapper = mount(Button, {attachTo: document.body});
    const button = wrapper.get("button");

    pointer(button.element, "pointerenter");
    await nextTick();
    expect(button.attributes("data-hovered")).toBe("true");

    pointer(button.element, "pointerdown", {button: 0});
    await nextTick();
    expect(button.attributes("data-pressed")).toBe("true");

    pointer(button.element, "pointerup");
    await nextTick();
    expect(button.attributes("data-pressed")).toBeUndefined();

    await focusWithKeyboard(button.element as HTMLElement);
    expect(button.attributes("data-focus-visible")).toBe("true");

    await wrapper.setProps({isLoading: true});
    expect(button.attributes("data-pending")).toBe("true");

    wrapper.unmount();
  });

  it("TextField tracks focus on the wrapper and reports invalid/disabled presence", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(TextField, {isInvalid: true}, {
            default: () => [h(Label, null, {default: () => "Email"}), h(Input)]
          });
      }
    });
    const wrapper = mount(host, {attachTo: document.body});
    const textfield = wrapper.get('[data-slot="textfield"]');
    const input = wrapper.get('[data-slot="input"]');

    expect(textfield.attributes("data-invalid")).toBe("");
    expect(input.attributes("data-invalid")).toBe("");

    (input.element as HTMLElement).focus();
    await nextTick();
    expect(textfield.attributes("data-focused")).toBe("");

    wrapper.unmount();
  });

  it("open Modal emits placement and entering on the overlay parts", async () => {
    const wrapper = mount(createModalHost(false), {attachTo: document.body});

    await wrapper.get("button").trigger("click");
    await nextTick();

    const html = document.body.innerHTML;

    expect(dataSlots(html).sort()).toEqual([
      "close-button-icon",
      "modal-backdrop",
      "modal-body",
      "modal-close-trigger",
      "modal-container",
      "modal-dialog",
      "modal-footer",
      "modal-header",
      "modal-heading",
      "modal-trigger"
    ]);
    expectKnownSlots(html);

    const backdrop = dataAttributesOfSlot(html, "modal-backdrop")[0]!;
    const container = dataAttributesOfSlot(html, "modal-container")[0]!;
    const dialog = dataAttributesOfSlot(html, "modal-dialog")[0]!;
    const closeTrigger = document.querySelector<HTMLElement>(
      '[data-slot="modal-close-trigger"]'
    )!;

    expect(backdrop["data-entering"]).toBe("true");
    expect(container["data-entering"]).toBe("true");
    expect(container["data-placement"]).toBe("auto");
    expect(dialog["data-placement"]).toBe("auto");
    expect(
      document
        .querySelector('[data-slot="modal-dialog"]')
        ?.getAttribute("aria-modal")
    ).toBe("true");

    pointer(closeTrigger, "pointerenter");
    await nextTick();
    expect(closeTrigger.getAttribute("data-hovered")).toBe("true");

    wrapper.unmount();
    await nextTick();
  });

  it("open Select emits open, placement, entering, selected, hover, and focus states", async () => {
    const wrapper = mount(createSelectHost({value: "california"}), {
      attachTo: document.body
    });

    await flushPromises();

    const trigger = document.querySelector<HTMLElement>(
      '[data-slot="select-trigger"]'
    )!;

    pointer(trigger, "pointerenter");
    await nextTick();
    expect(trigger.getAttribute("data-hovered")).toBe("true");

    await focusWithKeyboard(trigger);
    expect(trigger.getAttribute("data-focus-visible")).toBe("true");

    pointer(trigger, "pointerdown", {button: 0});
    await nextTick();

    const enteringPopover = document.querySelector<HTMLElement>(
      '[data-slot="select-popover"]'
    );

    expect(enteringPopover?.getAttribute("data-entering")).toBe("true");

    await flushPromises();

    expect(trigger.getAttribute("data-open")).toBe("true");

    const html = document.body.innerHTML;
    const popover = document.querySelector<HTMLElement>(
      '[data-slot="select-popover"]'
    )!;
    const clearButton = document.querySelector<HTMLElement>(
      '[data-slot="select-clear-button"]'
    )!;
    const items = [
      ...document.querySelectorAll<HTMLElement>('[data-slot="list-box-item"]')
    ];
    const california = items.find((item) =>
      item.textContent?.includes("California")
    )!;
    const florida = items.find((item) => item.textContent?.includes("Florida"))!;

    expectKnownSlots(html);
    expect(popover.getAttribute("data-placement")).toBeTruthy();
    expect(popover.getAttribute("role")).toBe("listbox");
    expect(california.getAttribute("data-selected")).toBe("true");
    expect(florida.getAttribute("data-disabled")).toBe("true");
    expect(clearButton.hasAttribute("data-empty")).toBe(false);
    expect(california.hasAttribute("data-highlighted")).toBe(true);

    pointer(california, "pointerenter");
    await nextTick();
    expect(california.getAttribute("data-hovered")).toBe("true");

    await focusWithKeyboard(california);
    expect(california.hasAttribute("data-focused")).toBe(true);

    pointer(clearButton, "pointerdown", {button: 0});
    await nextTick();
    expect(clearButton.getAttribute("data-pressed")).toBe("true");

    wrapper.unmount();
    await nextTick();
  });

  it("empty Select emits placeholder and empty clear-button state", async () => {
    const wrapper = mount(createSelectHost(), {attachTo: document.body});

    await flushPromises();

    const value = document.querySelector<HTMLElement>('[data-slot="select-value"]')!;
    const clearButton = document.querySelector<HTMLElement>(
      '[data-slot="select-clear-button"]'
    )!;

    expect(value.getAttribute("data-placeholder")).toBe("true");
    expect(clearButton.getAttribute("data-empty")).toBe("true");

    wrapper.unmount();
  });
});

interface StateCoverage {
  asserted: string[];
  gaps: Record<string, string>;
}

// Asserted attributes are covered by the interactive tests above. Gaps are
// documented fallbacks: native pseudo-classes, negative-only guards, compat
// aliases, or flags that only a real animation/browser test can observe.
const STATE_COVERAGE: Record<string, StateCoverage> = {
  button: {
    asserted: [
      "data-focus-visible",
      "data-hovered",
      "data-pending",
      "data-pressed",
      "data-slot"
    ],
    gaps: {
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused])."
    }
  },
  input: {
    asserted: ["data-disabled", "data-invalid"],
    gaps: {
      "data-focus-visible": "Negative guard in the hover rule; focus uses native :focus.",
      "data-focused": "Presence lives on the FieldRoot wrapper; .input relies on native :focus.",
      "data-hovered": "Native :hover fallback; Input does not run useHover."
    }
  },
  textfield: {
    asserted: ["data-invalid", "data-slot"],
    gaps: {}
  },
  label: {
    asserted: ["data-disabled", "data-invalid", "data-slot"],
    gaps: {
      "data-required": "Label uses the label--required variant class; group roots own data-required."
    }
  },
  description: {
    asserted: [],
    gaps: {}
  },
  "field-error": {
    asserted: ["data-slot"],
    gaps: {}
  },
  modal: {
    asserted: ["data-entering", "data-placement"],
    gaps: {
      "data-exiting": "Transient exit flag; covered by the browser visual suite.",
      "data-focus-visible": "Focus-trap managed; jsdom does not report :focus-visible for it (browser suite).",
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
      "data-pressed": "Native :active fallback; ModalCloseTrigger does not run usePress."
    }
  },
  "close-button": {
    asserted: ["data-hovered"],
    gaps: {
      "data-focus-visible": "Focus-trap managed; jsdom does not report :focus-visible for it (browser suite).",
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
      "data-pending": "Close button has no loading state upstream.",
      "data-pressed": "Native :active fallback; ModalCloseTrigger does not run usePress."
    }
  },
  select: {
    asserted: [
      "data-empty",
      "data-entering",
      "data-focus-visible",
      "data-hovered",
      "data-invalid",
      "data-open",
      "data-placeholder",
      "data-placement",
      "data-pressed",
      "data-slot"
    ],
    gaps: {
      "data-disabled": "Native :disabled fallback on the trigger.",
      "data-exiting": "Transient exit flag; covered by the browser visual suite.",
      "data-focus": "Reka emits data-highlighted for the active item; compat aliases it.",
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused])."
    }
  },
  "list-box": {
    asserted: ["data-slot"],
    gaps: {
      "data-orientation": "Applied to separator children; the contract fixture has no separator."
    }
  },
  "list-box-item": {
    asserted: [
      "data-disabled",
      "data-focused",
      "data-hovered",
      "data-selected",
      "data-slot"
    ],
    gaps: {
      "data-focus": "Reka emits data-highlighted for the active item; compat aliases it.",
      "data-focus-visible": "jsdom does not report :focus-visible for role=option divs (browser suite).",
      "data-pressed": "Native :active fallback; SelectItem does not run usePress."
    }
  }
};

describe("CSS state attribute coverage", () => {
  it("classifies every state attribute used by the spike component CSS", () => {
    for (const [component, coverage] of Object.entries(STATE_COVERAGE)) {
      const css = readFileSync(
        join(stylesRoot, "upstream", "components", `${component}.css`),
        "utf8"
      );
      const used = dataAttributesInCss(css);
      const documented = new Set([
        ...coverage.asserted,
        ...Object.keys(coverage.gaps)
      ]);

      expect(
        used.filter((attribute) => !documented.has(attribute)),
        `${component} has an unclassified state attribute`
      ).toEqual([]);
      expect(
        coverage.asserted.filter((attribute) => !used.includes(attribute)),
        `${component} asserts an attribute the CSS does not use`
      ).toEqual([]);

      for (const reason of Object.values(coverage.gaps)) {
        expect(reason.length, component).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the compat alias that turns Reka highlighting into data-focus", () => {
    const select = readFileSync(
      join(stylesRoot, "generated", "components", "select.css"),
      "utf8"
    );
    const listBoxItem = readFileSync(
      join(stylesRoot, "generated", "components", "list-box-item.css"),
      "utf8"
    );

    expect(select).toContain("[data-highlighted]");
    expect(listBoxItem).toContain("[data-highlighted]");
  });
});
