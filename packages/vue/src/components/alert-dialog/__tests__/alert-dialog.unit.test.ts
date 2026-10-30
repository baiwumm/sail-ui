import {flushPromises, mount} from "@vue/test-utils";
import {nextTick} from "vue";
import {afterEach, describe, expect, it} from "vitest";

import AlertDialogRoot from "../alert-dialog-root.vue";
import AlertDialogBackdrop from "../alert-dialog-backdrop.vue";
import AlertDialogBody from "../alert-dialog-body.vue";
import AlertDialogCloseTrigger from "../alert-dialog-close-trigger.vue";
import AlertDialogContainer from "../alert-dialog-container.vue";
import AlertDialogDialog from "../alert-dialog-dialog.vue";
import AlertDialogFooter from "../alert-dialog-footer.vue";
import AlertDialogHeader from "../alert-dialog-header.vue";
import AlertDialogHeading from "../alert-dialog-heading.vue";
import AlertDialogIcon from "../alert-dialog-icon.vue";
import AlertDialogTrigger from "../alert-dialog-trigger.vue";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface HostOptions {
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isTriggerDisabled?: boolean;
  placement?: "auto" | "top" | "center" | "bottom";
  size?: "xs" | "sm" | "md" | "lg" | "cover";
  status?: "default" | "accent" | "success" | "warning" | "danger";
  variant?: "opaque" | "blur" | "transparent";
}

function createHost(options: HostOptions = {}) {
  return {
    components: {
      AlertDialogRoot,
      AlertDialogBackdrop,
      AlertDialogBody,
      AlertDialogCloseTrigger,
      AlertDialogContainer,
      AlertDialogDialog,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogHeading,
      AlertDialogIcon,
      AlertDialogTrigger,
    },
    data() {
      return {
        isDismissable: options.isDismissable ?? false,
        isKeyboardDismissDisabled: options.isKeyboardDismissDisabled ?? true,
        isTriggerDisabled: options.isTriggerDisabled ?? false,
        placement: options.placement ?? "auto",
        size: options.size ?? "md",
        status: options.status ?? "danger",
        variant: options.variant ?? "opaque",
      };
    },
    template: `
      <AlertDialogRoot>
        <AlertDialogTrigger :is-disabled="isTriggerDisabled">Delete project</AlertDialogTrigger>
        <AlertDialogBackdrop
          :is-dismissable="isDismissable"
          :is-keyboard-dismiss-disabled="isKeyboardDismissDisabled"
          :variant="variant"
        >
          <AlertDialogContainer :placement="placement" :size="size">
            <AlertDialogDialog>
              <AlertDialogCloseTrigger />
              <AlertDialogHeader>
                <AlertDialogIcon :status="status" />
                <AlertDialogHeading>Delete project?</AlertDialogHeading>
              </AlertDialogHeader>
              <AlertDialogBody>This cannot be undone.</AlertDialogBody>
              <AlertDialogFooter>
                <button type="button">Cancel</button>
                <button type="button">Delete</button>
              </AlertDialogFooter>
            </AlertDialogDialog>
          </AlertDialogContainer>
        </AlertDialogBackdrop>
      </AlertDialogRoot>
    `,
  };
}

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="alert-dialog-trigger"]')!;
const backdropOf = () => document.querySelector<HTMLElement>('[data-slot="alert-dialog-backdrop"]');
const dialogOf = () => document.querySelector<HTMLElement>('[data-slot="alert-dialog-dialog"]');

const pressEscape = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key: "Escape"}),
  );
};

const pressOutside = (element: Element) => {
  element.dispatchEvent(
    new PointerEvent("pointerdown", {bubbles: true, button: 0, pointerId: 1, pointerType: "mouse"}),
  );
};

async function open(wrapper: ReturnType<typeof mount>) {
  await wrapper.get('[data-slot="alert-dialog-trigger"]').trigger("click");
  await flushPromises();
}

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  document.body.style.marginRight = "";
});

