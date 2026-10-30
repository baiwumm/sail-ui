import {flushPromises, mount} from "@vue/test-utils";
import {nextTick} from "vue";
import {afterEach, describe, expect, it, vi} from "vitest";

import Sheet from "../sheet-root.vue";
import SheetBackdrop from "../sheet-backdrop.vue";
import SheetBody from "../sheet-body.vue";
import SheetClose from "../sheet-close.vue";
import SheetCloseTrigger from "../sheet-close-trigger.vue";
import SheetContent from "../sheet-content.vue";
import SheetDialog from "../sheet-dialog.vue";
import SheetFooter from "../sheet-footer.vue";
import SheetHandle from "../sheet-handle.vue";
import SheetHeader from "../sheet-header.vue";
import SheetHeading from "../sheet-heading.vue";
import SheetTrigger from "../sheet-trigger.vue";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface HostOptions {
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isTriggerDisabled?: boolean;
  placement?: "top" | "bottom" | "left" | "right";
  variant?: "opaque" | "blur" | "transparent";
}

function createHost(options: HostOptions = {}) {
  return {
    components: {
      Sheet,
      SheetBackdrop,
      SheetBody,
      SheetClose,
      SheetCloseTrigger,
      SheetContent,
      SheetDialog,
      SheetFooter,
      SheetHandle,
      SheetHeader,
      SheetHeading,
      SheetTrigger,
    },
    data() {
      return {
        isDismissable: options.isDismissable ?? true,
        isKeyboardDismissDisabled: options.isKeyboardDismissDisabled ?? false,
        isTriggerDisabled: options.isTriggerDisabled ?? false,
        placement: options.placement ?? "left",
        variant: options.variant ?? "opaque",
      };
    },
    template: `
      <Sheet :placement="placement">
        <SheetTrigger :is-disabled="isTriggerDisabled">Open Sheet</SheetTrigger>
        <SheetBackdrop
          :is-dismissable="isDismissable"
          :is-keyboard-dismiss-disabled="isKeyboardDismissDisabled"
          :variant="variant"
        >
          <SheetContent>
            <SheetDialog>
              <SheetCloseTrigger />
              <SheetHandle />
              <SheetHeader>
                <SheetHeading>Sheet title</SheetHeading>
              </SheetHeader>
              <SheetBody>Sheet body</SheetBody>
              <SheetFooter>
                <SheetClose>Done</SheetClose>
              </SheetFooter>
            </SheetDialog>
          </SheetContent>
        </SheetBackdrop>
      </Sheet>
    `,
  };
}

const originalMatchMedia = window.matchMedia;
const originalAnimate = HTMLElement.prototype.animate;

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

const triggerOf = () => document.querySelector<HTMLElement>('[aria-haspopup="dialog"]')!;
const overlayOf = () => document.querySelector<HTMLElement>('[data-slot="sheet-overlay"]');
const backdropOf = () => document.querySelector<HTMLElement>('[data-slot="sheet-backdrop"]');
const contentOf = () => document.querySelector<HTMLElement>('[data-slot="sheet-content"]');
const dialogOf = () => document.querySelector<HTMLElement>('[data-slot="sheet-dialog"]');

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
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    writable: true,
    value: originalAnimate,
  });
});

