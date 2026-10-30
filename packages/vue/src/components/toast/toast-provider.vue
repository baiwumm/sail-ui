<script setup lang="ts">
import type {ToastContentValue, ToastProviderProps, ToastQueueLike} from "./types";

import {toastVariants} from "@sail-ui/styles";
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useAttrs,
  watch,
  type VNodeChild,
} from "vue";

import Spinner from "../spinner/spinner.vue";
import {useForwardedAttrs} from "../../shared/attrs";
import {toastProviderContextKey} from "./context";
import {
  createToastFunction,
  DEFAULT_GAP,
  DEFAULT_HOTKEY,
  DEFAULT_MAX_VISIBLE_TOAST,
  DEFAULT_SCALE_FACTOR,
  DEFAULT_TOAST_WIDTH,
  ToastQueue,
} from "./toast-queue";
import Toast from "./toast.vue";
import ToastActionButton from "./toast-action-button.vue";
import ToastCloseButton from "./toast-close-button.vue";
import ToastContent from "./toast-content.vue";
import ToastDescription from "./toast-description.vue";
import ToastIndicator from "./toast-indicator.vue";
import ToastTitle from "./toast-title.vue";

defineOptions({name: "SailToastProvider", inheritAttrs: false});

const props = withDefaults(defineProps<ToastProviderProps>(), {
  gap: DEFAULT_GAP,
  hotkey: () => [...DEFAULT_HOTKEY],
  isExpanded: false,
  placement: "bottom",
  scaleFactor: DEFAULT_SCALE_FACTOR,
  teleport: "body",
  width: DEFAULT_TOAST_WIDTH,
});

const MODIFIER_PROPS = ["altKey", "ctrlKey", "metaKey", "shiftKey"] as const;
const {className, forwarded} = useForwardedAttrs();
const attrs = useAttrs();
const queue: ToastQueueLike = props.queue ?? new ToastQueue();
const ownsQueue = props.queue === undefined;
const toast = createToastFunction(queue as ToastQueue<ToastContentValue>);
const slots = computed(() => toastVariants({placement: props.placement}));
const toasts = computed(() => queue.visibleToasts);
const exitingKeys = computed(() => queue.exitingKeys);
const maxVisibleToasts = computed(
  () =>
    props.maxVisibleToasts ?? (queue as ToastQueue).maxVisibleToasts ?? DEFAULT_MAX_VISIBLE_TOAST,
);
const heights = ref<Record<string, number>>({});
const isMounted = ref(false);
const isPointerOrFocusWithin = ref(false);
const isDocumentHidden = ref(false);
const regionRef = ref<HTMLElement | null>(null);
let pointerWithin = false;
let cleanupRegion: (() => void) | undefined;

const activeToastCount = computed(() => toasts.value.length - exitingKeys.value.size);
const isExpanded = computed(
  () => (props.isExpanded || isPointerOrFocusWithin.value) && activeToastCount.value > 1,
);

const context = {
  exitingKeys,
  gap: computed(() => props.gap),
  heights,
  isExpanded,
  maxVisibleToasts,
  onHeightChange(key: string, height: number) {
    if (heights.value[key] === height) {
      return;
    }

    heights.value = {...heights.value, [key]: height};
  },
  onHeightRemove(key: string) {
    if (!(key in heights.value)) {
      return;
    }

    const next = {...heights.value};

    delete next[key];
    heights.value = next;
  },
  placement: computed(() => props.placement),
  queue,
  scaleFactor: computed(() => props.scaleFactor),
  slots,
  toast,
  toasts,
};

provide(toastProviderContextKey, context);

const classNames = computed(() => className.value);
const regionClasses = computed(() =>
  [slots.value.region(), classNames.value].filter(Boolean).join(" "),
);
const regionStyle = computed(() => ({
  "--gap": `${props.gap}px`,
  "--placement": props.placement,
  "--scale-factor": String(props.scaleFactor),
  "--toast-width": typeof props.width === "number" ? `${props.width}px` : props.width,
  ...(attrs.style as Record<string, string> | undefined),
}));
const label = computed(
  () =>
    props.label ??
    `${activeToastCount.value} notification${activeToastCount.value === 1 ? "" : "s"}.`,
);
const loadingIndicator = computed(() => h(Spinner, {color: "current", size: "sm"}));

function collapseIfOutside() {
  const region = regionRef.value;

  if (!pointerWithin && !region?.contains(document.activeElement)) {
    isPointerOrFocusWithin.value = false;
  }
}

function handlePointerEnterOrMove(event: PointerEvent) {
  if (event.pointerType === "touch") {
    return;
  }

  pointerWithin = true;
  isPointerOrFocusWithin.value = true;
}

function handlePointerLeave(event: PointerEvent) {
  if (event.pointerType === "touch") {
    return;
  }

  pointerWithin = false;
  collapseIfOutside();
}

function handleFocusIn() {
  isPointerOrFocusWithin.value = true;
}

function handleFocusOut(event: FocusEvent) {
  if (event.relatedTarget instanceof Node && regionRef.value?.contains(event.relatedTarget)) {
    return;
  }

  collapseIfOutside();
}

