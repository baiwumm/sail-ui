import {flushPromises, mount} from "@vue/test-utils";
import {nextTick} from "vue";
import {afterEach, describe, expect, it} from "vitest";

import Popover from "../popover-root.vue";
import PopoverArrow from "../popover-arrow.vue";
import PopoverContent from "../popover-content.vue";
import PopoverDialog from "../popover-dialog.vue";
import PopoverHeading from "../popover-heading.vue";
import PopoverTrigger from "../popover-trigger.vue";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface HostOptions {
  isDisabled?: boolean;
}

function createHost(options: HostOptions = {}) {
  return {
    components: {
      Popover,
      PopoverArrow,
      PopoverContent,
      PopoverDialog,
      PopoverHeading,
      PopoverTrigger,
    },
    data() {
      return {
        isDisabled: options.isDisabled ?? false,
      };
    },
    template: `
      <Popover>
        <PopoverTrigger :is-disabled="isDisabled">Open popover</PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverDialog>
            <PopoverHeading>Popover title</PopoverHeading>
            <p>Popover body</p>
          </PopoverDialog>
        </PopoverContent>
      </Popover>
    `,
  };
}

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="popover-trigger"]')!;
const contentOf = () => document.querySelector<HTMLElement>(".popover");
const dialogOf = () => document.querySelector<HTMLElement>('[data-slot="popover-dialog"]');
const arrowOf = () => document.querySelector<HTMLElement>('[data-slot="popover-overlay-arrow"]');

const pressEscape = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key: "Escape"}),
  );
};

afterEach(() => {
  document.body.replaceChildren();
});

describe("Popover", () => {
  it("renders a div trigger with button semantics while closed", () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.tagName).toBe("DIV");
    expect(trigger.getAttribute("role")).toBe("button");
    expect(trigger.getAttribute("tabindex")).toBe("0");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(trigger.classList.contains("popover__trigger")).toBe(true);
    expect(contentOf()).toBeNull();

    wrapper.unmount();
  });

  it("opens on click with the upstream slots and dialog semantics", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.click();
    await flushPromises();

    const content = contentOf();
    const dialog = dialogOf();
    const heading = document.querySelector<HTMLElement>(".popover__heading");

    expect(content).not.toBeNull();
    expect(content?.getAttribute("data-entering")).toBe("true");
    expect(content?.getAttribute("data-placement")).toBe("bottom");
    expect(content?.getAttribute("role")).toBe("dialog");
    expect(content?.id).toBeTruthy();
    expect(dialog).not.toBeNull();
    expect(dialog?.classList.contains("popover__dialog")).toBe(true);
    expect(heading?.getAttribute("slot")).toBe("title");
    expect(document.querySelector('[data-slot="popover-overlay-arrow-group"]')).not.toBeNull();
    expect(arrowOf()).not.toBeNull();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(content?.id);
    expect(content?.getAttribute("aria-labelledby")).toBeTruthy();

    wrapper.unmount();
    await nextTick();
  });

  it("closes on Escape, marks exiting, and restores focus to the trigger", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.focus();
    trigger.click();
    await flushPromises();
    expect(contentOf()).not.toBeNull();

    pressEscape();
    await nextTick();

    expect(contentOf()?.getAttribute("data-exiting")).toBe("true");

    await flushPromises();
    await wait(80);

    expect(contentOf()).toBeNull();
    expect(document.activeElement).toBe(trigger);

    wrapper.unmount();
  });

  it("does not open from a disabled trigger", async () => {
    const wrapper = mount(createHost({isDisabled: true}), {attachTo: document.body});
    const trigger = triggerOf();

    expect(trigger.getAttribute("aria-disabled")).toBe("true");
    expect(trigger.getAttribute("tabindex")).toBe("-1");

    trigger.click();
    await flushPromises();

    expect(contentOf()).toBeNull();

    wrapper.unmount();
  });

  it("toggles closed when the trigger is clicked while open", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    const trigger = triggerOf();

    trigger.click();
    await flushPromises();
    expect(contentOf()).not.toBeNull();

    trigger.click();
    await flushPromises();
    await wait(80);

    expect(contentOf()).toBeNull();

    wrapper.unmount();
  });
});
