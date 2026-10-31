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
  renderSSR,
} from "@sail-ui/testing";

import AlertDialog from "../components/alert-dialog/alert-dialog-root.vue";
import AlertDialogBackdrop from "../components/alert-dialog/alert-dialog-backdrop.vue";
import AlertDialogBody from "../components/alert-dialog/alert-dialog-body.vue";
import AlertDialogCloseTrigger from "../components/alert-dialog/alert-dialog-close-trigger.vue";
import AlertDialogContainer from "../components/alert-dialog/alert-dialog-container.vue";
import AlertDialogDialog from "../components/alert-dialog/alert-dialog-dialog.vue";
import AlertDialogFooter from "../components/alert-dialog/alert-dialog-footer.vue";
import AlertDialogHeader from "../components/alert-dialog/alert-dialog-header.vue";
import AlertDialogHeading from "../components/alert-dialog/alert-dialog-heading.vue";
import AlertDialogIcon from "../components/alert-dialog/alert-dialog-icon.vue";
import AlertDialogTrigger from "../components/alert-dialog/alert-dialog-trigger.vue";
import Button from "../components/button/button.vue";
import Description from "../components/description/description.vue";
import Drawer from "../components/drawer/drawer-root.vue";
import DrawerBackdrop from "../components/drawer/drawer-backdrop.vue";
import DrawerBody from "../components/drawer/drawer-body.vue";
import DrawerCloseTrigger from "../components/drawer/drawer-close-trigger.vue";
import DrawerContent from "../components/drawer/drawer-content.vue";
import DrawerDialog from "../components/drawer/drawer-dialog.vue";
import DrawerFooter from "../components/drawer/drawer-footer.vue";
import DrawerHandle from "../components/drawer/drawer-handle.vue";
import DrawerHeader from "../components/drawer/drawer-header.vue";
import DrawerHeading from "../components/drawer/drawer-heading.vue";
import DrawerTrigger from "../components/drawer/drawer-trigger.vue";
import FieldError from "../components/field-error/field-error.vue";
import Input from "../components/input/input.vue";
import Label from "../components/label/label.vue";
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
import type {SelectModelValue} from "../components/select/types";
import Popover from "../components/popover/popover-root.vue";
import PopoverArrow from "../components/popover/popover-arrow.vue";
import PopoverContent from "../components/popover/popover-content.vue";
import PopoverDialog from "../components/popover/popover-dialog.vue";
import PopoverHeading from "../components/popover/popover-heading.vue";
import PopoverTrigger from "../components/popover/popover-trigger.vue";
import Sheet from "../components/sheet/sheet-root.vue";
import SheetBackdrop from "../components/sheet/sheet-backdrop.vue";
import SheetBody from "../components/sheet/sheet-body.vue";
import SheetCloseTrigger from "../components/sheet/sheet-close-trigger.vue";
import SheetContent from "../components/sheet/sheet-content.vue";
import SheetDialog from "../components/sheet/sheet-dialog.vue";
import SheetFooter from "../components/sheet/sheet-footer.vue";
import SheetHandle from "../components/sheet/sheet-handle.vue";
import SheetHeader from "../components/sheet/sheet-header.vue";
import SheetHeading from "../components/sheet/sheet-heading.vue";
import SheetTrigger from "../components/sheet/sheet-trigger.vue";
import ToastProvider from "../components/toast/toast-provider.vue";
import {ToastQueue} from "../components/toast/toast-queue";
import Tooltip from "../components/tooltip/tooltip-root.vue";
import TooltipArrow from "../components/tooltip/tooltip-arrow.vue";
import TooltipContent from "../components/tooltip/tooltip-content.vue";
import TooltipTrigger from "../components/tooltip/tooltip-trigger.vue";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};
const upstreamSlots = new Set(Object.values(slotSnapshot.components).flat());

const pointer = (element: Element, type: string, init: PointerEventInit = {}) => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerType: "mouse",
      pointerId: 1,
      ...init,
    }),
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
        h(
          Modal,
          {open: isOpen.value},
          {
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
                            default: () => [h(ModalHeading, null, {default: () => "Title"})],
                          }),
                          h(ModalBody, null, {default: () => "Body"}),
                          h(ModalFooter, null, {default: () => "Footer"}),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        );
    },
  });
}

