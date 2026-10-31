import type {InjectionKey} from "vue";

export interface DescriptionContext {
  id?: string;
}

export const descriptionContextKey: InjectionKey<DescriptionContext> = Symbol("sail-description");
