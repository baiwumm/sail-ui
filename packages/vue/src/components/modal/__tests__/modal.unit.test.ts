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

const Host = {
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
  template: `
    <Modal>
      <ModalTrigger>Open Modal</ModalTrigger>
      <ModalBackdrop>
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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

afterEach(() => {
  document.body.replaceChildren();
});

describe("Modal", () => {
  it("renders only the trigger while closed", () => {
    const wrapper = mount(Host, {attachTo: document.body});

    expect(document.querySelector('[data-slot="modal-trigger"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-backdrop"]')).toBeNull();
    expect(document.querySelector('[data-slot="modal-dialog"]')).toBeNull();

    wrapper.unmount();
  });

  it("opens with the upstream data-slot contract and dialog semantics", async () => {
    const wrapper = mount(Host, {attachTo: document.body});

    await wrapper.get("button").trigger("click");
    await flushPromises();

    const backdrop = document.querySelector('[data-slot="modal-backdrop"]');
    const container = document.querySelector('[data-slot="modal-container"]');
    const dialog = document.querySelector<HTMLElement>('[data-slot="modal-dialog"]');
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

    wrapper.unmount();
    await nextTick();
  });

  it("closes on Escape and releases the backdrop after the exit hold", async () => {
    const wrapper = mount(Host, {attachTo: document.body});

    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(document.querySelector('[data-slot="modal-backdrop"]')).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Escape"}));
    await flushPromises();
    await wait(80);

    expect(document.querySelector('[data-slot="modal-backdrop"]')).toBeNull();

    wrapper.unmount();
  });

  it("closes when the close trigger is pressed", async () => {
    const wrapper = mount(Host, {attachTo: document.body});

    await wrapper.get("button").trigger("click");
    await flushPromises();

    const closeTrigger = document.querySelector<HTMLButtonElement>(
      '[data-slot="modal-close-trigger"]',
    );

    closeTrigger?.click();
    await flushPromises();
    await wait(80);

    expect(document.querySelector('[data-slot="modal-backdrop"]')).toBeNull();

    wrapper.unmount();
  });
});
