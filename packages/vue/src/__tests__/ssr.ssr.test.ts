import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h, ref} from "vue";

import AlertDialog from "../components/alert-dialog/alert-dialog-root.vue";
import AlertDialogBackdrop from "../components/alert-dialog/alert-dialog-backdrop.vue";
import AlertDialogBody from "../components/alert-dialog/alert-dialog-body.vue";
import AlertDialogDialog from "../components/alert-dialog/alert-dialog-dialog.vue";
import AlertDialogHeading from "../components/alert-dialog/alert-dialog-heading.vue";
import AlertDialogTrigger from "../components/alert-dialog/alert-dialog-trigger.vue";
import Button from "../components/button/button.vue";
import Description from "../components/description/description.vue";
import Drawer from "../components/drawer/drawer-root.vue";
import DrawerBackdrop from "../components/drawer/drawer-backdrop.vue";
import DrawerBody from "../components/drawer/drawer-body.vue";
import DrawerContent from "../components/drawer/drawer-content.vue";
import DrawerDialog from "../components/drawer/drawer-dialog.vue";
import DrawerHandle from "../components/drawer/drawer-handle.vue";
import DrawerHeading from "../components/drawer/drawer-heading.vue";
import DrawerTrigger from "../components/drawer/drawer-trigger.vue";
import ToastProvider from "../components/toast/toast-provider.vue";
import {ToastQueue} from "../components/toast/toast-queue";
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
import Popover from "../components/popover/popover-root.vue";
import PopoverContent from "../components/popover/popover-content.vue";
import PopoverDialog from "../components/popover/popover-dialog.vue";
import PopoverTrigger from "../components/popover/popover-trigger.vue";
import Sheet from "../components/sheet/sheet-root.vue";
import SheetBackdrop from "../components/sheet/sheet-backdrop.vue";
import SheetBody from "../components/sheet/sheet-body.vue";
import SheetCloseTrigger from "../components/sheet/sheet-close-trigger.vue";
import SheetContent from "../components/sheet/sheet-content.vue";
import SheetDialog from "../components/sheet/sheet-dialog.vue";
import SheetHandle from "../components/sheet/sheet-handle.vue";
import SheetHeading from "../components/sheet/sheet-heading.vue";
import SheetTrigger from "../components/sheet/sheet-trigger.vue";
import Tooltip from "../components/tooltip/tooltip-root.vue";
import TooltipContent from "../components/tooltip/tooltip-content.vue";
import TooltipTrigger from "../components/tooltip/tooltip-trigger.vue";

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
          AlertDialog,
          {open: false},
          {
            default: () => [
              h(AlertDialogTrigger, null, {default: () => "Delete project"}),
              h(AlertDialogBackdrop, null, {
                default: () => [
                  h(AlertDialogDialog, null, {
                    default: () => [
                      h(AlertDialogHeading, null, {default: () => "SSR alert dialog"}),
                      h(AlertDialogBody, null, {default: () => "Body"}),
                    ],
                  }),
                ],
              }),
            ],
          },
        ),
        h(
          Drawer,
          {open: false},
          {
            default: () => [
              h(DrawerTrigger, null, {default: () => "Open Drawer"}),
              h(DrawerBackdrop, null, {
                default: () => [
                  h(DrawerContent, null, {
                    default: () => [
                      h(DrawerDialog, null, {
                        default: () => [
                          h(DrawerHandle),
                          h(DrawerHeading, null, {default: () => "SSR drawer"}),
                          h(DrawerBody, null, {default: () => "Body"}),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        ),
        h(
          Sheet,
          {open: false, placement: "bottom"},
          {
            default: () => [
              h(SheetTrigger, null, {default: () => "Open Sheet"}),
              h(SheetBackdrop, null, {
                default: () => [
                  h(SheetContent, null, {
                    default: () => [
                      h(SheetDialog, null, {
                        default: () => [
                          h(SheetCloseTrigger),
                          h(SheetHandle),
                          h(SheetHeading, null, {default: () => "SSR sheet"}),
                          h(SheetBody, null, {default: () => "Body"}),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        ),
        h(Popover, null, {
          default: () => [
            h(PopoverTrigger, null, {default: () => "Open Popover"}),
            h(PopoverContent, null, {
              default: () => [h(PopoverDialog, null, {default: () => "SSR popover"})],
            }),
          ],
        }),
        h(Tooltip, null, {
          default: () => [
            h(TooltipTrigger, null, {default: () => "Tooltip trigger"}),
            h(TooltipContent, null, {default: () => "SSR tooltip"}),
          ],
        }),
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
    expect(html).toContain('data-slot="alert-dialog-trigger"');
    expect(html).not.toContain('data-slot="alert-dialog-backdrop"');
    expect(html).not.toContain('data-slot="alert-dialog-dialog"');
    expect(html).toContain('data-slot="drawer-trigger"');
    expect(html).not.toContain('data-slot="drawer-backdrop"');
    expect(html).not.toContain('data-slot="drawer-dialog"');
    expect(html).toContain("Open Sheet");
    expect(html).not.toContain('data-slot="sheet-overlay"');
    expect(html).not.toContain('data-slot="sheet-backdrop"');
    expect(html).not.toContain('data-slot="sheet-dialog"');
    expect(html).toContain('data-slot="popover-trigger"');
    expect(html).not.toContain('data-slot="popover-dialog"');
    expect(html).not.toContain("SSR popover");
    expect(html).toContain('data-slot="tooltip-trigger"');
    expect(html).not.toContain('data-slot="tooltip-arrow"');
    expect(html).not.toContain("SSR tooltip");
    expect(html).toContain('data-slot="select-trigger"');
    expect(html).not.toContain('data-slot="select-popover"');
    expect(html).not.toContain('role="listbox"');
  });

  it("renders the provider but no toast viewport on the server", async () => {
    const queue = new ToastQueue();

    queue.add({title: "SSR toast"});

    const PageWithToast = defineComponent({
      setup() {
        return () =>
          h(
            ToastProvider,
            {queue},
            {
              default: () => h("div", {id: "app"}, "App"),
            },
          );
      },
    });

    const html = await renderSSR(PageWithToast);

    expect(html).toContain('id="app"');
    expect(html).not.toContain('data-slot="toast-region"');
    expect(html).not.toContain("SSR toast");

    queue.destroy();
  });

  it("keeps toast queues isolated per request", async () => {
    const first = new ToastQueue();
    const second = new ToastQueue();

    first.add({title: "First"});

    expect(first.visibleToasts).toHaveLength(1);
    expect(second.visibleToasts).toHaveLength(0);

    first.destroy();
    second.destroy();
  });

  it("is deterministic across renders", async () => {
    const first = await renderSSR(Page);
    const second = await renderSSR(Page);

    expect(second).toBe(first);
  });
});
