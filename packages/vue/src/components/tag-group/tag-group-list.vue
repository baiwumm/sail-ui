<script setup lang="ts">
import {useFocusRing} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {TagGroupRoot as TagGroupRootPrimitive} from "reka-ui";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useTagGroupContext} from "./context";
import type {TagGroupListProps, TagGroupSelection, TagKey} from "./types";

defineOptions({name: "SailTagGroupList", inheritAttrs: false});

defineProps<TagGroupListProps>();

const root = useTagGroupContext();
const {className, forwarded} = useForwardedAttrs();

const listRef = ref<HTMLElement | null>(null);
const classes = computed(() => cx(root.slots.value.list(), className.value));
const {isFocused, isFocusVisible} = useFocusRing(listRef, {isDisabled: root.isDisabled});

function handleUpdate(value: TagGroupSelection) {
  root.setSelected(value);
}

function handleRemove(values: TagKey[]) {
  root.emitRemove(values);
}

// Reka decides whether tags are removable from `vnode.props.onRemove`, which
// only sees the camelCase v-bind key (a hyphenated attribute stays `on-remove`).
const removeListener = computed(() => (root.canRemove.value ? {onRemove: handleRemove} : {}));
</script>

<template>
  <TagGroupRootPrimitive
    as-child
    v-bind="removeListener"
    :aria-describedby="root.ariaDescribedBy.value"
    :aria-label="root.ariaLabel.value"
    :aria-labelledby="root.ariaLabelledBy.value"
    :disabled="root.isDisabled.value"
    :disallow-empty-selection="root.disallowEmptySelection.value"
    :escape-key-behavior="root.escapeKeyBehavior.value"
    :loop="root.loop.value"
    :model-value="root.selectedValue.value"
    :selection-mode="root.selectionMode.value"
    @update:model-value="handleUpdate"
  >
    <div
      v-bind="forwarded"
      ref="listRef"
      :class="classes"
      :data-disabled="root.isDisabled.value ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-slot="'tag-group-list'"
    >
      <slot />
    </div>
  </TagGroupRootPrimitive>
</template>
