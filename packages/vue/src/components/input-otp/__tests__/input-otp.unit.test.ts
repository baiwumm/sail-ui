import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {h, nextTick, type VNode} from "vue";

import {
  InputOtpGroup,
  InputOtpRoot,
  InputOtpSeparator,
  InputOtpSlot,
  REGEXP_ONLY_DIGITS,
} from "../index";

function groupedSlots(count: number): VNode[] {
  const slots = Array.from({length: count}, (_, index) => h(InputOtpSlot, {index}));
  const split = Math.ceil(count / 2);

  return [
    h(InputOtpGroup, null, {default: () => slots.slice(0, split)}),
    h(InputOtpSeparator),
    h(InputOtpGroup, null, {default: () => slots.slice(split)}),
  ];
}

function mountOtp(
  props: Record<string, unknown> = {},
  options: {count?: number; name?: string} = {},
) {
  return mount(InputOtpRoot, {
    attachTo: document.body,
    props: {maxLength: 6, ...props},
    slots: {default: () => groupedSlots(options.count ?? 6)},
  });
}

function inputElements(wrapper: ReturnType<typeof mountOtp>) {
  return wrapper.findAll("input.input-otp__input");
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("InputOtp", () => {
  it("renders the upstream contract and slot values", async () => {
    const wrapper = mountOtp({defaultValue: "123"});

    await nextTick();

    const root = wrapper.get("[data-slot='input-otp']");

    expect(root.classes()).toContain("input-otp");
    expect(root.classes()).toContain("input-otp--primary");
    expect(root.attributes("data-disabled")).toBeUndefined();
    expect(root.attributes("data-invalid")).toBeUndefined();
    expect(root.attributes("data-complete")).toBeUndefined();
    expect(wrapper.findAll("[data-slot='input-otp-group']")).toHaveLength(2);
    expect(wrapper.findAll("[data-slot='input-otp-separator']")).toHaveLength(1);
    expect(wrapper.findAll("[data-slot='input-otp-slot']")).toHaveLength(6);
    expect(wrapper.findAll("[data-slot='input-otp-slot-value']")).toHaveLength(3);
    expect(wrapper.find("[data-slot='input-otp-caret']").exists()).toBe(false);
    expect(wrapper.get("[data-slot='input-otp-slot']").attributes("data-filled")).toBe("true");
    expect(wrapper.findAll("[data-slot='input-otp-slot']")[5]?.attributes("data-filled")).toBe(
      undefined,
    );
    expect(inputElements(wrapper)).toHaveLength(6);
    expect(inputElements(wrapper)[0]?.attributes("aria-label")).toBe("pin input 1 of 6");

    wrapper.unmount();
  });

  it("submits the value through a named form input", async () => {
    const wrapper = mountOtp({defaultValue: "123", name: "code"});

    await nextTick();

    const formInput = wrapper.get("input[aria-hidden='true']");

    expect(formInput.attributes("name")).toBe("code");
    expect((formInput.element as HTMLInputElement).value).toBe("123");

    wrapper.unmount();
  });

  it("fills slots, emits updates, and moves focus as the user types", async () => {
    const wrapper = mountOtp();

    await nextTick();

    const inputs = inputElements(wrapper);

    (inputs[0]?.element as HTMLInputElement).focus();
    await inputs[0]?.setValue("1");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["1"]);
    expect(wrapper.get("[data-slot='input-otp-slot']").attributes("data-filled")).toBe("true");
    expect(document.activeElement).toBe(inputs[1]?.element);

    await inputs[1]?.setValue("2");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["12"]);
    expect(wrapper.findAll("[data-slot='input-otp-slot-value']")).toHaveLength(2);

    wrapper.unmount();
  });

  it("accepts a pasted code and emits complete once", async () => {
    const wrapper = mountOtp();

    await nextTick();

    const input = inputElements(wrapper)[0];

    if (!input) {
      throw new Error("missing input");
    }

    const pasteEvent = new Event("paste", {bubbles: true, cancelable: true});

    Object.defineProperty(pasteEvent, "clipboardData", {
      value: {getData: () => "123456"},
    });
    input.element.dispatchEvent(pasteEvent);

    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["123456"]);
    expect(wrapper.emitted("complete")).toHaveLength(1);
    expect(wrapper.emitted("complete")?.at(-1)).toEqual(["123456"]);
    expect(wrapper.get("[data-slot='input-otp']").attributes("data-complete")).toBe("true");
    expect(wrapper.findAll("[data-slot='input-otp-slot-value']")).toHaveLength(6);

    wrapper.unmount();
  });

  it("rejects characters that do not match the pattern", async () => {
    const wrapper = mountOtp({
      defaultValue: "12",
      maxLength: 4,
      pattern: REGEXP_ONLY_DIGITS,
    });

    await nextTick();

    const inputs = inputElements(wrapper);

    await inputs[2]?.setValue("a");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.findAll("[data-slot='input-otp-slot-value']")).toHaveLength(2);

    await inputs[2]?.setValue("3");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["123"]);

    wrapper.unmount();
  });

  it("supports controlled values and external completion", async () => {
    const wrapper = mountOtp({modelValue: "12"});

    await nextTick();

    await inputElements(wrapper)[2]?.setValue("3");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["123"]);
    expect(wrapper.findAll("[data-slot='input-otp-slot-value']")).toHaveLength(2);

    await wrapper.setProps({modelValue: "123"});

    expect(wrapper.findAll("[data-slot='input-otp-slot-value']")).toHaveLength(3);

    await wrapper.setProps({modelValue: "123456"});
    await nextTick();

    expect(wrapper.emitted("complete")?.at(-1)).toEqual(["123456"]);
    expect(wrapper.get("[data-slot='input-otp']").attributes("data-complete")).toBe("true");

    wrapper.unmount();
  });

  it("removes the previous character on backspace", async () => {
    const wrapper = mountOtp({defaultValue: "12"});

    await nextTick();

    const inputs = inputElements(wrapper);

    (inputs[2]?.element as HTMLInputElement).focus();
    await inputs[2]?.trigger("keydown", {key: "Backspace"});
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["1"]);
    expect(wrapper.findAll("[data-slot='input-otp-slot-value']")).toHaveLength(1);

    wrapper.unmount();
  });

  it("exposes the active slot and its caret", async () => {
    const wrapper = mountOtp({defaultValue: "1"});

    await nextTick();

    const slots = wrapper.findAll("[data-slot='input-otp-slot']");
    const inputs = inputElements(wrapper);

    (inputs[1]?.element as HTMLInputElement).focus();
    await nextTick();

    expect(slots[1]?.attributes("data-active")).toBe("true");
    expect(slots[1]?.find("[data-slot='input-otp-caret']").exists()).toBe(true);
    expect(slots[0]?.attributes("data-active")).toBeUndefined();

    (inputs[1]?.element as HTMLInputElement).blur();
    await nextTick();

    expect(slots[1]?.attributes("data-active")).toBeUndefined();
    expect(wrapper.find("[data-slot='input-otp-caret']").exists()).toBe(false);

    wrapper.unmount();
  });

  it("moves focus with arrow keys", async () => {
    const wrapper = mountOtp({defaultValue: "12"});

    await nextTick();

    const inputs = inputElements(wrapper);

    (inputs[0]?.element as HTMLInputElement).focus();
    await inputs[0]?.trigger("keydown", {key: "ArrowRight"});

    expect(document.activeElement).toBe(inputs[1]?.element);

    await inputs[1]?.trigger("keydown", {key: "ArrowLeft"});

    expect(document.activeElement).toBe(inputs[0]?.element);

    wrapper.unmount();
  });

  it("applies disabled, invalid, and variant states", async () => {
    const wrapper = mountOtp({
      defaultValue: "1",
      isDisabled: true,
      isInvalid: true,
      variant: "secondary",
    });

    await nextTick();

    const root = wrapper.get("[data-slot='input-otp']");

    expect(root.classes()).toContain("input-otp--secondary");
    expect(root.attributes("data-disabled")).toBe("true");
    expect(root.attributes("data-invalid")).toBe("true");
    expect((inputElements(wrapper)[0]?.element as HTMLInputElement).disabled).toBe(true);

    const slot = wrapper.get("[data-slot='input-otp-slot']");

    expect(slot.attributes("data-disabled")).toBe("true");
    expect(slot.attributes("data-invalid")).toBe("true");

    wrapper.unmount();
  });

  it("merges consumer classes and forwards attributes", async () => {
    const wrapper = mount(InputOtpRoot, {
      attachTo: document.body,
      attrs: {class: "custom-otp", "data-testid": "otp"},
      props: {defaultValue: "1", maxLength: 4},
      slots: {default: () => groupedSlots(4)},
    });

    await nextTick();

    const root = wrapper.get("[data-slot='input-otp']");

    expect(root.classes()).toContain("input-otp");
    expect(root.classes()).toContain("custom-otp");
    expect(root.attributes("data-testid")).toBe("otp");

    wrapper.unmount();
  });
});
