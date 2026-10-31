import {inject} from "vue";

import type {ListBoxItemContext} from "./types";

export const listBoxItemContextKey = Symbol("sail-list-box-item");

export function useListBoxItemContext(): ListBoxItemContext {
  const context = inject(listBoxItemContextKey, null);

  if (!context) {
    throw new Error("ListBoxItemIndicator must be used inside <ListBoxItem>.");
  }

  return context;
}
