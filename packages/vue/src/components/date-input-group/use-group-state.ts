import {useFocusRing, useHover} from "@sail-ui/primitives";
import {ref, type Ref} from "vue";

/**
 * Shared interaction state for the date input group and its inner input.
 * Both upstream parts render RAC groups and emit the same `data-*` states.
 */
export function useGroupState(target: Ref<HTMLElement | null>, isDisabled: () => boolean) {
  const isFocusWithin = ref(false);
  const {isHovered} = useHover(target, {isDisabled});
  const {isFocusVisible} = useFocusRing(target, {isDisabled, within: true});

  function handleFocusIn() {
    isFocusWithin.value = true;
  }

  function handleFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;

    if (target.value && next && target.value.contains(next)) {
      return;
    }

    isFocusWithin.value = false;
  }

  return {
    handleFocusIn,
    handleFocusOut,
    isFocusVisible,
    isFocusWithin,
    isHovered,
  };
}
