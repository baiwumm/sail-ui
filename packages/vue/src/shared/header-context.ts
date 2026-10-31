import type {InjectionKey} from "vue";

export interface HeaderContext {
  id?: string;
}

export const headerContextKey: InjectionKey<HeaderContext> = Symbol("sail-header");