describe("Sheet", () => {
  it("renders only a native trigger button while closed", () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.hasAttribute("data-slot")).toBe(false);
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(overlayOf()).toBeNull();
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
    const wrapper = mount(createHost({variant: "blur"}), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.click();
    await flushPromises();

    const overlay = overlayOf();
    const backdrop = backdropOf();
    const content = contentOf();
    const dialog = dialogOf();
    const heading = document.querySelector<HTMLElement>('[data-slot="sheet-heading"]');
    const handle = document.querySelector<HTMLElement>('[data-slot="sheet-handle"]');

    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute("data-entering")).toBe("true");
    expect(backdrop).not.toBeNull();
    expect(backdrop?.getAttribute("data-stack-index")).toBe("0");
    expect(backdrop?.classList.contains("sheet__backdrop--blur")).toBe(true);
    expect(content).not.toBeNull();
    expect(content?.getAttribute("data-placement")).toBe("left");
    expect(content?.classList.contains("sheet__content--left")).toBe(true);
    expect(content?.hasAttribute("data-expanded")).toBe(true);
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("role")).toBe("dialog");
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.getAttribute("data-placement")).toBe("left");
    expect(dialog?.classList.contains("sheet__dialog--left")).toBe(true);
    expect(dialog?.hasAttribute("aria-labelledby")).toBe(true);
    expect(heading?.id).toBe(dialog?.getAttribute("aria-labelledby"));
    expect(handle?.getAttribute("aria-hidden")).toBe("true");
    expect(handle?.hasAttribute("data-sheet-handle")).toBe(true);
    expect(handle?.querySelector('[data-slot="sheet-handle-bar"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="sheet-header"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="sheet-footer"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="sheet-close-trigger"]')).not.toBeNull();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(dialog?.id);
    expect(document.body.style.overflow).toBe("hidden");

    wrapper.unmount();
    await nextTick();
  });

  it("slides the panel from its edge and out again", async () => {
    const animate = vi.fn(
      (_keyframes: Keyframe[], _options?: KeyframeAnimationOptions) =>
        ({cancel: vi.fn()}) as unknown as Animation,
    );

    Object.defineProperty(HTMLElement.prototype, "animate", {
      configurable: true,
      writable: true,
      value: animate,
    });

    const wrapper = mount(createHost({placement: "left"}), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    expect(animate).toHaveBeenCalled();
    expect(animate.mock.calls[0]?.[0]).toEqual([
      {transform: "translateX(-100%)"},
      {transform: "translate(0, 0)"},
    ]);

    pressEscape();
    await nextTick();

    const exitCall = animate.mock.calls.at(-1);

    expect(exitCall?.[0]).toEqual([
      {transform: "translate(0, 0)"},
      {transform: "translateX(-100%)"},
    ]);
    expect(exitCall?.[1]).toMatchObject({duration: 500});

    wrapper.unmount();
  });

  it("closes on Escape, marks exiting, releases the scroll lock, and restores focus", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.click();
    await flushPromises();
    expect(overlayOf()).not.toBeNull();

    pressEscape();
    await nextTick();

    expect(overlayOf()?.getAttribute("data-exiting")).toBe("true");
    expect(overlayOf()?.hasAttribute("data-closed")).toBe(true);
    expect(contentOf()?.getAttribute("data-exiting")).toBe("true");

    await flushPromises();
    await wait(80);

    expect(overlayOf()).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);

    wrapper.unmount();
  });

  it("closes from the close trigger and the SheetClose button", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();
    document.querySelector<HTMLButtonElement>('[data-slot="sheet-close-trigger"]')?.click();
    await flushPromises();
    await wait(80);
    expect(overlayOf()).toBeNull();

    triggerOf().click();
    await flushPromises();
    document.querySelector<HTMLButtonElement>('[data-slot="sheet-footer"] button')?.click();
    await flushPromises();
    await wait(80);
    expect(overlayOf()).toBeNull();

    wrapper.unmount();
  });

  it("does not open from a disabled trigger", async () => {
    const wrapper = mount(createHost({isTriggerDisabled: true}), {attachTo: document.body});
    const trigger = triggerOf();

    expect((trigger as HTMLButtonElement).disabled).toBe(true);

    trigger.click();
    await flushPromises();

    expect(overlayOf()).toBeNull();

    wrapper.unmount();
  });

  it("closes when outside interaction is dismissable", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();
    await wait(0);

    pressOutside(overlayOf()!);
    await flushPromises();
    await wait(80);

    expect(overlayOf()).toBeNull();

    wrapper.unmount();
  });

  it("keeps the sheet open when outside interaction is not dismissable", async () => {
    const wrapper = mount(createHost({isDismissable: false}), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();
    await wait(0);

    pressOutside(overlayOf()!);
    await flushPromises();
    await wait(80);

    expect(overlayOf()).not.toBeNull();

    wrapper.unmount();
  });

  it("keeps the sheet open when keyboard dismissal is disabled", async () => {
    const wrapper = mount(createHost({isKeyboardDismissDisabled: true}), {
      attachTo: document.body,
    });

    triggerOf().click();
    await flushPromises();

    pressEscape();
    await flushPromises();
    await wait(80);

    expect(overlayOf()).not.toBeNull();

    wrapper.unmount();
  });

  it("skips the enter animation when reduced motion is preferred", async () => {
    setReducedMotion(true);
    const wrapper = mount(createHost(), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    expect(overlayOf()?.hasAttribute("data-entering")).toBe(false);
    expect(contentOf()?.hasAttribute("data-entering")).toBe(false);

    wrapper.unmount();
  });

  it("snaps back when the handle drag stays under the dismiss threshold", async () => {
    const wrapper = mount(createHost({placement: "bottom"}), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    const dialog = dialogOf()!;
    const handle = document.querySelector<HTMLElement>('[data-slot="sheet-handle"]')!;

    Object.defineProperty(dialog, "offsetHeight", {configurable: true, value: 400});

    pointer(handle, "pointerdown", {button: 0, clientY: 100});
    await nextTick();
    expect(handle.hasAttribute("data-dragging")).toBe(true);

    await wait(60);
    pointer(handle, "pointermove", {clientY: 120});
    expect(dialog.style.transform).toBe("translateY(20px)");

    await wait(120);
    pointer(handle, "pointerup");
    await nextTick();

    expect(dialog.style.transform).toBe("");
    expect(handle.hasAttribute("data-dragging")).toBe(false);
    expect(overlayOf()).not.toBeNull();

    wrapper.unmount();
  });

  it("dismisses when a handle drag passes the dismiss threshold", async () => {
    const wrapper = mount(createHost({placement: "bottom"}), {attachTo: document.body});

    triggerOf().click();
    await flushPromises();

    const dialog = dialogOf()!;
    const handle = document.querySelector<HTMLElement>('[data-slot="sheet-handle"]')!;

    Object.defineProperty(dialog, "offsetHeight", {configurable: true, value: 400});

    pointer(handle, "pointerdown", {button: 0, clientY: 100});
    await wait(120);
    pointer(handle, "pointermove", {clientY: 300});
    expect(dialog.style.transform).toBe("translateY(200px)");

    await wait(120);
    pointer(handle, "pointerup");
    await nextTick();

    expect(contentOf()?.getAttribute("data-exiting")).toBe("true");

    await flushPromises();
    await wait(80);
    expect(overlayOf()).toBeNull();

    wrapper.unmount();
  });
});
