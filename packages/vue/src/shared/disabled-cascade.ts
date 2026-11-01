import {computed, inject, type ComputedRef, type InjectionKey, type Ref} from "vue";

/**
 * Provided by `<Fieldset isDisabled>` so controls the native
 * `<fieldset disabled>` cannot reach — div-based widgets and self-implemented
 * controls — still cascade the disabled state, like the upstream React
 * context injections do.
 */
export const disabledCascadeKey: InjectionKey<Ref<boolean>> = Symbol("sail-disabled-cascade");

export function useDisabledCascade(): ComputedRef<boolean> {
  const cascade = inject(disabledCascadeKey, null);

  return computed(() => cascade?.value ?? false);
}
