import {flushPromises, mount} from "@vue/test-utils";
import {nextTick} from "vue";
import {afterEach, describe, expect, it} from "vitest";

import Tooltip from "../tooltip-root.vue";
import TooltipArrow from "../tooltip-arrow.vue";
import TooltipContent from "../tooltip-content.vue";
import TooltipTrigger from "../tooltip-trigger.vue";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface HostOptions {
  delay?: number;
  closeDelay?: number;
  isDisabled?: boolean;
  trigger?: "hover" | "focus";
}

function createHost(options: HostOptions = {}) {
  return {
    components: {
      Tooltip,
      TooltipArrow,
      TooltipContent,
      TooltipTrigger,
    },
    data() {
      return {
        delay: "delay" in options ? options.delay : 0,
        closeDelay: options.closeDelay ?? 0,
        isDisabled: options.isDisabled ?? false,
        trigger: options.trigger ?? "hover",
      };
    },
    template: `
      <Tooltip
        :close-delay="closeDelay"
        :delay="delay"
        :is-disabled="isDisabled"
        :trigger="trigger"
      >
        <TooltipTrigger>Hover for details</TooltipTrigger>
        <TooltipContent show-arrow>
          <TooltipArrow />
          Tooltip body
        </TooltipContent>
      </Tooltip>
    `,
  };
}

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="tooltip-trigger"]')!;
const contentOf = () => document.querySelector<HTMLElement>(".tooltip");

const pointer = (element: Element, type: string) => {
  element.dispatchEvent(new PointerEvent(type, {bubbles: true, pointerType: "mouse"}));
};

afterEach(() => {
  document.body.replaceChildren();
});

describe("Tooltip", () => {
  it("renders a focusable div trigger while closed", () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.tagName).toBe("DIV");
    expect(trigger.getAttribute("role")).toBe("button");
    expect(trigger.getAttribute("tabindex")).toBe("0");
    expect(trigger.classList.contains("tooltip__trigger")).toBe(true);
    expect(trigger.hasAttribute("data-grace-area-trigger")).toBe(true);
    expect(trigger.hasAttribute("aria-describedby")).toBe(false);
    expect(contentOf()).toBeNull();

    wrapper.unmount();
  });

  it("opens on hover after the delay and exposes the upstream slots", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.focus();
    trigger.blur();
    pointer(trigger, "pointerenter");
    await wait(0);
    await flushPromises();

    const content = contentOf();
    const describedBy = trigger.getAttribute("aria-describedby");

    expect(content).not.toBeNull();
    expect(content?.getAttribute("data-entering")).toBe("true");
    expect(content?.getAttribute("data-placement")).toBe("top");
    expect(content?.classList.contains("tooltip")).toBe(true);
    expect(document.querySelector('[data-slot="tooltip-arrow"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="overlay-arrow"]')).not.toBeNull();
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)?.getAttribute("role")).toBe("tooltip");

    wrapper.unmount();
    await nextTick();
  });

  it("waits for the default 1500ms delay before opening", async () => {
    const wrapper = mount(createHost({delay: undefined}), {attachTo: document.body});
    const trigger = triggerOf();

    pointer(trigger, "pointerenter");
    await wait(60);
    await flushPromises();

    expect(contentOf()).toBeNull();

    pointer(trigger, "pointerleave");
    await wait(10);

    wrapper.unmount();
  });

  it("opens on focus without the delay and closes on blur", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.focus();
    await flushPromises();
    expect(contentOf()).not.toBeNull();

    trigger.blur();
    await wait(0);
    await flushPromises();
    expect(contentOf()?.getAttribute("data-exiting")).toBe("true");

    await wait(80);
    expect(contentOf()).toBeNull();

    wrapper.unmount();
  });

  it("keeps the tooltip open while the pointer is over the content", async () => {
    const wrapper = mount(createHost({closeDelay: 30}), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.focus();
    await flushPromises();

    trigger.blur();
    contentOf()?.dispatchEvent(new PointerEvent("pointerenter", {bubbles: true}));
    await wait(60);
    await flushPromises();

    expect(contentOf()).not.toBeNull();

    pointer(contentOf()!, "pointerleave");
    await wait(60);
    await flushPromises();
    await wait(80);

    expect(contentOf()).toBeNull();

    wrapper.unmount();
  });

  it("ignores hover when the trigger mode is focus", async () => {
    const wrapper = mount(createHost({trigger: "focus"}), {attachTo: document.body});
    const trigger = triggerOf();

    pointer(trigger, "pointerenter");
    await wait(10);
    await flushPromises();
    expect(contentOf()).toBeNull();

    trigger.focus();
    await flushPromises();
    expect(contentOf()).not.toBeNull();

    wrapper.unmount();
  });

  it("does not open when disabled", async () => {
    const wrapper = mount(createHost({isDisabled: true}), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.getAttribute("tabindex")).toBe("-1");

    trigger.focus();
    await flushPromises();
    expect(contentOf()).toBeNull();

    pointer(trigger, "pointerenter");
    await wait(10);
    await flushPromises();
    expect(contentOf()).toBeNull();

    wrapper.unmount();
  });

  it("exposes keyboard focus-visible on the trigger", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Tab"}));
    trigger.focus();
    await nextTick();

    expect(trigger.getAttribute("data-focus-visible")).toBe("true");

    wrapper.unmount();
  });
});
