import type {InjectionKey} from "vue";

export interface LabelContext {
  id?: string;
  /**
   * RAC renders a Label inside a non-labelable widget (progress bar) as a
   * `span` instead of a `label` element.
   */
  elementType?: "label" | "span";
}

export const labelContextKey: InjectionKey<LabelContext> = Symbol("sail-label");
