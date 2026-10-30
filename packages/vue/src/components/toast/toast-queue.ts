import type {
  QueuedToast,
  ToastContentValue,
  ToastFunction,
  ToastOptions,
  ToastPromiseOptions,
  ToastQueueLike,
  ToastTimerLike,
} from "./types";

import {shallowRef} from "vue";

export const DEFAULT_GAP = 12;
export const DEFAULT_MAX_VISIBLE_TOAST = 3;
export const DEFAULT_SCALE_FACTOR = 0.05;
export const DEFAULT_TOAST_WIDTH = 460;
export const DEFAULT_TOAST_TIMEOUT = 4000;
export const DEFAULT_EXIT_DURATION = 300;
export const DEFAULT_HOTKEY: string[] = ["altKey", "KeyT"];

const now = () =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

class ManagedToastTimer implements ToastTimerLike {
  timerId: ReturnType<typeof setTimeout> | null | undefined;
  private startTime: number | null = null;
  private remaining: number;
  private readonly callback: () => void;

  constructor(callback: () => void, delay: number) {
    this.remaining = delay;
    this.callback = callback;
  }

  reset(delay: number): void {
    this.pause();
    this.remaining = delay;
    this.resume();
  }

  pause(): void {
    if (this.timerId == null) {
      return;
    }

    clearTimeout(this.timerId);
    this.timerId = null;
    this.remaining -= now() - (this.startTime ?? now());
  }

