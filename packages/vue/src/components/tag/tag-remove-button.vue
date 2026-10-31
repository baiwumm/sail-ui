<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import CloseButtonRoot from "../close-button/close-button-root.vue";
import {useTagGroupContext} from "../tag-group/context";
import {useTagItemContext} from "./context";
import type {TagRemoveButtonProps} from "./types";

defineOptions({name: "SailTagRemoveButton", inheritAttrs: false});

const props = withDefaults(defineProps<TagRemoveButtonProps>(), {isDisabled: false});

const item = useTagItemContext();
const {canRemove} = useTagGroupContext();
const {attrs, className, forwarded} = useForwardedAttrs();

const isDisabled = computed(() => item.isDisabled.value || props.isDisabled);
const classes = computed(() => cx(item.removeButtonClass.value, className.value));
const ariaLabel = computed(() => (attrs["aria-label"] as string | undefined) ?? "Remove tag");

function handleClick(event: MouseEvent) {
  event.stopPropagation();

  if (isDisabled.value) {
    return;
  }

  item.remove();
}
</script>

<template>
  <CloseButtonRoot
    v-if="canRemove"
    v-bind="{...forwarded, slot: 'remove'}"
    :aria-label="ariaLabel"
    :class="classes"
    :data-slot="'tag-remove-button'"
    :is-disabled="isDisabled"
    @click="handleClick"
  >
    <slot />
  </CloseButtonRoot>
</template>