function handleGlobalPointerOver(event: PointerEvent) {
  if (event.pointerType === "touch" || regionRef.value?.contains(event.target as Node)) {
    return;
  }

  pointerWithin = false;
  collapseIfOutside();
}

function handleRegionKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape") {
    return;
  }

  if (regionRef.value?.contains(document.activeElement)) {
    (document.activeElement as HTMLElement | null)?.blur();
  }

  pointerWithin = false;
  isPointerOrFocusWithin.value = false;
}

function handleDocumentKeyDown(event: KeyboardEvent) {
  const hotkey = props.hotkey;

  if (hotkey.length === 0 || !regionRef.value) {
    return;
  }

  const hasExpectedModifiers = MODIFIER_PROPS.every(
    (modifier) => event[modifier] === hotkey.includes(modifier),
  );
  const hasExpectedCodes = hotkey.every(
    (key) => MODIFIER_PROPS.includes(key as (typeof MODIFIER_PROPS)[number]) || event.code === key,
  );

  if (!hasExpectedModifiers || !hasExpectedCodes) {
    return;
  }

  event.preventDefault();
  regionRef.value.focus();
}

function bindRegion(element: HTMLElement | null) {
  cleanupRegion?.();
  cleanupRegion = undefined;

  if (!element) {
    return;
  }

  element.addEventListener("pointerenter", handlePointerEnterOrMove);
  element.addEventListener("pointermove", handlePointerEnterOrMove);
  element.addEventListener("pointerleave", handlePointerLeave);
  element.addEventListener("focusin", handleFocusIn);
  element.addEventListener("focusout", handleFocusOut);
  element.addEventListener("keydown", handleRegionKeyDown);
  document.addEventListener("pointerover", handleGlobalPointerOver, true);

  cleanupRegion = () => {
    element.removeEventListener("pointerenter", handlePointerEnterOrMove);
    element.removeEventListener("pointermove", handlePointerEnterOrMove);
    element.removeEventListener("pointerleave", handlePointerLeave);
    element.removeEventListener("focusin", handleFocusIn);
    element.removeEventListener("focusout", handleFocusOut);
    element.removeEventListener("keydown", handleRegionKeyDown);
    document.removeEventListener("pointerover", handleGlobalPointerOver, true);
    pointerWithin = false;
    isPointerOrFocusWithin.value = false;
  };
}

watch(regionRef, bindRegion, {flush: "post"});

watch(
  [isPointerOrFocusWithin, isDocumentHidden],
  ([within, hidden]) => {
    if (within || hidden) {
      queue.pauseAll();
    } else {
      queue.resumeAll();
    }
  },
  {flush: "post"},
);

function handleVisibilityChange() {
  isDocumentHidden.value = document.hidden;
}

function actionPropsOf(item: {content: ToastContentValue}) {
  if (!item.content.actionProps) {
    return {};
  }

  const {children: _children, ...rest} = item.content.actionProps;

  return rest;
}

const ContentNode = defineComponent({
  name: "ToastContentNode",
  props: {content: {type: null, default: undefined}},
  setup(contentProps) {
    return () => contentProps.content as VNodeChild;
  },
});

onMounted(() => {
  isMounted.value = true;
  document.addEventListener("keydown", handleDocumentKeyDown);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  isDocumentHidden.value = document.hidden;
});

onBeforeUnmount(() => {
  cleanupRegion?.();
  document.removeEventListener("keydown", handleDocumentKeyDown);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  queue.resumeAll();

  if (ownsQueue) {
    queue.destroy();
  }
});
</script>

<template>
  <slot />
  <Teleport v-if="isMounted && toasts.length > 0" :to="teleport">
    <div
      ref="regionRef"
      v-bind="forwarded"
      :aria-label="label"
      :class="regionClasses"
      :data-expanded="isExpanded ? 'true' : undefined"
      :data-slot="'toast-region'"
      :style="regionStyle"
      role="region"
      tabindex="-1"
    >
      <template v-for="item in toasts" :key="item.key">
        <slot name="toast" :is-loading="Boolean(item.content.isLoading)" :toast="item">
          <Toast
            :placement="placement"
            :scale-factor="scaleFactor"
            :toast="item"
            :variant="item.content.variant"
          >
            <ToastIndicator
              v-if="item.content.indicator !== null"
              :indicator="item.content.isLoading ? loadingIndicator : item.content.indicator"
              :variant="item.content.variant"
            />
            <ToastContent
              v-if="item.content.title !== undefined || item.content.description !== undefined"
            >
              <ToastTitle v-if="item.content.title !== undefined">
                <ContentNode :content="item.content.title" />
              </ToastTitle>
              <ToastDescription v-if="item.content.description !== undefined">
                <ContentNode :content="item.content.description" />
              </ToastDescription>
            </ToastContent>
            <ToastActionButton
              v-if="item.content.actionProps?.children"
              v-bind="actionPropsOf(item)"
            >
              <ContentNode :content="item.content.actionProps.children" />
            </ToastActionButton>
            <ToastCloseButton />
          </Toast>
        </slot>
      </template>
    </div>
  </Teleport>
</template>
