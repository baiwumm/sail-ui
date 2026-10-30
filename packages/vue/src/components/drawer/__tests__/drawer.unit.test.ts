import {flushPromises, mount} from "@vue/test-utils";
import {nextTick} from "vue";
import {afterEach, describe, expect, it} from "vitest";

import Drawer from "../drawer-root.vue";
import DrawerBackdrop from "../drawer-backdrop.vue";
import DrawerBody from "../drawer-body.vue";
import DrawerCloseTrigger from "../drawer-close-trigger.vue";
import DrawerContent from "../drawer-content.vue";
import DrawerDialog from "../drawer-dialog.vue";
import DrawerFooter from "../drawer-footer.vue";
import DrawerHandle from "../drawer-handle.vue";
import DrawerHeader from "../drawer-header.vue";
import DrawerHeading from "../drawer-heading.vue";
import DrawerTrigger from "../drawer-trigger.vue";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface HostOptions {
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isTriggerDisabled?: boolean;
  placement?: "top" | "bottom" | "left" | "right";
}

function createHost(options: HostOptions = {}) {
  return {
    components: {
      Drawer,
      DrawerBackdrop,
      DrawerBody,
      DrawerCloseTrigger,
      DrawerContent,
      DrawerDialog,
      DrawerFooter,
      DrawerHandle,
      DrawerHeader,
      DrawerHeading,
      DrawerTrigger,
    },
    data() {
      return {
        isDismissable: options.isDismissable ?? true,
        isKeyboardDismissDisabled: options.isKeyboardDismissDisabled ?? false,
        isTriggerDisabled: options.isTriggerDisabled ?? false,
        placement: options.placement ?? "bottom",
      };
    },
    template: `
      <Drawer>
        <DrawerTrigger :is-disabled="isTriggerDisabled">Open Drawer</DrawerTrigger>
        <DrawerBackdrop
          :is-dismissable="isDismissable"
          :is-keyboard-dismiss-disabled="isKeyboardDismissDisabled"
        >
          <DrawerContent :placement="placement">
            <DrawerDialog>
              <DrawerCloseTrigger />
              <DrawerHandle />
              <DrawerHeader>
                <DrawerHeading>Drawer title</DrawerHeading>
              </DrawerHeader>
              <DrawerBody>Drawer body</DrawerBody>
              <DrawerFooter>Drawer footer</DrawerFooter>
            </DrawerDialog>
          </DrawerContent>
        </DrawerBackdrop>
      </Drawer>
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

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="drawer-trigger"]')!;
const backdropOf = () => document.querySelector<HTMLElement>('[data-slot="drawer-backdrop"]');
const contentOf = () => document.querySelector<HTMLElement>('[data-slot="drawer-content"]');
const dialogOf = () => document.querySelector<HTMLElement>('[data-slot="drawer-dialog"]');

const pressEscape = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key: "Escape"}),
  );
};

const pointer = (element: Element, type: string, init: PointerEventInit = {}) => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      pointerType: "touch",
      ...init,
    }),
  );
};

const pressOutside = (element: Element) => {
  pointer(element, "pointerdown", {button: 0, pointerType: "mouse"});
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

describe("Drawer", () => {
  it("renders only a native trigger button while closed", () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("data-slot")).toBe("drawer-trigger");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(backdropOf()).toBeNull();
    expect(contentOf()).toBeNull();
    expect(dialogOf()).toBeNull();

    wrapper.unmount();
  });

  it("exposes hover, press, and focus-visible states on the trigger", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.dispatchEvent(new PointerEvent("pointerenter", {pointerType: "mouse"}));
    await nextTick();
    expect(trigger.getAttribute("data-hovered")).toBe("true");

    pointer(trigger, "pointerdown", {button: 0, pointerType: "mouse"});
    await nextTick();
    expect(trigger.getAttribute("data-pressed")).toBe("true");

    pointer(trigger, "pointerup", {button: 0, pointerType: "mouse"});
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

    trigger.click();
    await flushPromises();

    const backdrop = backdropOf();
    const content = contentOf();
    const dialog = dialogOf();
    const heading = document.querySelector<HTMLElement>('[data-slot="drawer-heading"]');
    const handle = document.querySelector<HTMLElement>('[data-slot="drawer-handle"]');
    const body = document.querySelector<HTMLElement>('[data-slot="drawer-body"]');

    expect(backdrop).not.toBeNull();
    expect(backdrop?.getAttribute("data-entering")).toBe("true");
    expect(content).not.toBeNull();
    expect(content?.getAttribute("data-placement")).toBe("bottom");
    expect(content?.classList.contains("drawer__content--bottom")).toBe(true);
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("role")).toBe("dialog");
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.getAttribute("data-placement")).toBe("bottom");
    expect(dialog?.classList.contains("drawer__dialog--bottom")).toBe(true);
    expect(dialog?.hasAttribute("aria-labelledby")).toBe(true);
    expect(heading?.id).toBe(dialog?.getAttribute("aria-labelledby"));
    expect(handle?.getAttribute("aria-hidden")).toBe("true");
    expect(handle?.querySelector('[data-slot="drawer-handle-bar"]')).not.toBeNull();
    expect(body?.style.touchAction).toBe("pan-y");
    expect(dialog?.style.touchAction).toBe("none");
    expect(document.querySelector('[data-slot="drawer-header"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="drawer-footer"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="drawer-close-trigger"]')).not.toBeNull();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(dialog?.id);
    expect(document.body.style.overflow).toBe("hidden");

    wrapper.unmount();
    await nextTick();
  });

  it("closes on Escape, marks exiting, releases the scroll lock, and restores focus", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.click();
    await flushPromises();
    expect(backdropOf()).not.toBeNull();

    pressEscape();
    await nextTick();

    expect(backdropOf()?.getAttribute("data-exiting")).toBe("true");
    expect(contentOf()?.getAttribute("data-exiting")).toBe("true");

    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);

    wrapper.unmount();
  });

  it("closes when the close trigger is pressed", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    document.querySelector<HTMLButtonElement>('[data-slot="drawer-close-trigger"]')?.click();
    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();

    wrapper.unmount();
  });

  it("does not open from a disabled trigger", async () => {
    const wrapper = mount(createHost({isTriggerDisabled: true}), {attachTo: document.body});
    const trigger = triggerOf();

    expect((trigger as HTMLButtonElement).disabled).toBe(true);

    trigger.click();
    await flushPromises();

    expect(backdropOf()).toBeNull();

    wrapper.unmount();
  });

  it("closes when outside interaction is dismissable", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();
    await wait(0);

    pressOutside(backdropOf()!);
    await flushPromises();
    await wait(80);

    expect(backdropOf()).toBeNull();

    wrapper.unmount();
  });

  it("keeps the drawer open when outside interaction is not dismissable", async () => {
    const wrapper = mount(createHost({isDismissable: false}), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();
    await wait(0);

    pressOutside(backdropOf()!);
    await flushPromises();
    await wait(80);

    expect(backdropOf()).not.toBeNull();
    expect(dialogOf()?.style.touchAction).toBe("");

    wrapper.unmount();
  });

  it("keeps the drawer open when keyboard dismissal is disabled", async () => {
    const wrapper = mount(createHost({isKeyboardDismissDisabled: true}), {
      attachTo: document.body,
    });

    triggerOf().click();
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

    triggerOf().click();
    await flushPromises();

    expect(backdropOf()?.hasAttribute("data-entering")).toBe(false);
    expect(contentOf()?.hasAttribute("data-entering")).toBe(false);

    wrapper.unmount();
  });

  it("maps placement to content, dialog classes, and data attributes", async () => {
    const wrapper = mount(createHost({placement: "left"}), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    expect(contentOf()?.getAttribute("data-placement")).toBe("left");
    expect(contentOf()?.classList.contains("drawer__content--left")).toBe(true);
    expect(dialogOf()?.getAttribute("data-placement")).toBe("left");
    expect(dialogOf()?.classList.contains("drawer__dialog--left")).toBe(true);

    wrapper.unmount();
  });

  it("ignores drags that start in the body and follows drags from the handle", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    const dialog = dialogOf()!;
    const body = document.querySelector<HTMLElement>('[data-slot="drawer-body"]')!;
    const handle = document.querySelector<HTMLElement>('[data-slot="drawer-handle"]')!;

    Object.defineProperty(dialog, "offsetHeight", {configurable: true, value: 400});

    pointer(body, "pointerdown", {button: 0, clientY: 100});
    pointer(dialog, "pointermove", {clientY: 140});
    expect(dialog.style.transform).toBe("");

    pointer(dialog, "pointercancel");
    pointer(handle, "pointerdown", {button: 0, clientY: 100});
    await wait(60);
    pointer(dialog, "pointermove", {clientY: 120});
    expect(dialog.style.transform).toBe("translateY(20px)");

    await wait(60);
    pointer(dialog, "pointerup");
    expect(dialog.style.transform).toBe("");

    wrapper.unmount();
  });

  it("dismisses when a drag passes the threshold", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    const dialog = dialogOf()!;
    const handle = document.querySelector<HTMLElement>('[data-slot="drawer-handle"]')!;

    Object.defineProperty(dialog, "offsetHeight", {configurable: true, value: 400});

    pointer(handle, "pointerdown", {button: 0, clientY: 100});
    await wait(60);
    pointer(dialog, "pointermove", {clientY: 300});
    expect(dialog.style.transform).toBe("translateY(200px)");

    await wait(60);
    pointer(dialog, "pointerup");
    await nextTick();

    expect(backdropOf()?.getAttribute("data-exiting")).toBe("true");

    await flushPromises();
    await wait(80);
    expect(backdropOf()).toBeNull();

    wrapper.unmount();
  });
});
