import {inject} from "vue";

import type {TagItemContext} from "./types";

export const tagItemContextKey = Symbol("sail-tag-item");

export function useTagItemContext(): TagItemContext {
  const context = inject(tagItemContextKey, null);

  if (!context) {
    throw new Error("<TagRemoveButton> must be used inside <Tag>.");
  }

  return context;
}
