import type {ToastVariants} from "@sail-ui/styles";
import type {ButtonProps} from "../button/types";
import type {VNodeChild} from "vue";

export type ToastPlacement = NonNullable<ToastVariants["placement"]>;
export type ToastVariant = NonNullable<ToastVariants["variant"]>;

export interface ToastActionOptions extends ButtonProps {
  children?: VNodeChild;
}

export interface ToastContentValue {
  /** `null` hides the indicator. */
  indicator?: VNodeChild | null;
  title?: VNodeChild;
  description?: VNodeChild;
  variant?: ToastVariant;
  actionProps?: ToastActionOptions;
  isLoading?: boolean;
}

export interface ToastOptions {
  description?: VNodeChild;
  /** `null` hides the indicator. */
  indicator?: VNodeChild | null;
  variant?: ToastVariant;
  actionProps?: ToastActionOptions;
  isLoading?: boolean;
  /**
   * Auto-dismiss timeout in milliseconds; 0 keeps the toast open.
   * @default 4000
   */
  timeout?: number;
  /** Called when the toast is dismissed; the exit animation may still be playing. */
  onClose?: () => void;
}

export interface ToastPromiseOptions<T = unknown> {
  loading: VNodeChild;
  success: ((data: T) => VNodeChild) | VNodeChild;
  error: ((error: Error) => VNodeChild) | VNodeChild;
}

export interface ToastRootProps {
  toast: QueuedToast;
  placement?: ToastPlacement;
  scaleFactor?: number;
  variant?: ToastVariant;
}

export interface ToastProviderProps {
  /** Accessible name of the region. Defaults to a localized count such as "1 notification." */
  label?: string;
  /** Gap between toasts in pixels. */
  gap?: number;
  /** Keeps the stack expanded instead of expanding on hover or focus. */
  isExpanded?: boolean;
  /** Visual cap on rendered toasts; older ones stay queued but hidden. */
  maxVisibleToasts?: number;
  /** Modifiers match KeyboardEvent boolean props; other entries match event.code. */
  hotkey?: string[];
  /** How much each toast behind the front one scales down. */
  scaleFactor?: number;
  /** Toast width in pixels, or any CSS length. */
  width?: number | string;
  /** Custom queue. Defaults to a queue created for this provider. */
  queue?: ToastQueueLike;
  /** Teleport target. Defaults to `body`. */
  teleport?: string | HTMLElement;
  /** Placement of the region. */
  placement?: ToastPlacement;
}

export interface QueuedToast<T extends object = ToastContentValue> {
  key: string;
  content: T;
  timeout: number;
  onClose?: () => void;
  timer: ToastTimerLike | null;
}

export interface ToastTimerLike {
  timerId?: ReturnType<typeof setTimeout> | null;
  pause(): void;
  reset(delay: number): void;
  resume(): void;
}

export interface ToastQueueLike<T extends object = ToastContentValue> {
  readonly visibleToasts: QueuedToast<T>[];
  readonly exitingKeys: ReadonlySet<string>;
  add(content: T, options?: {timeout?: number; onClose?: () => void}): string;
  close(key: string): void;
  update(key: string, content: T, options?: {onClose?: () => void; timeout?: number}): boolean;
  pauseAll(): void;
  resumeAll(): void;
  clear(): void;
  destroy(): void;
}

export type ToastFunction = {
  (message: VNodeChild, options?: ToastOptions): string;
  success(message: VNodeChild, options?: Omit<ToastOptions, "variant">): string;
  danger(message: VNodeChild, options?: Omit<ToastOptions, "variant">): string;
  info(message: VNodeChild, options?: Omit<ToastOptions, "variant">): string;
  warning(message: VNodeChild, options?: Omit<ToastOptions, "variant">): string;
  update(id: string, message: VNodeChild, options?: ToastOptions): string;
  promise<T>(promise: Promise<T> | (() => Promise<T>), options: ToastPromiseOptions<T>): string;
  close(key: string): void;
  pauseAll(): void;
  resumeAll(): void;
  clear(): void;
};
