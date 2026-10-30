<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs, useSlots, type Slots} from "vue";

import {ExternalLinkIcon} from "../../shared/icons";
import {hasSlotContent} from "../../shared/vnode";
import {linkContextKey} from "./context";
import type {LinkIconProps} from "./types";

defineOptions({name: "SailLinkIcon", inheritAttrs: false});

withDefaults(defineProps<LinkIconProps>(), {
  as: "span"
});

const attrs = useAttrs();
const componentSlots = useSlots() as Slots;
const slots = inject(linkContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.icon(), attrs.class as string | undefined));
const hasIcon = computed(() => hasSlotContent(componentSlots.default));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-default-icon="hasIcon ? undefined : 'true'"
    :data-slot="'link-icon'"
  >
    <slot v-if="hasIcon" />
    <ExternalLinkIcon
      v-else
      data-slot="link-default-icon"
    />
  </Primitive>
</template>