  resume(): void {
    if (this.remaining <= 0 || this.timerId != null) {
      return;
    }

    this.startTime = now();
    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.remaining = 0;
      this.callback();
    }, this.remaining);
  }
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  Boolean(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

export interface ToastQueueOptions {
  /** How long a closing toast stays mounted for its exit animation. */
  exitDuration?: number;
  maxVisibleToasts?: number;
}

/**
 * Per-app toast queue. Every close path funnels through `close()` so closing
 * toasts keep their DOM for the CSS exit animation, and every suspension
 * source pauses the shared timers exactly once.
 */
export class ToastQueue<T extends object = ToastContentValue> implements ToastQueueLike<T> {
  private toastList = shallowRef<QueuedToast<T>[]>([]);
  private exiting = shallowRef<ReadonlySet<string>>(new Set());
  private readonly exitTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly suspensions = new Set<string>();
  private readonly exitDuration: number;
  private readonly limits: ToastQueueOptions;
  private count = 0;

  constructor(options: ToastQueueOptions = {}) {
    this.exitDuration = options.exitDuration ?? DEFAULT_EXIT_DURATION;
    this.limits = options;
  }

  get maxVisibleToasts(): number | undefined {
    return this.limits.maxVisibleToasts;
  }

  get visibleToasts(): QueuedToast<T>[] {
    return this.toastList.value;
  }

  get exitingKeys(): ReadonlySet<string> {
    return this.exiting.value;
  }

  add(content: T, options: {timeout?: number; onClose?: () => void} = {}): string {
    const key = `sail-toast-${++this.count}`;
    const timeout = options.timeout ?? DEFAULT_TOAST_TIMEOUT;
    const item: QueuedToast<T> = {
      content,
      key,
      onClose: options.onClose,
      timeout,
      timer: null,
    };

    if (timeout > 0) {
      item.timer = new ManagedToastTimer(() => this.close(key), timeout);

      if (this.suspensions.size === 0) {
        item.timer.resume();
      }
    }

    this.toastList.value = [item, ...this.toastList.value];

    return key;
  }

  close(key: string): void {
    const item = this.toastList.value.find((toast) => toast.key === key);

    if (!item || this.exitTimers.has(key)) {
      return;
    }

    item.timer?.pause();
    item.timer = null;

    const onClose = item.onClose;

    item.onClose = undefined;

    const canAnimate =
      this.exitDuration > 0 && typeof window !== "undefined" && !prefersReducedMotion();

    if (!canAnimate) {
      this.remove(key);
      onClose?.();

      return;
    }

    this.exitTimers.set(
      key,
      setTimeout(() => {
        this.exitTimers.delete(key);
        this.remove(key);
        this.notifyExiting();
      }, this.exitDuration),
    );
    this.notifyExiting();
    onClose?.();
  }

  update(key: string, content: T, options: {onClose?: () => void; timeout?: number} = {}): boolean {
    if (this.exitTimers.has(key)) {
      return false;
    }

    const item = this.toastList.value.find((toast) => toast.key === key);

    if (!item) {
      return false;
    }

    let timer = item.timer;
    let timeout = item.timeout;

    if (options.timeout !== undefined) {
      timer?.pause();
      timeout = options.timeout;

      if (options.timeout > 0) {
        timer = new ManagedToastTimer(() => this.close(key), options.timeout);

        if (this.suspensions.size === 0) {
          timer.resume();
        }
      } else {
        timer = null;
      }
    }

    const next: QueuedToast<T> = {
      ...item,
      content,
      onClose: "onClose" in options ? options.onClose : item.onClose,
      timeout,
      timer,
    };

    this.toastList.value = this.toastList.value.map((toast) => (toast.key === key ? next : toast));

    return true;
  }

  suspendTimers(source: string): void {
    const wasEmpty = this.suspensions.size === 0;

    this.suspensions.add(source);

    if (wasEmpty) {
      for (const toast of this.toastList.value) {
        toast.timer?.pause();
      }
    }
  }

  resumeTimers(source: string): void {
    this.suspensions.delete(source);

    if (this.suspensions.size === 0) {
      for (const toast of this.toastList.value) {
        toast.timer?.resume();
      }
    }
  }

  pauseAll(): void {
    this.suspendTimers("external");
  }

  resumeAll(): void {
    this.resumeTimers("external");
  }

  clear(): void {
    for (const toast of [...this.toastList.value]) {
      this.close(toast.key);
    }
  }

  destroy(): void {
    for (const timeout of this.exitTimers.values()) {
      clearTimeout(timeout);
    }

    this.exitTimers.clear();
    this.exiting.value = new Set();
    this.suspensions.clear();

    for (const toast of this.toastList.value) {
      toast.timer?.pause();
    }
  }

  private remove(key: string): void {
    this.toastList.value = this.toastList.value.filter((toast) => toast.key !== key);
  }

  private notifyExiting(): void {
    this.exiting.value = new Set(this.exitTimers.keys());
  }
}

function createContent(message: unknown, options?: ToastOptions): ToastContentValue {
  return {
    actionProps: options?.actionProps,
    description: options?.description,
    indicator: options?.indicator,
    isLoading: options?.isLoading,
    title: message as ToastContentValue["title"],
    variant: options?.variant || "default",
  };
}

function createAddOptions(options?: ToastOptions) {
  return {
    onClose: options?.onClose,
    timeout: options?.timeout ?? DEFAULT_TOAST_TIMEOUT,
  };
}

function createUpdateOptions(options?: ToastOptions) {
  return {
    ...(options && "timeout" in options ? {timeout: options.timeout} : null),
    ...(options && "onClose" in options ? {onClose: options.onClose} : null),
  };
}

export function createToastFunction(queue: ToastQueueLike<ToastContentValue>): ToastFunction {
  const toast = ((message, options) =>
    queue.add(createContent(message, options), createAddOptions(options))) as ToastFunction;

  toast.success = (message, options) => toast(message, {...options, variant: "success"});
  toast.danger = (message, options) => toast(message, {...options, variant: "danger"});
  toast.info = (message, options) => toast(message, {...options, variant: "accent"});
  toast.warning = (message, options) => toast(message, {...options, variant: "warning"});

  toast.update = (id, message, options) => {
    const content = createContent(message, options);

    if (queue.update(id, content, createUpdateOptions(options))) {
      return id;
    }

    return queue.add(content, createAddOptions(options));
  };

  toast.promise = <Value>(
    promise: Promise<Value> | (() => Promise<Value>),
    options: ToastPromiseOptions<Value>,
  ) => {
    const pending = typeof promise === "function" ? promise() : promise;
    const loadingId = queue.add(createContent(options.loading, {isLoading: true}), {timeout: 0});

    pending
      .then((value) => {
        const message =
          typeof options.success === "function" ? options.success(value) : options.success;

        return toast.update(loadingId, message, {
          isLoading: false,
          timeout: DEFAULT_TOAST_TIMEOUT,
          variant: "success",
        });
      })
      .catch((error: Error) => {
        const message = typeof options.error === "function" ? options.error(error) : options.error;

        return toast.update(loadingId, message, {
          isLoading: false,
          timeout: DEFAULT_TOAST_TIMEOUT,
          variant: "danger",
        });
      });

    return loadingId;
  };

  toast.close = (key) => queue.close(key);
  toast.pauseAll = () => queue.pauseAll();
  toast.resumeAll = () => queue.resumeAll();
  toast.clear = () => queue.clear();

  return toast;
}
