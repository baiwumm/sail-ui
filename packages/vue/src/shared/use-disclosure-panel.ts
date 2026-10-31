import type {Ref} from "vue";

import {nextTick, watch} from "vue";

interface DisclosurePanelOptions {
  isExpanded: Ref<boolean>;
  panelRef: Ref<HTMLElement | null>;
}

/**
 * Mirrors React Aria's `DisclosurePanel`: the panel stays mounted, its height
 * is driven by `--disclosure-panel-height`, and it becomes
 * `hidden="until-found"` only after the collapse transition finishes.
 *
 * Reka's `CollapsibleContent` cannot back this contract because it unmounts the
 * panel and exposes `--reka-collapsible-content-height` instead.
 */
export function useDisclosurePanel({isExpanded, panelRef}: DisclosurePanelOptions) {
  const initialHeight = isExpanded.value ? "auto" : "0px";
  const initialHidden: "until-found" | undefined = isExpanded.value ? undefined : "until-found";
  let sequence = 0;

  async function waitForAnimations(panel: HTMLElement) {
    if (typeof panel.getAnimations !== "function") {
      return;
    }

    await Promise.all(
      panel.getAnimations().map((animation) => animation.finished.catch(() => undefined)),
    );
  }

  async function expand(panel: HTMLElement) {
    panel.removeAttribute("hidden");
    panel.style.setProperty("--disclosure-panel-height", `${panel.scrollHeight}px`);
    await nextTick();
    // Force the pixel height to be applied before the transition starts.
    void panel.offsetHeight;
    await waitForAnimations(panel);

    if (isExpanded.value) {
      panel.style.setProperty("--disclosure-panel-height", "auto");
    }
  }

  async function collapse(panel: HTMLElement, token: number) {
    panel.style.setProperty("--disclosure-panel-height", `${panel.scrollHeight}px`);
    void panel.offsetHeight;
    panel.style.setProperty("--disclosure-panel-height", "0px");
    await waitForAnimations(panel);

    if (token === sequence && !isExpanded.value) {
      panel.setAttribute("hidden", "until-found");
    }
  }

  watch(
    isExpanded,
    (expanded) => {
      const panel = panelRef.value;

      if (!panel) {
        return;
      }

      sequence += 1;

      if (expanded) {
        void expand(panel);
      } else {
        void collapse(panel, sequence);
      }
    },
    {flush: "post"},
  );

  return {initialHeight, initialHidden};
}
