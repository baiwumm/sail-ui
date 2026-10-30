import type {ToastProviderContext} from "./context";

import {inject} from "vue";

import ToastRoot from "./toast.vue";
import ToastActionButton from "./toast-action-button.vue";
import ToastCloseButton from "./toast-close-button.vue";
import ToastContent from "./toast-content.vue";
import ToastDescription from "./toast-description.vue";
import ToastIndicator from "./toast-indicator.vue";
import ToastProvider from "./toast-provider.vue";
import ToastTitle from "./toast-title.vue";
import {toastItemContextKey, toastProviderContextKey} from "./context";
import {ToastQueue} from "./toast-queue";

const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Provider: ToastProvider,
  Content: ToastContent,
  Indicator: ToastIndicator,
  Title: ToastTitle,
  Description: ToastDescription,
  ActionButton: ToastActionButton,
  CloseButton: ToastCloseButton,
  Queue: ToastQueue,
});

export {
  Toast,
  ToastRoot,
  ToastProvider,
  ToastContent,
  ToastIndicator,
  ToastTitle,
  ToastDescription,
  ToastActionButton,
  ToastCloseButton,
  ToastQueue,
};

export type {
  QueuedToast,
  ToastActionOptions,
  ToastContentValue,
  ToastFunction,
  ToastOptions,
  ToastPlacement,
  ToastPromiseOptions,
  ToastProviderProps,
  ToastQueueLike,
  ToastRootProps,
  ToastTimerLike,
  ToastVariant,
} from "./types";

export type {ToastProviderContext, ToastItemContext, ToastSlots} from "./context";

export {
  createToastFunction,
  DEFAULT_EXIT_DURATION,
  DEFAULT_GAP,
  DEFAULT_HOTKEY,
  DEFAULT_MAX_VISIBLE_TOAST,
  DEFAULT_SCALE_FACTOR,
  DEFAULT_TOAST_TIMEOUT,
  DEFAULT_TOAST_WIDTH,
} from "./toast-queue";

export {toastVariants, type ToastVariants} from "@sail-ui/styles";

export function useToast() {
  const context = inject<ToastProviderContext | null>(toastProviderContextKey, null);

  if (!context) {
    throw new Error("useToast() must be called inside <ToastProvider>.");
  }

  return context.toast;
}

export {toastItemContextKey, toastProviderContextKey};
