<script setup lang="ts">
import {cx, tagGroupVariants} from "@sail-ui/styles";
import {
  computed,
  getCurrentInstance,
  provide,
  ref,
  useAttrs,
  useId,
  useSlots,
  type Slots,
} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {labelContextKey} from "../../shared/label-context";
import {flattenVNodes} from "../../shared/vnode";
import LabelRoot from "../label/label.vue";
import {tagGroupContextKey} from "./context";
import type {TagGroupRootEmits, TagGroupRootProps, TagGroupSelection, TagKey} from "./types";

defineOptions({name: "SailTagGroup", inheritAttrs: false});

const props = withDefaults(defineProps<TagGroupRootProps>(), {
  disallowEmptySelection: false,
  escapeKeyBehavior: "clearSelection",
  isDisabled: false,
  loop: true,
  selectionMode: "none",
});

const emit = defineEmits<TagGroupRootEmits>();
const model = defineModel<TagGroupSelection>();

const instance = getCurrentInstance();
const attrs = useAttrs();
const componentSlots = useSlots() as Slots;
const {className, forwarded} = useForwardedAttrs();

const slots = computed(() => tagGroupVariants());
const classes = computed(() => cx(slots.value.base(), className.value));
const labelId = useId();

const selectionMode = computed(() => props.selectionMode);
const isDisabled = computed(() => props.isDisabled);
const canRemove = computed(() => typeof instance?.vnode.props?.onRemove === "function");

// A controlled host binds `modelValue` even when the selection is empty, so
// presence of the prop (not its value) decides whether `defaultValue` applies.
const vnodeProps = instance?.vnode.props ?? {};
const isControlled = "modelValue" in vnodeProps || "model-value" in vnodeProps;
const internalSelected = ref<TagGroupSelection>(
  props.selectionMode === "multiple"
    ? ((props.defaultValue as TagKey[] | undefined) ?? [])
    : (props.defaultValue as TagKey | undefined),
);

const selectedValue = computed<TagGroupSelection>(() =>
  isControlled ? model.value : internalSelected.value,
);

const hasLabel = computed(() =>
  flattenVNodes(componentSlots.default?.() ?? []).some((node) => node.type === LabelRoot),
);

const ariaLabel = computed(() => attrs["aria-label"] as string | undefined);
const ariaDescribedBy = computed(() => attrs["aria-describedby"] as string | undefined);
const ariaLabelledBy = computed(() => {
  const explicit = attrs["aria-labelledby"] as string | undefined;

  if (explicit) {
    return explicit;
  }

  if (ariaLabel.value) {
    return undefined;
  }

  return hasLabel.value ? labelId : undefined;
});

function isSelected(value: TagKey) {
  if (props.selectionMode === "none") {
    return false;
  }

  const current = selectedValue.value;

  return Array.isArray(current) ? current.includes(value) : current === value;
}

function setSelected(value: TagGroupSelection) {
  internalSelected.value = value;
  model.value = value;
  emit("selection-change", value);
}

function emitRemove(values: TagKey[]) {
  emit("remove", values);
}

function requestRemove(values: TagKey[]) {
  if (!canRemove.value || isDisabled.value) {
    return;
  }

  const current = selectedValue.value;

  if (Array.isArray(current)) {
    const next = current.filter((entry) => !values.includes(entry));

    if (next.length !== current.length) {
      setSelected(next);
    }
  } else if (current !== undefined && values.includes(current)) {
    setSelected(undefined);
  }

  emitRemove(values);
}

provide(labelContextKey, {id: labelId, elementType: "span"});

provide(tagGroupContextKey, {
  slots,
  selectionMode,
  selectedValue,
  isDisabled,
  disallowEmptySelection: computed(() => props.disallowEmptySelection),
  escapeKeyBehavior: computed(() => props.escapeKeyBehavior),
  loop: computed(() => props.loop),
  size: computed(() => props.size),
  variant: computed(() => props.variant),
  canRemove,
  isSelected,
  setSelected,
  emitRemove,
  requestRemove,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
});
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'tag-group'">
    <slot />
  </div>
</template>
