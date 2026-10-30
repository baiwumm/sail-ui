import {computed, useAttrs} from "vue";

/**
 * Splits the fallthrough attributes from the consumer `class`.
 *
 * Components merge the consumer `class` into their variant classes with `cx()`.
 * Forwarding the original `class` as well would duplicate it on the rendered
 * element, because Vue merges both class values instead of replacing one.
 */
export function useForwardedAttrs() {
  const attrs = useAttrs();

  const forwarded = computed(() => {
    const rest = {...attrs};

    delete rest.class;

    return rest;
  });

  return {
    attrs,
    forwarded,
    className: computed(() => attrs.class as string | undefined),
  };
}
