import {inject} from "vue";

import type {TagGroupContext} from "./types";

export const tagGroupContextKey = Symbol("sail-tag-group");

export function useTagGroupContext(): TagGroupContext {
  const context = inject(tagGroupContextKey, null);

  if (!context) {
    throw new Error("Tag and TagGroupList parts must be used inside <TagGroupRoot>.");
  }

  return context;
}
