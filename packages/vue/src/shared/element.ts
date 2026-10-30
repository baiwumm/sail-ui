import type {ComponentPublicInstance} from "vue";

/**
 * Reka's content roots can be fragment components, so their `$el` is sometimes
 * a text/comment node; the rendered element is its next sibling or parent.
 */
export function resolveElement(element: unknown): HTMLElement | null {
  if (element instanceof HTMLElement) {
    return element;
  }

  const exposed = element as (ComponentPublicInstance & {$el?: unknown}) | null;
  const root = exposed?.$el;

  if (root instanceof HTMLElement) {
    return root;
  }

  if (root instanceof Node) {
    const sibling = (root as CharacterData).nextElementSibling ?? root.parentElement;

    return sibling instanceof HTMLElement ? sibling : null;
  }

  return null;
}
