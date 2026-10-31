import type {UseOverlayStateReturn} from "@sail-ui/primitives";
import type {colorPickerVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";

import {inject} from "vue";

export interface ColorPickerRootContext {
  slots: ComputedRef<ReturnType<typeof colorPickerVariants>>;
  overlay: UseOverlayStateReturn;
  triggerRef: Ref<HTMLElement | null>;
}

export const colorPickerRootContextKey: InjectionKey<ColorPickerRootContext> =
  Symbol("sail-color-picker-root");

export function useColorPickerRootContext() {
  const context = inject(colorPickerRootContextKey);

  if (!context) {
    throw new Error("ColorPicker parts must be used inside <ColorPickerRoot>.");
  }

  return context;
}
