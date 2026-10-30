import type {MaybeRefOrGetter} from "vue";

import {onBeforeUnmount, ref, toValue} from "vue";

import {resolveElement} from "./element";

/**
 * Resolves the positioned element from a Reka Popper content component ref.
 * Reka renders the content inside `[data-reka-popper-content-wrapper]`.
 */
export function popperContentElement(value: unknown): HTMLElement | null {
  const root = resolveElement(value);

  if (!root) {
    return null;
  }

  if (root.hasAttribute("data-reka-popper-content-wrapper")) {
    const child = root.firstElementChild;

    return child instanceof HTMLElement ? child : null;
  }

  return root;
}

/**
 * Reka reports the resolved Floating UI side as `data-side`; the upstream CSS
 * selects on `data-placement`. Mirrors the side onto the content element.
 */
export function useDataPlacement(fallback: MaybeRefOrGetter<string | undefined>) {
  const element = ref<HTMLElement | null>(null);
  let observer: MutationObserver | null = null;

  const apply = () => {
    const target = element.value;

    if (!target) {
      return;
    }

    const placement = target.getAttribute("data-side") ?? toValue(fallback);

    if (placement && target.getAttribute("data-placement") !== placement) {
      target.setAttribute("data-placement", placement);
    }
  };

  const attach = (next: HTMLElement | null) => {
    observer?.disconnect();
    observer = null;

    if (next === element.value) {
      apply();
      return;
    }

    element.value = next;

    if (!next) {
      return;
    }

    apply();
    observer = new MutationObserver(apply);
    observer.observe(next, {attributeFilter: ["data-side"], attributes: true});
  };

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });

  return {element, attach};
}
