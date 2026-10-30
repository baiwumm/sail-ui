import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h, ref} from "vue";

import Button from "../components/button/button.vue";
import Description from "../components/description/description.vue";
import Input from "../components/input/input.vue";
import Label from "../components/label/label.vue";
import TextField from "../components/input/text-field.vue";
import Modal from "../components/modal/modal-root.vue";
import ModalBackdrop from "../components/modal/modal-backdrop.vue";
import ModalBody from "../components/modal/modal-body.vue";
import ModalDialog from "../components/modal/modal-dialog.vue";
import ModalHeading from "../components/modal/modal-heading.vue";
import ModalTrigger from "../components/modal/modal-trigger.vue";
import SelectIndicator from "../components/select/select-indicator.vue";
import SelectItem from "../components/select/select-item.vue";
import SelectListBox from "../components/select/select-list-box.vue";
import SelectPopover from "../components/select/select-popover.vue";
import Select from "../components/select/select-root.vue";
import SelectTrigger from "../components/select/select-trigger.vue";
import SelectValue from "../components/select/select-value.vue";

const Page = defineComponent({
  setup() {
    const name = ref("Ada");
    const state = ref<string | undefined>("california");
    const open = ref(false);

    return () =>
      h("main", [
        h(Button, {variant: "primary"}, {default: () => "SSR Button"}),
        h(
          TextField,
          {fullWidth: true},
          {
            default: () => [
              h(Label, null, {default: () => "Name"}),
              h(Input, {modelValue: name.value, placeholder: "Your name"}),
              h(Description, null, {default: () => "Displayed on your profile."}),
            ],
          },
        ),
        h(
          Modal,
          {open: open.value},
          {
            default: () => [
              h(ModalTrigger, null, {default: () => "Open Modal"}),
              h(ModalBackdrop, null, {
                default: () => [
                  h(ModalDialog, null, {
                    default: () => [
                      h(ModalHeading, null, {default: () => "SSR modal"}),
                      h(ModalBody, null, {default: () => "Body"}),
                    ],
                  }),
                ],
              }),
            ],
          },
        ),
        h(
          Select,
          {modelValue: state.value, placeholder: "Select one"},
          {
            default: () => [
              h(
                SelectTrigger,
                {"aria-label": "State"},
                {
                  default: () => [h(SelectValue), h(SelectIndicator)],
                },
              ),
              h(SelectPopover, null, {
                default: () => [
                  h(SelectListBox, null, {
                    default: () => [
                      h(
                        SelectItem,
                        {textValue: "California", value: "california"},
                        {
                          default: () => "California",
                        },
                      ),
                      h(
                        SelectItem,
                        {textValue: "Texas", value: "texas"},
                        {
                          default: () => "Texas",
                        },
                      ),
                    ],
                  }),
                ],
              }),
            ],
          },
        ),
      ]);
  },
});

describe("SSR", () => {
  it("renders closed overlays without portal DOM", async () => {
    const html = await renderSSR(Page);

    expect(html).toContain('data-slot="button"');
    expect(html).toContain('data-slot="textfield"');
    expect(html).toContain('data-slot="input"');
    expect(html).toContain('data-slot="modal-trigger"');
    expect(html).not.toContain('data-slot="modal-backdrop"');
    expect(html).not.toContain('data-slot="modal-dialog"');
    expect(html).toContain('data-slot="select-trigger"');
    expect(html).not.toContain('data-slot="select-popover"');
    expect(html).not.toContain('role="listbox"');
  });

  it("is deterministic across renders", async () => {
    const first = await renderSSR(Page);
    const second = await renderSSR(Page);

    expect(second).toBe(first);
  });
});
