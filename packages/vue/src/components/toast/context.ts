import type {toastVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";

import {inject} from "vue";

import type {
  QueuedToast,
  ToastFunction,
  ToastPlacement,
  ToastQueueLike,
  ToastVariant,
} from "./types";

export type ToastSlots = ReturnType<typeof toastVariants>;

export interface ToastProviderContext {
  queue: ToastQueueLike;
  toast: ToastFunction;
  placement: ComputedRef<ToastPlacement>;
  slots: ComputedRef<ToastSlots>;
  scaleFactor: ComputedRef<number>;
  gap: ComputedRef<number>;
  isExpanded: ComputedRef<boolean>;
  maxVisibleToasts: ComputedRef<number>;
  toasts: ComputedRef<QueuedToast[]>;
  exitingKeys: ComputedRef<ReadonlySet<string>>;
  heights: Ref<Record<string, number>>;
  onHeightChange: (key: string, height: number) => void;
  onHeightRemove: (key: string) => void;
}

export interface ToastItemContext {
  toast: QueuedToast;
  variant: ComputedRef<ToastVariant>;
  titleId: string;
  descriptionId: string;
  hasTitle: Ref<boolean>;
  hasDescription: Ref<boolean>;
  setHasTitle: (value: boolean) => void;
  setHasDescription: (value: boolean) => void;
}

export const toastProviderContextKey: InjectionKey<ToastProviderContext> = Symbol("sail-toast");

export const toastItemContextKey: InjectionKey<ToastItemContext> = Symbol("sail-toast-item");

export function useToastProviderContext(): ToastProviderContext {
  const context = inject(toastProviderContextKey);

  if (!context) {
    throw new Error("Toast parts must be used inside <ToastProvider>.");
  }

  return context;
}

export function useToastItemContext(): ToastItemContext {
  const context = inject(toastItemContextKey);

  if (!context) {
    throw new Error("Toast parts must be used inside <Toast>.");
  }

  return context;
}
