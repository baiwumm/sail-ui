import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import ToastProvider from "../toast-provider.vue";
import Toast from "../toast.vue";
import ToastActionButton from "../toast-action-button.vue";
import ToastCloseButton from "../toast-close-button.vue";
import ToastContent from "../toast-content.vue";
import ToastDescription from "../toast-description.vue";
import ToastTitle from "../toast-title.vue";
import {useToast} from "../index";
import {ToastQueue} from "../toast-queue";

const queue = () => new ToastQueue();

async function settle() {
  await nextTick();
  await nextTick();
}

const region = () => document.querySelector<HTMLElement>('[data-slot="toast-region"]');
const toastElements = () =>
  [...document.querySelectorAll<HTMLElement>('[data-slot="toast"]')] as HTMLElement[];

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("Toast", () => {
  it("renders nothing until a toast is queued", async () => {
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});

    expect(region()).toBeNull();

    toastQueue.add({title: "Saved"});
    await settle();

    expect(region()).not.toBeNull();
    expect(region()?.getAttribute("aria-label")).toBe("1 notification.");

    wrapper.unmount();
  });

  it("renders the default toast DOM contract", async () => {
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});

    toastQueue.add({
      description: "Your changes have been saved.",
      title: "Saved",
      variant: "success",
    });
    await settle();

    const toast = toastElements()[0]!;

    expect(toast.getAttribute("role")).toBe("alertdialog");
    expect(toast.getAttribute("data-frontmost")).toBe("true");
    expect(toast.className).toContain("toast--success");
    expect(toast.querySelector('[data-slot="toast-indicator"]')).not.toBeNull();
    expect(toast.querySelector('[data-slot="toast-default-icon"]')).not.toBeNull();
    expect(toast.querySelector('[data-slot="toast-title"]')?.textContent).toBe("Saved");
    expect(toast.querySelector('[data-slot="toast-description"]')?.textContent).toBe(
      "Your changes have been saved.",
    );
    expect(toast.querySelector('[data-slot="toast-close"]')).not.toBeNull();
    expect(toast.getAttribute("aria-labelledby")).toBe(
      toast.querySelector('[data-slot="toast-title"]')?.id,
    );
    expect(toast.getAttribute("aria-describedby")).toBe(
      toast.querySelector('[data-slot="toast-description"]')?.id,
    );

    wrapper.unmount();
  });

  it("hides toasts beyond maxVisibleToasts and marks the stack", async () => {
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {
      attachTo: document.body,
      props: {maxVisibleToasts: 1, queue: toastQueue},
    });

    toastQueue.add({title: "First"});
    toastQueue.add({title: "Second"});
    await settle();

    const [newest, oldest] = toastElements();

    expect(newest?.getAttribute("data-frontmost")).toBe("true");
    expect(newest?.hasAttribute("data-hidden")).toBe(false);
    expect(oldest?.getAttribute("data-hidden")).toBe("true");
    expect(oldest?.getAttribute("aria-hidden")).toBe("true");
    expect(oldest?.hasAttribute("inert")).toBe(true);
    expect(oldest?.tabIndex).toBe(-1);

    wrapper.unmount();
  });

  it("auto-dismisses after the timeout and holds the DOM for the exit animation", async () => {
    vi.useFakeTimers();
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});

    toastQueue.add({title: "Saved"});
    await settle();

    expect(toastElements()).toHaveLength(1);

    vi.advanceTimersByTime(4000);
    await settle();

    expect(toastElements()[0]?.getAttribute("data-exiting")).toBe("true");

    vi.advanceTimersByTime(300);
    await settle();

    expect(toastElements()).toHaveLength(0);

    wrapper.unmount();
  });

  it("pauses timers while the pointer is inside the region", async () => {
    vi.useFakeTimers();
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});

    toastQueue.add({title: "Saved"});
    await settle();

    vi.advanceTimersByTime(1000);
    region()?.dispatchEvent(new PointerEvent("pointerenter", {pointerType: "mouse"}));
    await settle();

    vi.advanceTimersByTime(10000);
    await settle();
    expect(toastElements()[0]?.hasAttribute("data-exiting")).toBe(false);

    region()?.dispatchEvent(new PointerEvent("pointerleave", {pointerType: "mouse"}));
    await settle();

    vi.advanceTimersByTime(2999);
    await settle();
    expect(toastElements()[0]?.hasAttribute("data-exiting")).toBe(false);

    vi.advanceTimersByTime(1);
    await settle();
    expect(toastElements()[0]?.getAttribute("data-exiting")).toBe("true");

    wrapper.unmount();
  });

  it("dismisses from the close button and fires onClose once", async () => {
    const toastQueue = queue();
    const onClose = vi.fn();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});

    toastQueue.add({title: "Saved"}, {onClose, timeout: 0});
    await settle();

    const close = document.querySelector<HTMLButtonElement>('[data-slot="toast-close"]');

    expect(close?.getAttribute("aria-label")).toBe("Close");
    close?.click();
    await settle();

    expect(toastElements()[0]?.getAttribute("data-exiting")).toBe("true");
    expect(onClose).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it("updates in place and restarts the countdown only when timeout is passed", async () => {
    vi.useFakeTimers();
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});

    const key = toastQueue.add({title: "Loading"}, {timeout: 0});

    await settle();

    toastQueue.update(key, {title: "Saved"}, {timeout: 4000});
    await settle();

    expect(toastElements()).toHaveLength(1);
    expect(toastElements()[0]?.textContent).toContain("Saved");

    vi.advanceTimersByTime(3999);
    await settle();
    expect(toastElements()[0]?.hasAttribute("data-exiting")).toBe(false);

    vi.advanceTimersByTime(1);
    await settle();
    expect(toastElements()[0]?.getAttribute("data-exiting")).toBe("true");

    wrapper.unmount();
  });

  it("settles a promise toast in place", async () => {
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});
    const toast = (await import("../toast-queue")).createToastFunction(toastQueue);
    let resolve!: (value: string) => void;
    const promise = new Promise<string>((next) => {
      resolve = next;
    });

    toast.promise(promise, {
      error: "Failed",
      loading: "Saving",
      success: (value) => `Saved ${value}`,
    });
    await settle();
    expect(toastElements()[0]?.textContent).toContain("Saving");
    expect(document.querySelector('[data-slot="spinner"]')).not.toBeNull();

    resolve("draft");
    await flushPromises();
    await settle();

    expect(toastElements()).toHaveLength(1);
    expect(toastElements()[0]?.textContent).toContain("Saved draft");
    expect(toastElements()[0]?.className).toContain("toast--success");

    wrapper.unmount();
  });

  it("hides the indicator when indicator is null", async () => {
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});

    toastQueue.add({indicator: null, title: "No icon"});
    await settle();

    expect(document.querySelector('[data-slot="toast-indicator"]')).toBeNull();

    wrapper.unmount();
  });

  it("uses a custom toast slot", async () => {
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {
      attachTo: document.body,
      props: {queue: toastQueue},
      slots: {
        toast: (slotProps) =>
          h(Toast, {toast: slotProps.toast}, () => [
            h(ToastContent, null, () => [h(ToastTitle, null, () => slotProps.toast.content.title)]),
            h(ToastCloseButton),
            h(ToastActionButton, null, () => "Undo"),
            h(ToastDescription, null, () => "Custom"),
          ]),
      },
    });

    toastQueue.add({title: "Custom toast"});
    await settle();

    expect(toastElements()[0]?.textContent).toContain("Custom toast");
    expect(toastElements()[0]?.textContent).toContain("Undo");

    wrapper.unmount();
  });

  it("focuses the region with the hotkey and collapses on Escape", async () => {
    const toastQueue = queue();
    const wrapper = mount(ToastProvider, {attachTo: document.body, props: {queue: toastQueue}});

    toastQueue.add({title: "First"});
    toastQueue.add({title: "Second"});
    await settle();

    document.dispatchEvent(
      new KeyboardEvent("keydown", {altKey: true, bubbles: true, cancelable: true, code: "KeyT"}),
    );
    await settle();

    expect(document.activeElement).toBe(region());
    expect(region()?.getAttribute("data-expanded")).toBe("true");

    region()?.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Escape"}));
    await settle();

    expect(region()?.hasAttribute("data-expanded")).toBe(false);

    wrapper.unmount();
  });

  it("exposes useToast inside the provider", async () => {
    const toastQueue = queue();
    let toast: ReturnType<typeof useToast> | undefined;
    const Consumer = defineComponent({
      setup() {
        toast = useToast();

        return () => h("div", "consumer");
      },
    });

    const wrapper = mount(ToastProvider, {
      attachTo: document.body,
      props: {queue: toastQueue},
      slots: {default: () => h(Consumer)},
    });

    toast!("Hello");
    await settle();

    expect(toastElements()[0]?.textContent).toContain("Hello");

    wrapper.unmount();
  });
});

describe("ToastQueue", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("resumes a paused toast from its remaining time", async () => {
    vi.useFakeTimers();
    const toastQueue = queue();
    const onClose = vi.fn();

    toastQueue.add({title: "Paused"}, {onClose, timeout: 4000});
    vi.advanceTimersByTime(1000);
    toastQueue.pauseAll();
    vi.advanceTimersByTime(10000);
    expect(toastQueue.exitingKeys.size).toBe(0);

    toastQueue.resumeAll();
    vi.advanceTimersByTime(2999);
    expect(toastQueue.exitingKeys.size).toBe(0);

    vi.advanceTimersByTime(1);
    expect(toastQueue.exitingKeys.size).toBe(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    toastQueue.destroy();
  });
});
