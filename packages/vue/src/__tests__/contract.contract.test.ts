import {dataSlots, dataSlotsOfTag, renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h, ref} from "vue";

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

function createSelectHost() {
  const states = [
    {id: "california", label: "California"},
    {id: "texas", label: "Texas"}
  ];

  return defineComponent({
    setup() {
      const value = ref<string | undefined>(undefined);

      return () =>
        h(Select, {modelValue: value.value, placeholder: "Select one"}, {
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
                      h(SelectItem, {key: item.id, textValue: item.label, value: item.id}, {
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

describe("contract snapshots", () => {
  it("Button exposes the upstream data-slot and variant classes", async () => {
    const html = await renderSSR(Button, {
      props: {size: "lg", variant: "danger"},
      slots: {default: () => "Delete"}
    });

    expect(dataSlots(html)).toEqual(["button"]);
    expect(html).toContain("button--danger");
    expect(html).toContain("button--lg");
    expect(html).toContain('type="button"');
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
    expect(html).toContain('type="text"');
    expect(html).toContain('data-visible="true"');
  });

  it("closed Modal renders only the trigger", async () => {
    const html = await renderSSR(createModalHost(false));

    expect(dataSlotsOfTag(html, "button")).toEqual(["modal-trigger"]);
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
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('data-placeholder="true"');
    expect(html).not.toContain('data-slot="select-popover"');
    expect(html).not.toContain('role="listbox"');
  });
});
