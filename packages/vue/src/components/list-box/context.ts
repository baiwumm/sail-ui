import {inject} from "vue";

import type {ListBoxContext} from "./types";

export const listBoxContextKey = Symbol("sail-list-box");

export function useListBoxContext(): ListBoxContext {
  const context = inject(listBoxContextKey, null);

  if (!context) {
    throw new Error("ListBoxItem must be used inside <ListBoxRoot>.");
  }

  return context;
}
