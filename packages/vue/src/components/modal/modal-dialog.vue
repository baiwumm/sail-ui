<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {DialogContent} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useModalContext} from "./context";

defineOptions({name: "SailModalDialog", inheritAttrs: false});

const {attrs, className, forwarded} = useForwardedAttrs();
const {placement, slots, contentId, isDismissable, isKeyboardDismissDisabled} = useModalContext();

const classes = computed(() => cx(slots.value.dialog(), className.value));

function handlePointerDownOutside(event: Event) {
  if (!isDismissable.value) {
    event.preventDefault();
  }
}

function handleEscapeKeyDown(event: KeyboardEvent) {
  if (isKeyboardDismissDisabled.value) {
    event.preventDefault();
  }
}
</script>

<template>
  <!-- Upstream Modal has no description part, so Reka's generated
       aria-describedby would point at a missing element. Forward only a
       consumer-provided value. -->
  <DialogContent
    v-bind="forwarded"
    :id="contentId"
    :aria-describedby="attrs['aria-describedby']"
    aria-modal="true"
    :class="classes"
    :data-placement="placement"
    :data-slot="'modal-dialog'"
    @escape-key-down="handleEscapeKeyDown"
    @pointer-down-outside="handlePointerDownOutside"
  >
    <slot />
  </DialogContent>
</template>
