import {inject} from "vue";

import type {PaginationContext} from "./types";

export const paginationContextKey = Symbol("sail-pagination");

export function usePaginationContext(): PaginationContext {
  const context = inject(paginationContextKey, null);

  if (!context) {
    throw new Error("Pagination parts must be used inside <PaginationRoot>.");
  }

  return context;
}