function createAlertDialogHost(open: boolean) {
  return defineComponent({
    setup() {
      const isOpen = ref(open);

      return () =>
        h(
          AlertDialog,
          {open: isOpen.value},
          {
            default: () => [
              h(AlertDialogTrigger, null, {default: () => "Delete project"}),
              h(AlertDialogBackdrop, null, {
                default: () => [
                  h(AlertDialogContainer, null, {
                    default: () => [
                      h(AlertDialogDialog, null, {
                        default: () => [
                          h(AlertDialogCloseTrigger),
                          h(AlertDialogHeader, null, {
                            default: () => [
                              h(AlertDialogIcon, {status: "danger"}),
                              h(AlertDialogHeading, null, {default: () => "Delete project?"}),
                            ],
                          }),
                          h(AlertDialogBody, null, {default: () => "Body"}),
                          h(AlertDialogFooter, null, {default: () => "Footer"}),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        );
    },
  });
}

function createDrawerHost(open: boolean) {
  return defineComponent({
    setup() {
      const isOpen = ref(open);

      return () =>
        h(
          Drawer,
          {open: isOpen.value},
          {
            default: () => [
              h(DrawerTrigger, null, {default: () => "Open Drawer"}),
              h(DrawerBackdrop, null, {
                default: () => [
                  h(
                    DrawerContent,
                    {placement: "bottom"},
                    {
                      default: () => [
                        h(DrawerDialog, null, {
                          default: () => [
                            h(DrawerCloseTrigger),
                            h(DrawerHandle),
                            h(DrawerHeader, null, {
                              default: () => [h(DrawerHeading, null, {default: () => "Title"})],
                            }),
                            h(DrawerBody, null, {default: () => "Body"}),
                            h(DrawerFooter, null, {default: () => "Footer"}),
                          ],
                        }),
                      ],
                    },
                  ),
                ],
              }),
            ],
          },
        );
    },
  });
}

function createSheetHost(open: boolean) {
  return defineComponent({
    setup() {
      const isOpen = ref(open);

      return () =>
        h(
          Sheet,
          {open: isOpen.value, placement: "left"},
          {
            default: () => [
              h(SheetTrigger, null, {default: () => "Open Sheet"}),
              h(
                SheetBackdrop,
                {variant: "blur"},
                {
                  default: () => [
                    h(SheetContent, null, {
                      default: () => [
                        h(SheetDialog, null, {
                          default: () => [
                            h(SheetCloseTrigger),
                            h(SheetHandle),
                            h(SheetHeader, null, {
                              default: () => [h(SheetHeading, null, {default: () => "Title"})],
                            }),
                            h(SheetBody, null, {default: () => "Body"}),
                            h(SheetFooter, null, {default: () => "Footer"}),
                          ],
                        }),
                      ],
                    }),
                  ],
                },
              ),
            ],
          },
        );
    },
  });
}

function createPopoverHost() {
  return defineComponent({
    setup() {
      return () =>
        h(Popover, null, {
          default: () => [
            h(PopoverTrigger, null, {default: () => "Open Popover"}),
            h(PopoverContent, null, {
              default: () => [
                h(PopoverArrow),
                h(PopoverDialog, null, {
                  default: () => [
                    h(PopoverHeading, null, {default: () => "Popover title"}),
                    h("p", null, "Popover body"),
                  ],
                }),
              ],
            }),
          ],
        });
    },
  });
}

function createTooltipHost() {
  return defineComponent({
    setup() {
      return () =>
        h(
          Tooltip,
          {delay: 0, closeDelay: 0},
          {
            default: () => [
              h(TooltipTrigger, null, {default: () => "Tooltip trigger"}),
              h(
                TooltipContent,
                {showArrow: true},
                {
                  default: () => [h(TooltipArrow), "Tooltip body"],
                },
              ),
            ],
          },
        );
    },
  });
}

interface SelectHostOptions {
  disabledKeys?: string[];
  invalid?: boolean;
  selectionMode?: "single" | "multiple";
  value?: SelectModelValue;
}

function createSelectHost(options: SelectHostOptions = {}) {
  const states = [
    {id: "california", label: "California"},
    {id: "texas", label: "Texas"},
    {id: "florida", label: "Florida", disabled: true},
  ];

  return defineComponent({
    setup() {
      const value = ref<SelectModelValue | undefined>(options.value);

      return () =>
        h(
          Select,
          {
            disabledKeys: options.disabledKeys,
            isInvalid: options.invalid,
            modelValue: value.value,
            placeholder: "Select one",
            selectionMode: options.selectionMode,
          },
          {
            default: () => [
              h(
                SelectTrigger,
                {"aria-label": "State"},
                {
                  default: () => [h(SelectValue), h(SelectClearButton), h(SelectIndicator)],
                },
              ),
              h(SelectPopover, null, {
                default: () => [
                  h(SelectListBox, null, {
                    default: () =>
                      states.map((item) =>
                        h(
                          SelectItem,
                          {
                            key: item.id,
                            isDisabled: item.disabled,
                            textValue: item.label,
                            value: item.id,
                          },
                          {
                            default: () => [item.label, h(SelectItemIndicator)],
                          },
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
      slots: {default: () => "Delete"},
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
      slots: {default: () => "Saving"},
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
          h(
            TextField,
            {isInvalid: true},
            {
              default: () => [
                h(Label, null, {default: () => "Email"}),
                h(Input, {placeholder: "you@example.com"}),
                h(Description, null, {default: () => "We never share it."}),
                h(FieldError, null, {default: () => "Enter a valid email."}),
              ],
            },
          );
      },
    });
    const html = await renderSSR(host);

    expect(dataSlots(html)).toEqual(["textfield", "label", "input", "description", "field-error"]);
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
          h(
            TextField,
            {isDisabled: true},
            {
              default: () => [h(Label, null, {default: () => "Email"}), h(Input)],
            },
          );
      },
    });
    const html = await renderSSR(host);

    expect(dataAttributesOfSlot(html, "textfield")[0]).toHaveProperty("data-disabled");
    expect(dataAttributesOfSlot(html, "input")[0]).toHaveProperty("data-disabled");
    expect(html).toContain("disabled");
  });

  it("closed Modal renders only the trigger", async () => {
    const html = await renderSSR(createModalHost(false));

    expect(dataSlotsOfTag(html, "div")).toEqual(["modal-trigger"]);
    expectKnownSlots(html);
    expect(html).not.toContain('data-slot="modal-backdrop"');
    expect(html).not.toContain('data-slot="modal-dialog"');
  });

  it("open Modal keeps the overlay client-only on the server", async () => {
    // Reka's Teleport is client-only, so the server emits the trigger state but
    // never the overlay DOM. The full open contract is covered in jsdom.
    const html = await renderSSR(createModalHost(true));

    expect(dataSlotsOfTag(html, "div")).toEqual(["modal-trigger"]);
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
      "select-default-indicator",
    ]);
    expectKnownSlots(html);
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('data-placeholder="true"');
    expect(dataAttributesOfSlot(html, "select-trigger")[0]!["data-state"]).toBeUndefined();
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
          h(
            TextField,
            {isInvalid: true},
            {
              default: () => [h(Label, null, {default: () => "Email"}), h(Input)],
            },
          );
      },
    });
    const wrapper = mount(host, {attachTo: document.body});
    const textfield = wrapper.get('[data-slot="textfield"]');
    const input = wrapper.get('[data-slot="input"]');

    expect(textfield.attributes("data-invalid")).toBe("");
    expect(input.attributes("data-invalid")).toBe("true");

    (input.element as HTMLElement).focus();
    await nextTick();
    expect(textfield.attributes("data-focused")).toBe("");

    wrapper.unmount();
  });

  it("open Modal emits placement and entering on the overlay parts", async () => {
    const wrapper = mount(createModalHost(false), {attachTo: document.body});

    await wrapper.get('[data-slot="modal-trigger"]').trigger("click");
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
      "modal-trigger",
    ]);
    expectKnownSlots(html);

    const backdrop = dataAttributesOfSlot(html, "modal-backdrop")[0]!;
    const container = dataAttributesOfSlot(html, "modal-container")[0]!;
    const dialog = dataAttributesOfSlot(html, "modal-dialog")[0]!;
    const closeTrigger = document.querySelector<HTMLElement>('[data-slot="modal-close-trigger"]')!;

    expect(backdrop["data-entering"]).toBe("true");
    expect(container["data-entering"]).toBe("true");
    expect(container["data-placement"]).toBe("auto");
    expect(dialog["data-placement"]).toBe("auto");
    expect(document.querySelector('[data-slot="modal-dialog"]')?.getAttribute("aria-modal")).toBe(
      "true",
    );

    pointer(closeTrigger, "pointerenter");
    await nextTick();
    expect(closeTrigger.getAttribute("data-hovered")).toBe("true");

    wrapper.unmount();
    await nextTick();
  });

  it("open AlertDialog emits the alertdialog role, placement, entering, and status", async () => {
    const wrapper = mount(createAlertDialogHost(false), {attachTo: document.body});

    await wrapper.get('[data-slot="alert-dialog-trigger"]').trigger("click");
    await nextTick();

    const html = document.body.innerHTML;

    expect(dataSlots(html).sort()).toEqual([
      "alert-dialog-backdrop",
      "alert-dialog-body",
      "alert-dialog-close-trigger",
      "alert-dialog-container",
      "alert-dialog-default-icon",
      "alert-dialog-dialog",
      "alert-dialog-footer",
      "alert-dialog-header",
      "alert-dialog-heading",
      "alert-dialog-icon",
      "alert-dialog-trigger",
      "close-button-icon",
    ]);
    expectKnownSlots(html);

    const backdrop = dataAttributesOfSlot(html, "alert-dialog-backdrop")[0]!;
    const container = dataAttributesOfSlot(html, "alert-dialog-container")[0]!;
    const dialog = dataAttributesOfSlot(html, "alert-dialog-dialog")[0]!;
    const icon = document.querySelector<HTMLElement>('[data-slot="alert-dialog-icon"]')!;
    const closeTrigger = document.querySelector<HTMLElement>(
      '[data-slot="alert-dialog-close-trigger"]',
    )!;

    expect(backdrop["data-entering"]).toBe("true");
    expect(container["data-entering"]).toBe("true");
    expect(container["data-placement"]).toBe("auto");
    expect(dialog["data-placement"]).toBe("auto");
    expect(document.querySelector('[data-slot="alert-dialog-dialog"]')?.getAttribute("role")).toBe(
      "alertdialog",
    );
    expect(icon.className).toContain("alert-dialog__icon--danger");

    pointer(closeTrigger, "pointerenter");
    await nextTick();
    expect(closeTrigger.getAttribute("data-hovered")).toBe("true");

    wrapper.unmount();
    await nextTick();
  });

  it("open Drawer emits placement, entering, dialog semantics, and drag parts", async () => {
    const wrapper = mount(createDrawerHost(false), {attachTo: document.body});

    await wrapper.get('[data-slot="drawer-trigger"]').trigger("click");
    await nextTick();

    const html = document.body.innerHTML;

    expect(dataSlots(html).sort()).toEqual([
      "close-button-icon",
      "drawer-backdrop",
      "drawer-body",
      "drawer-close-trigger",
      "drawer-content",
      "drawer-dialog",
      "drawer-footer",
      "drawer-handle",
      "drawer-handle-bar",
      "drawer-header",
      "drawer-heading",
      "drawer-trigger",
    ]);
    expectKnownSlots(html);

    const backdrop = dataAttributesOfSlot(html, "drawer-backdrop")[0]!;
    const content = dataAttributesOfSlot(html, "drawer-content")[0]!;
    const dialog = dataAttributesOfSlot(html, "drawer-dialog")[0]!;
    const handle = document.querySelector<HTMLElement>('[data-slot="drawer-handle"]')!;
    const body = document.querySelector<HTMLElement>('[data-slot="drawer-body"]')!;

    expect(backdrop["data-entering"]).toBe("true");
    expect(content["data-entering"]).toBe("true");
    expect(content["data-placement"]).toBe("bottom");
    expect(dialog["data-placement"]).toBe("bottom");
    expect(document.querySelector('[data-slot="drawer-dialog"]')?.getAttribute("aria-modal")).toBe(
      "true",
    );
    expect(handle.getAttribute("aria-hidden")).toBe("true");
    expect(body.style.touchAction).toBe("pan-y");

    wrapper.unmount();
    await nextTick();
  });

  it("open Sheet emits overlay, placement, entering, and dialog semantics", async () => {
    const wrapper = mount(createSheetHost(false), {attachTo: document.body});

    await wrapper.get('[aria-haspopup="dialog"]').trigger("click");
    await nextTick();

    const html = document.body.innerHTML;

    expect(dataSlots(html).sort()).toEqual([
      "close-button-icon",
      "sheet-backdrop",
      "sheet-body",
      "sheet-close-trigger",
      "sheet-content",
      "sheet-dialog",
      "sheet-footer",
      "sheet-handle",
      "sheet-handle-bar",
      "sheet-header",
      "sheet-heading",
      "sheet-overlay",
    ]);
    expectKnownSlots(html);

    const overlay = dataAttributesOfSlot(html, "sheet-overlay")[0]!;
    const backdrop = dataAttributesOfSlot(html, "sheet-backdrop")[0]!;
    const content = dataAttributesOfSlot(html, "sheet-content")[0]!;
    const dialog = dataAttributesOfSlot(html, "sheet-dialog")[0]!;
    const handle = document.querySelector<HTMLElement>('[data-slot="sheet-handle"]')!;

    expect(overlay["data-entering"]).toBe("true");
    expect(backdrop["data-stack-index"]).toBe("0");
    expect(content["data-entering"]).toBe("true");
    expect(content["data-expanded"]).toBe("");
    expect(content["data-placement"]).toBe("left");
    expect(dialog["data-placement"]).toBe("left");
    expect(document.querySelector('[data-slot="sheet-dialog"]')?.getAttribute("aria-modal")).toBe(
      "true",
    );
    expect(handle.getAttribute("aria-hidden")).toBe("true");
    expect(handle.hasAttribute("data-sheet-handle")).toBe(true);

    const closeTrigger = document.querySelector<HTMLElement>('[data-slot="sheet-close-trigger"]')!;

    pointer(closeTrigger, "pointerenter");
    await nextTick();
    expect(closeTrigger.getAttribute("data-hovered")).toBe("true");

    // Reka autofocuses the first focusable part, so blur before re-focusing
    // to fire a fresh focus event under keyboard modality.
    closeTrigger.blur();
    await focusWithKeyboard(closeTrigger);
    expect(closeTrigger.getAttribute("data-focus-visible")).toBe("true");

    document.dispatchEvent(
      new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key: "Escape"}),
    );
    await nextTick();

    expect(
      document
        .querySelector<HTMLElement>('[data-slot="sheet-overlay"]')
        ?.hasAttribute("data-closed"),
    ).toBe(true);
    expect(
      document
        .querySelector<HTMLElement>('[data-slot="sheet-overlay"]')
        ?.getAttribute("data-exiting"),
    ).toBe("true");

    wrapper.unmount();
    await nextTick();
  });

  it("open Popover emits the trigger, dialog, heading, and arrow slots", async () => {
    const wrapper = mount(createPopoverHost(), {attachTo: document.body});
    const trigger = document.querySelector<HTMLElement>('[data-slot="popover-trigger"]')!;

    trigger.click();
    await nextTick();

    // `data-entering` ends on the first animation frame when no CSS animation
    // applies (jsdom), so assert it before yielding to timers or frames.
    expect(document.querySelector<HTMLElement>(".popover")?.getAttribute("data-entering")).toBe(
      "true",
    );

    await flushPromises();

    const html = document.body.innerHTML;
    const content = document.querySelector<HTMLElement>(".popover")!;
    const dialog = document.querySelector<HTMLElement>('[data-slot="popover-dialog"]')!;

    expect(dataSlots(html).sort()).toEqual([
      "popover-dialog",
      "popover-overlay-arrow",
      "popover-overlay-arrow-group",
      "popover-trigger",
    ]);
    expectKnownSlots(html);
    expect(content.getAttribute("data-placement")).toBe("bottom");
    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.classList.contains("popover__dialog")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);

    wrapper.unmount();
    await nextTick();
  });

  it("open Tooltip emits the trigger, arrow, and hidden tooltip role", async () => {
    const wrapper = mount(createTooltipHost(), {attachTo: document.body});
    const trigger = document.querySelector<HTMLElement>('[data-slot="tooltip-trigger"]')!;

    trigger.focus();
    await nextTick();

    // `data-entering` ends on the first animation frame when no CSS animation
    // applies (jsdom), so assert it before yielding to timers or frames.
    expect(document.querySelector<HTMLElement>(".tooltip")?.getAttribute("data-entering")).toBe(
      "true",
    );

    await flushPromises();

    const html = document.body.innerHTML;
    const content = document.querySelector<HTMLElement>(".tooltip")!;
    const describedBy = trigger.getAttribute("aria-describedby")!;

    expect(dataSlots(html).sort()).toEqual(["overlay-arrow", "tooltip-arrow", "tooltip-trigger"]);
    expectKnownSlots(html);
    expect(content.getAttribute("data-placement")).toBe("top");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy)?.getAttribute("role")).toBe("tooltip");

    wrapper.unmount();
    await nextTick();
  });

  it("open Select emits open, placement, entering, selected, hover, and focus states", async () => {
    const wrapper = mount(createSelectHost({value: "california"}), {
      attachTo: document.body,
    });

    await flushPromises();

    const trigger = document.querySelector<HTMLElement>('[data-slot="select-trigger"]')!;

    pointer(trigger, "pointerenter");
    await nextTick();
    expect(trigger.getAttribute("data-hovered")).toBe("true");

    await focusWithKeyboard(trigger);
    expect(trigger.getAttribute("data-focus-visible")).toBe("true");

    pointer(trigger, "pointerdown", {button: 0});
    await nextTick();

    const enteringPopover = document.querySelector<HTMLElement>('[data-slot="select-popover"]');

    expect(enteringPopover?.getAttribute("data-entering")).toBe("true");

    await flushPromises();

    expect(trigger.getAttribute("data-open")).toBe("true");

    const html = document.body.innerHTML;
    const popover = document.querySelector<HTMLElement>('[data-slot="select-popover"]')!;
    const listbox = popover.querySelector<HTMLElement>('[data-slot="list-box"]')!;
    const clearButton = document.querySelector<HTMLElement>('[data-slot="select-clear-button"]')!;
    const items = [...document.querySelectorAll<HTMLElement>('[data-slot="list-box-item"]')];
    const california = items.find((item) => item.textContent?.includes("California"))!;
    const florida = items.find((item) => item.textContent?.includes("Florida"))!;

    expectKnownSlots(html);
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger.getAttribute("aria-controls")).toBe(listbox.id);
    expect(popover.getAttribute("data-placement")).toBeTruthy();
    expect(popover.getAttribute("role")).toBeNull();
    expect(popover.getAttribute("data-state")).toBeNull();
    expect(listbox.getAttribute("role")).toBe("listbox");
    expect(listbox.getAttribute("aria-multiselectable")).toBeNull();
    expect(california.getAttribute("data-selected")).toBe("true");
    expect(california.getAttribute("data-selection-mode")).toBe("single");
    expect(california.getAttribute("data-state")).toBeNull();
    expect(florida.getAttribute("data-disabled")).toBe("true");
    expect(clearButton.hasAttribute("data-empty")).toBe(false);
    expect(california.hasAttribute("data-highlighted")).toBe(false);

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
    const clearButton = document.querySelector<HTMLElement>('[data-slot="select-clear-button"]')!;

    expect(value.getAttribute("data-placeholder")).toBe("true");
    expect(clearButton.getAttribute("data-empty")).toBe("true");

    wrapper.unmount();
  });

  it("Toast emits the region, stack, and toast state contract", async () => {
    const queue = new ToastQueue();
    const wrapper = mount(ToastProvider, {
      attachTo: document.body,
      props: {maxVisibleToasts: 1, queue},
    });

    queue.add({
      actionProps: {children: "Undo"},
      description: "Your changes have been saved.",
      title: "Saved",
      variant: "success",
    });
    const newestKey = queue.add({title: "Second"});
    await flushPromises();

    const region = document.querySelector<HTMLElement>('[data-slot="toast-region"]')!;
    const toasts = [...document.querySelectorAll<HTMLElement>('[data-slot="toast"]')];
    const newest = toasts[0]!;
    const oldest = toasts[1]!;

    expectKnownSlots(document.body.innerHTML);
    expect(region.getAttribute("role")).toBe("region");
    expect(region.getAttribute("aria-label")).toBe("2 notifications.");
    expect(region.getAttribute("data-slot")).toBe("toast-region");
    expect(region.hasAttribute("tabindex")).toBe(true);
    expect(newest.getAttribute("data-frontmost")).toBe("true");
    expect(newest.hasAttribute("data-hidden")).toBe(false);
    expect(newest.getAttribute("data-placement")).toBe("bottom");
    expect(oldest.getAttribute("data-hidden")).toBe("true");
    expect(oldest.hasAttribute("inert")).toBe(true);
    expect(document.querySelector('[data-slot="toast-action-button"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="toast-close"]')).not.toBeNull();

    pointer(newest, "pointerenter");
    await nextTick();
    expect(newest.getAttribute("data-hovered")).toBe("true");

    await focusWithKeyboard(newest);
    expect(newest.getAttribute("data-focus-visible")).toBe("true");

    document.dispatchEvent(
      new KeyboardEvent("keydown", {altKey: true, bubbles: true, cancelable: true, code: "KeyT"}),
    );
    await nextTick();
    expect(region.getAttribute("data-expanded")).toBe("true");

    queue.close(newestKey);
    await flushPromises();
    expect(newest.getAttribute("data-exiting")).toBe("true");

    const key = queue.add({isLoading: true, title: "Loading"}, {timeout: 0});

    await flushPromises();
    queue.update(key, {isLoading: false, title: "Settled"});
    await flushPromises();
    const indicator = document.querySelector<HTMLElement>('[data-slot="toast-indicator"]');

    expect(indicator?.getAttribute("data-swapped")).toBe("true");

    queue.add({title: "Entering"});
    await nextTick();
    expect(
      document
        .querySelector<HTMLElement>('[data-slot="toast"][data-frontmost="true"]')
        ?.getAttribute("data-entering"),
    ).toBe("true");

    wrapper.unmount();
    queue.destroy();
    await nextTick();
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
  alert: {
    asserted: ["data-slot"],
    gaps: {},
  },
  breadcrumbs: {
    asserted: ["data-current", "data-hovered"],
    gaps: {},
  },
  button: {
    asserted: [
      "data-focus-visible",
      "data-focused",
      "data-hovered",
      "data-pending",
      "data-pressed",
      "data-slot",
    ],
    gaps: {},
  },
  input: {
    asserted: ["data-disabled", "data-invalid"],
    gaps: {
      "data-focus-visible": "Negative guard in the hover rule; focus uses native :focus.",
      "data-focused": "Presence lives on the FieldRoot wrapper; .input relies on native :focus.",
      "data-hovered": "Native :hover fallback; Input does not run useHover.",
    },
  },
  textfield: {
    asserted: ["data-invalid", "data-slot"],
    gaps: {},
  },
  label: {
    asserted: ["data-disabled", "data-invalid", "data-slot"],
    gaps: {
      "data-required":
        "Label uses the label--required variant class; group roots own data-required.",
    },
  },
  description: {
    asserted: [],
    gaps: {},
  },
  "field-error": {
    asserted: ["data-slot"],
    gaps: {},
  },
  modal: {
    asserted: [
      "data-entering",
      "data-exiting",
      "data-focus-visible",
      "data-placement",
      "data-pressed",
    ],
    gaps: {
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
    },
  },
  "alert-dialog": {
    asserted: [
      "data-entering",
      "data-exiting",
      "data-focus-visible",
      "data-placement",
      "data-pressed",
      "data-slot",
    ],
    gaps: {
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
    },
  },
  drawer: {
    asserted: [
      "data-entering",
      "data-exiting",
      "data-focus-visible",
      "data-placement",
      "data-pressed",
      "data-slot",
    ],
    gaps: {
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
    },
  },
  sheet: {
    asserted: [
      "data-closed",
      "data-dragging",
      "data-expanded",
      "data-focus-visible",
      "data-hovered",
      "data-stack-index",
    ],
    gaps: {
      "data-detached": "Detached sheets are outside T05 scope; the attribute is omitted.",
      "data-entering":
        "Sheet CSS has no animation selectors; Sail drives entry with WAAPI and asserts the flag in the Sheet contract test.",
      "data-exiting":
        "Sheet CSS has no animation selectors; Sail drives the exit hold with WAAPI and asserts the flag in the Sheet contract test.",
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
      "data-handle-dragging":
        "Upstream writes it on the scroll-snap container; Sail drags the panel and marks the handle with data-dragging.",
      "data-has-descendants": "Stacked sheets are outside T05 scope.",
      "data-sheet-scroll":
        "React Aria's scroll container; Sail positions the panel inside a fixed overlay.",
      "data-slot":
        "Sheet CSS does not select on data-slot; the contract snapshot asserts the slots.",
      "data-snap-points": "Snap points are outside T05 scope.",
    },
  },
  "close-button": {
    asserted: [
      "data-focus-visible",
      "data-focused",
      "data-hovered",
      "data-pending",
      "data-pressed",
    ],
    gaps: {},
  },
  toast: {
    asserted: [
      "data-entering",
      "data-exiting",
      "data-expanded",
      "data-focus-visible",
      "data-frontmost",
      "data-hidden",
      "data-hovered",
      "data-slot",
      "data-swapped",
    ],
    gaps: {},
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
      "data-slot",
    ],
    gaps: {
      "data-disabled": "Native :disabled fallback on the trigger.",
      "data-exiting": "Transient exit flag; covered by the browser visual suite.",
      "data-focus": "Reka emits data-highlighted for the active item; compat aliases it.",
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
    },
  },
  "list-box": {
    asserted: ["data-slot"],
    gaps: {
      "data-orientation": "Applied to separator children; the contract fixture has no separator.",
    },
  },
  "list-box-item": {
    asserted: ["data-disabled", "data-focused", "data-hovered", "data-selected", "data-slot"],
    gaps: {
      "data-focus": "Reka emits data-highlighted for the active item; compat aliases it.",
      "data-focus-visible":
        "jsdom does not report :focus-visible for role=option divs (browser suite).",
      "data-pressed": "Native :active fallback; SelectItem does not run usePress.",
    },
  },
  link: {
    asserted: [
      "data-default-icon",
      "data-focus-visible",
      "data-focused",
      "data-hovered",
      "data-pressed",
    ],
    gaps: {},
  },
  "progress-bar": {
    asserted: ["data-disabled", "data-slot"],
    gaps: {},
  },
  "progress-circle": {
    asserted: ["data-disabled"],
    gaps: {},
  },
  "button-group": {
    asserted: [],
    gaps: {
      "data-focus-visible":
        "Descendant selector: the group only raises the z-index of a focused button.",
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
      "data-pressed": "Descendant selector: the pressed state belongs to the buttons of the group.",
    },
  },
  checkbox: {
    asserted: [
      "data-disabled",
      "data-focus-visible",
      "data-hovered",
      "data-indeterminate",
      "data-invalid",
      "data-pressed",
      "data-selected",
      "data-slot",
    ],
    gaps: {
      "data-focused": "The upstream CSS does not read the focus state of a checkbox.",
    },
  },
  "checkbox-group": {
    asserted: ["data-slot"],
    gaps: {},
  },
  radio: {
    asserted: [
      "data-disabled",
      "data-focus-visible",
      "data-hovered",
      "data-pressed",
      "data-selected",
      "data-slot",
    ],
    gaps: {
      "data-focused": "The upstream CSS does not read the focus state of a radio.",
      "data-invalid": "The invalid state is inherited from the radio group and asserted there.",
    },
  },
  "radio-group": {
    asserted: ["data-orientation", "data-selected", "data-slot"],
    gaps: {
      "data-hovered": "Descendant selector: the hover state belongs to the radio content.",
    },
  },
  switch: {
    asserted: [
      "data-disabled",
      "data-focus-visible",
      "data-hovered",
      "data-pressed",
      "data-selected",
      "data-slot",
    ],
    gaps: {
      "data-focused": "The upstream CSS does not read the focus state of a switch.",
      "data-invalid": "The invalid state is only rendered by the field context of the switch.",
    },
  },
  "switch-group": {
    asserted: [],
    gaps: {},
  },
  "input-group": {
    asserted: ["data-disabled", "data-focus-within", "data-hovered", "data-invalid", "data-slot"],
    gaps: {},
  },
  "search-field": {
    asserted: [
      "data-disabled",
      "data-empty",
      "data-focus-within",
      "data-hovered",
      "data-invalid",
      "data-slot",
    ],
    gaps: {},
  },
  "number-field": {
    asserted: ["data-disabled", "data-focus-within", "data-hovered", "data-pressed", "data-slot"],
    gaps: {
      "data-invalid":
        "The upstream component never marks the group invalid; the root carries the state.",
    },
  },
  slider: {
    asserted: [
      "data-direction",
      "data-dragging",
      "data-fill-end",
      "data-fill-start",
      "data-orientation",
      "data-slot",
    ],
    gaps: {
      "data-disabled": "Disabled sliders mark the thumb and the root, not the track.",
      "data-filled": "Only the decorative step and mark indicators use it.",
      "data-focus-visible": "The focus ring of the thumb is asserted by the browser suite.",
    },
  },
  textarea: {
    asserted: [
      "data-disabled",
      "data-focus-visible",
      "data-focused",
      "data-hovered",
      "data-invalid",
    ],
    gaps: {},
  },
  "toggle-button": {
    asserted: [
      "data-focus-visible",
      "data-focused",
      "data-hovered",
      "data-pressed",
      "data-selected",
    ],
    gaps: {},
  },
  "toggle-button-group": {
    asserted: [],
    gaps: {
      "data-focus-visible":
        "Descendant selector: the group only changes the ring inset of a focused button.",
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
      "data-pressed": "Descendant selector: the pressed state belongs to the buttons of the group.",
    },
  },
  toolbar: {
    asserted: [],
    gaps: {},
  },
  popover: {
    asserted: [
      "data-entering",
      "data-exiting",
      "data-focus-visible",
      "data-placement",
      "data-slot",
    ],
    gaps: {
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
    },
  },
  tooltip: {
    asserted: [
      "data-entering",
      "data-exiting",
      "data-focus-visible",
      "data-placement",
      "data-slot",
    ],
    gaps: {
      "data-focused": "Negative guard: :focus-visible is scoped with :not([data-focused]).",
    },
  },
};

describe("CSS state attribute coverage", () => {
  it("classifies every state attribute used by the spike component CSS", () => {
    for (const [component, coverage] of Object.entries(STATE_COVERAGE)) {
      const css = readFileSync(
        join(stylesRoot, "upstream", "components", `${component}.css`),
        "utf8",
      );
      const used = dataAttributesInCss(css);
      const documented = new Set([...coverage.asserted, ...Object.keys(coverage.gaps)]);

      expect(
        used.filter((attribute) => !documented.has(attribute)),
        `${component} has an unclassified state attribute`,
      ).toEqual([]);
      expect(
        coverage.asserted.filter((attribute) => !used.includes(attribute)),
        `${component} asserts an attribute the CSS does not use`,
      ).toEqual([]);

      for (const reason of Object.values(coverage.gaps)) {
        expect(reason.length, component).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the compat alias that turns Reka highlighting into data-focus", () => {
    const select = readFileSync(join(stylesRoot, "generated", "components", "select.css"), "utf8");
    const listBoxItem = readFileSync(
      join(stylesRoot, "generated", "components", "list-box-item.css"),
      "utf8",
    );

    expect(select).toContain("[data-highlighted]");
    expect(listBoxItem).toContain("[data-highlighted]");
  });
});
