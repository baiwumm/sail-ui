/**
 * Detects an in-progress IME composition.
 *
 * While a composition is active the browser still reports `keydown` events for
 * the keys that confirm the candidate. Treating them as regular activation
 * submits forms or selects options while the user is still typing.
 */
export function isComposing(event: KeyboardEvent): boolean {
  return event.isComposing || event.keyCode === 229;
}
