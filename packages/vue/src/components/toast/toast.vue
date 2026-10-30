<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useId, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {toastItemContextKey, useToastProviderContext} from "./context";
import type {ToastRootProps} from "./types";

defineOptions({name: "SailToast", inheritAttrs: false});

const props = defineProps<ToastRootProps>();

const provider = useToastProviderContext();
const {className, forwarded} = useForwardedAttrs();
const rootRef = ref<HTMLElement | null>(null);
const id = useId();
const titleId = `${id}-title`;
const descriptionId = `${id}-description`;
const hasTitle = ref(false);
const hasDescription = ref(false);
const isEntering = ref(true);
const measuredHeight = ref<number | undefined>(undefined);
let resizeObserver: ResizeObserver | null = null;
let enterFrame = 0;
let innerEnterFrame = 0;

const variant = computed(() => props.variant ?? props.toast.content.variant ?? "default");
const placement = computed(() => props.placement ?? provider.placement.value);
const scaleFactor = computed(() => props.scaleFactor ?? provider.scaleFactor.value);
const isExiting = computed(() => provider.exitingKeys.value.has(props.toast.key));
const layoutToasts = computed(() =>
  provider.toasts.value.filter(
    (toast) => !provider.exitingKeys.value.has(toast.key) || toast.key === props.toast.key,
  ),
);
const fullIndex = computed(() => provider.toasts.value.indexOf(props.toast));
const index = computed(() => layoutToasts.value.indexOf(props.toast));
const isFrontmost = computed(() => index.value <= 0);
const isHidden = computed(() => !isExiting.value && index.value >= provider.maxVisibleToasts.value);

const classes = computed(() =>
  cx(provider.slots.value.toast({variant: variant.value}), className.value),
);

const stackingStyle = computed(() => {
  const frontToast = layoutToasts.value[0];
  const frontHeight =
    (frontToast ? provider.heights.value[frontToast.key] : undefined) ?? measuredHeight.value ?? 0;
  let heightsBefore = 0;

  for (let position = 0; position < index.value; position += 1) {
    const key = layoutToasts.value[position]?.key;

    heightsBefore += (key ? provider.heights.value[key] : undefined) ?? frontHeight;
  }

  return {
    "--offset-collapsed": `${index.value * provider.gap.value}px`,
    "--offset-expanded": `${heightsBefore + index.value * provider.gap.value}px`,
    "--scale-collapsed": `${1 - index.value * scaleFactor.value}`,
    "--front-height": `${frontHeight}px`,
    ...(measuredHeight.value === undefined
      ? null
      : {"--toast-height": `${measuredHeight.value}px`}),
    zIndex: isExiting.value ? 0 : provider.toasts.value.length - fullIndex.value,
  };
});

const {isHovered} = useHover(rootRef);
const {isFocusVisible} = useFocusRing(rootRef);

provide(toastItemContextKey, {
  descriptionId,
  hasDescription,
  hasTitle,
  setHasDescription: (value: boolean) => {
    hasDescription.value = value;
  },
  setHasTitle: (value: boolean) => {
    hasTitle.value = value;
  },
  titleId,
  toast: props.toast,
  variant,
});

function measure() {
  const element = rootRef.value;

  if (!element) {
    return;
  }

  const previousHeight = element.style.height;

  element.style.height = "auto";
  measuredHeight.value = element.offsetHeight;
  element.style.height = previousHeight;
}

function removeMeasuredHeight() {
  provider.onHeightRemove(props.toast.key);
}

function isViable(element: Element | null): element is HTMLElement {
  return (
    element instanceof HTMLElement &&
    element.matches('[data-slot="toast"]:not([data-exiting="true"]):not([data-hidden="true"])')
  );
}

function moveFocusFromToast(element: HTMLElement) {
  let target: HTMLElement | null = null;

  for (
    let sibling = element.previousElementSibling;
    sibling;
    sibling = sibling.previousElementSibling
  ) {
    if (isViable(sibling)) {
      target = sibling;
      break;
    }
  }

  if (!target) {
    for (let sibling = element.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
      if (isViable(sibling)) {
        target = sibling;
        break;
      }
    }
  }

  if (!target) {
    const region = element.closest<HTMLElement>('[data-slot="toast-region"]');

    for (const candidate of region?.querySelectorAll<HTMLElement>(
      '[data-slot="toast"]:not([data-exiting="true"]):not([data-hidden="true"])',
    ) ?? []) {
      if (candidate !== element) {
        target = candidate;
        break;
      }
    }
  }

  if (target) {
    target.focus();
  } else {
    (document.activeElement as HTMLElement | null)?.blur();
  }
}

function syncAccessibility() {
  const element = rootRef.value;

  if (!element) {
    return;
  }

  element.tabIndex =
    isFrontmost.value || (provider.isExpanded.value && !isHidden.value && !isExiting.value)
      ? 0
      : -1;

  if (isHidden.value || isExiting.value) {
    if (element.contains(document.activeElement)) {
      moveFocusFromToast(element);
    }

    element.setAttribute("aria-hidden", "true");

    if (isExiting.value) {
      for (const control of element.querySelectorAll<HTMLElement>("button, a")) {
        control.tabIndex = -1;
      }
    } else {
      element.setAttribute("inert", "");
    }
  } else {
    element.removeAttribute("aria-hidden");
    element.removeAttribute("inert");
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    provider.queue.close(props.toast.key);
  }
}

watch(
  () => props.toast,
  () => {
    provider.onHeightChange(props.toast.key, measuredHeight.value ?? 0);
  },
);

onMounted(() => {
  const element = rootRef.value;

  if (element) {
    resizeObserver = new ResizeObserver(() => measure());

    resizeObserver.observe(element);
    measure();

    if (measuredHeight.value !== undefined) {
      provider.onHeightChange(props.toast.key, measuredHeight.value);
    }
  }

  enterFrame = requestAnimationFrame(() => {
    innerEnterFrame = requestAnimationFrame(() => {
      isEntering.value = false;
    });
  });

  nextTick(syncAccessibility);
});

watch([isFrontmost, () => provider.isExpanded.value, isHidden, isExiting], () =>
  nextTick(syncAccessibility),
);

watch(measuredHeight, (height) => {
  if (height !== undefined) {
    provider.onHeightChange(props.toast.key, height);
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(enterFrame);
  cancelAnimationFrame(innerEnterFrame);
  resizeObserver?.disconnect();
  removeMeasuredHeight();
});
</script>

<template>
  <div
    ref="rootRef"
    v-bind="forwarded"
    :aria-describedby="hasDescription ? descriptionId : undefined"
    :aria-labelledby="hasTitle ? titleId : undefined"
    :class="classes"
    :data-entering="isEntering ? 'true' : undefined"
    :data-expanded="provider.isExpanded.value ? 'true' : undefined"
    :data-exiting="isExiting ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-frontmost="isFrontmost ? 'true' : undefined"
    :data-hidden="isHidden ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-index="index"
    :data-placement="placement"
    :data-slot="'toast'"
    :style="stackingStyle"
    role="alertdialog"
    @keydown="handleKeyDown"
  >
    <slot />
  </div>
</template>
