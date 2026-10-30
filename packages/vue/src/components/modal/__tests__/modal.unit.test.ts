import {flushPromises, mount} from "@vue/test-utils";
import {nextTick} from "vue";
import {afterEach, describe, expect, it} from "vitest";

import Modal from "../modal-root.vue";
import ModalBackdrop from "../modal-backdrop.vue";
import ModalBody from "../modal-body.vue";
import ModalCloseTrigger from "../modal-close-trigger.vue";
import ModalContainer from "../modal-container.vue";
import ModalDialog from "../modal-dialog.vue";
import ModalFooter from "../modal-footer.vue";
import ModalHeader from "../modal-header.vue";
import ModalHeading from "../modal-heading.vue";
import ModalTrigger from "../modal-trigger.vue";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface HostOptions {
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isTriggerDisabled?: boolean;
}

function createHost(options: HostOptions = {}) {
  return {
    components: {
      Modal,
      ModalBackdrop,
      ModalBody,
      ModalCloseTrigger,
      ModalContainer,
      ModalDialog,
      ModalFooter,
      ModalHeader,
      ModalHeading,
      ModalTrigger,
    },
    data() {
      return {
        isDismissable: options.isDismissable ?? true,
        isKeyboardDismissDisabled: options.isKeyboardDismissDisabled ?? false,
        isTriggerDisabled: options.isTriggerDisabled ?? false,
      };
    },
    template: `
      <Modal>
        <ModalTrigger :is-disabled="isTriggerDisabled">Open Modal</ModalTrigger>
        <ModalBackdrop
          :is-dismissable="isDismissable"
          :is-keyboard-dismiss-disabled="isKeyboardDismissDisabled"
        >
          <ModalContainer>
            <ModalDialog>
              <ModalCloseTrigger />
              <ModalHeader>
                <ModalHeading>Dialog title</ModalHeading>
              </ModalHeader>
              <ModalBody>Dialog body</ModalBody>
              <ModalFooter>Dialog footer</ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    `,
  };
}

const originalMatchMedia = window.matchMedia;

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: matches && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="modal-trigger"]')!;
const backdropOf = () => document.querySelector<HTMLElement>('[data-slot="modal-backdrop"]');
const dialogOf = () => document.querySelector<HTMLElement>('[data-slot="modal-dialog"]');

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

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  document.body.style.marginRight = "";

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: originalMatchMedia,
  });
});

describe("Modal", () => {
  it("renders only the trigger, with the upstream button semantics, while closed", () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.tagName).toBe("DIV");
    expect(trigger.getAttribute("role")).toBe("button");
    expect(trigger.getAttribute("tabindex")).toBe("0");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(backdropOf()).toBeNull();
    expect(dialogOf()).toBeNull();

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

  it("opens with the upstream data-slot contract and dialog semantics", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    await wrapper.get('[data-slot="modal-trigger"]').trigger("click");
    await flushPromises();

    const backdrop = backdropOf();
    const container = document.querySelector('[data-slot="modal-container"]');
    const dialog = dialogOf();
    const heading = document.querySelector<HTMLElement>('[data-slot="modal-heading"]');

    expect(backdrop).not.toBeNull();
    expect(backdrop?.getAttribute("data-slot")).toBe("modal-backdrop");
    expect(container?.getAttribute("data-placement")).toBe("auto");
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.getAttribute("data-placement")).toBe("auto");
    expect(dialog?.hasAttribute("aria-labelledby")).toBe(true);
    expect(heading?.id).toBe(dialog?.getAttribute("aria-labelledby"));
    expect(document.querySelector('[data-slot="modal-header"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-body"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-footer"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-close-trigger"]')).not.toBeNull();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(dialog?.id);
    expect(document.body.style.overflow).toBe("hidden");

    wrapper.unmount();
    await nextTick();
  });

  it("closes on Escape, marks exiting, releases the scroll lock, and restores focus", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    await wrapper.get('[data-slot="modal-trigger"]').trigger("click");
    await flushPromises();
    expect(backdropOf()).not.toBeNull();

    pressEscape();
    await nextTick();

    expect(backdropOf()?.getAttribute("data-exiting")).toBe("true");
    expect(
      document.querySelector('[data-slot="modal-container"]')?.getAttribute("data-exiting"),
    ).toBe("true");

    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);

    wrapper.unmount();
  });

  it("closes when the close trigger is pressed", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    await wrapper.get('[data-slot="modal-trigger"]').trigger("click");
    await flushPromises();

    const closeTrigger = document.querySelector<HTMLButtonElement>(
      '[data-slot="modal-close-trigger"]',
    );

    closeTrigger?.click();
    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();

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

  it("closes when outside interaction is dismissable", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    await wrapper.get('[data-slot="modal-trigger"]').trigger("click");
    await flushPromises();
    // Reka registers the document listener on the next macrotask.
    await wait(0);

    pressOutside(backdropOf()!);
    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();

    wrapper.unmount();
  });

  it("keeps the dialog open when outside interaction is not dismissable", async () => {
    const wrapper = mount(createHost({isDismissable: false}), {attachTo: document.body});

    await wrapper.get('[data-slot="modal-trigger"]').trigger("click");
    await flushPromises();
    await wait(0);

    pressOutside(backdropOf()!);
    await flushPromises();
    await wait(80);

    expect(backdropOf()).not.toBeNull();

    wrapper.unmount();
  });

  it("keeps the dialog open when keyboard dismissal is disabled", async () => {
    const wrapper = mount(createHost({isKeyboardDismissDisabled: true}), {
      attachTo: document.body,
    });

    await wrapper.get('[data-slot="modal-trigger"]').trigger("click");
    await flushPromises();

    pressEscape();
    await flushPromises();
    await wait(80);

    expect(backdropOf()).not.toBeNull();

    wrapper.unmount();
  });

  it("skips the enter animation when reduced motion is preferred", async () => {
    setReducedMotion(true);
    const wrapper = mount(createHost(), {attachTo: document.body});

    await wrapper.get('[data-slot="modal-trigger"]').trigger("click");
    await flushPromises();

    expect(backdropOf()?.hasAttribute("data-entering")).toBe(false);
    expect(
      document.querySelector('[data-slot="modal-container"]')?.hasAttribute("data-entering"),
    ).toBe(false);

    wrapper.unmount();
  });
});