describe("AlertDialog", () => {
  it("renders only the trigger, with the upstream button semantics, while closed", () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.tagName).toBe("DIV");
    expect(trigger.getAttribute("role")).toBe("button");
    expect(trigger.getAttribute("tabindex")).toBe("0");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(backdropOf()).toBeNull();
    expect(dialogOf()).toBeNull();

    wrapper.unmount();
  });

  it("opens with the alertdialog contract and upstream slots", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    await open(wrapper);

    const container = document.querySelector<HTMLElement>('[data-slot="alert-dialog-container"]');
    const dialog = dialogOf();
    const heading = document.querySelector<HTMLElement>('[data-slot="alert-dialog-heading"]');
    const icon = document.querySelector<HTMLElement>('[data-slot="alert-dialog-icon"]');

    expect(backdropOf()).not.toBeNull();
    expect(container?.getAttribute("data-placement")).toBe("auto");
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("role")).toBe("alertdialog");
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.getAttribute("data-placement")).toBe("auto");
    expect(dialog?.getAttribute("aria-labelledby")).toBe(heading?.id);
    expect(heading?.textContent).toContain("Delete project?");
    expect(icon?.getAttribute("data-slot")).toBe("alert-dialog-icon");
    expect(icon?.querySelector('[data-slot="alert-dialog-default-icon"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="alert-dialog-header"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="alert-dialog-body"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="alert-dialog-footer"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="alert-dialog-close-trigger"]')).not.toBeNull();
    expect(triggerOf().getAttribute("aria-expanded")).toBe("true");

    wrapper.unmount();
  });

  it("requires an explicit action by default", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    await open(wrapper);
    await wait(0);

    pressEscape();
    await flushPromises();
    await wait(80);

    expect(backdropOf()).not.toBeNull();

    pressOutside(backdropOf()!);
    await flushPromises();
    await wait(80);

    expect(backdropOf()).not.toBeNull();

    wrapper.unmount();
  });

  it("honours the dismissable and keyboard overrides", async () => {
    const wrapper = mount(createHost({isDismissable: true, isKeyboardDismissDisabled: false}), {
      attachTo: document.body,
    });

    await open(wrapper);
    await wait(0);

    pressOutside(backdropOf()!);
    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();

    await open(wrapper);
    pressEscape();
    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();

    wrapper.unmount();
  });

  it("closes from the close trigger and restores focus", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    await open(wrapper);

    document.querySelector<HTMLButtonElement>('[data-slot="alert-dialog-close-trigger"]')?.click();
    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();
    expect(document.activeElement).toBe(trigger);

    wrapper.unmount();
  });

  it("does not open from a disabled trigger", async () => {
    const wrapper = mount(createHost({isTriggerDisabled: true}), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.getAttribute("aria-disabled")).toBe("true");
    expect(trigger.getAttribute("tabindex")).toBe("-1");

    trigger.click();
    await flushPromises();

    expect(backdropOf()).toBeNull();

    wrapper.unmount();
  });

  it("applies placement, size, status, and backdrop classes", async () => {
    const wrapper = mount(
      createHost({placement: "bottom", size: "cover", status: "warning", variant: "blur"}),
      {attachTo: document.body},
    );

    await open(wrapper);

    const container = document.querySelector('[data-slot="alert-dialog-container"]');
    const dialog = dialogOf();
    const icon = document.querySelector('[data-slot="alert-dialog-icon"]');

    expect(container?.getAttribute("data-placement")).toBe("bottom");
    expect(dialog?.getAttribute("data-placement")).toBe("bottom");
    expect(dialog?.classList.contains("alert-dialog__dialog--cover")).toBe(true);
    expect(icon?.classList.contains("alert-dialog__icon--warning")).toBe(true);
    expect(backdropOf()?.classList.contains("alert-dialog__backdrop--blur")).toBe(true);

    wrapper.unmount();
  });

  it("keeps a custom icon instead of the status default", async () => {
    const wrapper = mount(
      {
        components: {
          AlertDialogRoot,
          AlertDialogBackdrop,
          AlertDialogBody,
          AlertDialogCloseTrigger,
          AlertDialogContainer,
          AlertDialogDialog,
          AlertDialogFooter,
          AlertDialogHeader,
          AlertDialogHeading,
          AlertDialogIcon,
          AlertDialogTrigger,
        },
        template: `
          <AlertDialogRoot>
            <AlertDialogTrigger>Open</AlertDialogTrigger>
            <AlertDialogBackdrop>
              <AlertDialogContainer>
                <AlertDialogDialog>
                  <AlertDialogHeader>
                    <AlertDialogIcon status="success">
                      <span data-testid="custom-icon">!</span>
                    </AlertDialogIcon>
                    <AlertDialogHeading>Title</AlertDialogHeading>
                  </AlertDialogHeader>
                  <AlertDialogBody>Body</AlertDialogBody>
                </AlertDialogDialog>
              </AlertDialogContainer>
            </AlertDialogBackdrop>
          </AlertDialogRoot>
        `,
      },
      {attachTo: document.body},
    );

    await open(wrapper);

    const icon = document.querySelector('[data-slot="alert-dialog-icon"]');

    expect(icon?.querySelector('[data-testid="custom-icon"]')).not.toBeNull();
    expect(icon?.querySelector('[data-slot="alert-dialog-default-icon"]')).toBeNull();
    expect(icon?.classList.contains("alert-dialog__icon--success")).toBe(true);

    wrapper.unmount();
  });

  it("exposes hover, press, and focus-visible states on the trigger", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.dispatchEvent(new PointerEvent("pointerenter", {pointerType: "mouse"}));
    await nextTick();
    expect(trigger.getAttribute("data-hovered")).toBe("true");

    trigger.dispatchEvent(
      new PointerEvent("pointerdown", {bubbles: true, button: 0, pointerId: 1}),
    );
    await nextTick();
    expect(trigger.getAttribute("data-pressed")).toBe("true");

    trigger.dispatchEvent(new PointerEvent("pointerup", {bubbles: true, button: 0, pointerId: 1}));
    await nextTick();
    expect(trigger.hasAttribute("data-pressed")).toBe(false);

    document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Tab"}));
    trigger.focus();
    await nextTick();
    expect(trigger.getAttribute("data-focus-visible")).toBe("true");

    wrapper.unmount();
  });
});
