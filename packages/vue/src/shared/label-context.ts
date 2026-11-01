import type {InjectionKey} from "vue";

export interface LabelContext {
  id?: string;
  /**
   * RAC renders a Label inside a non-labelable widget (progress bar) as a
   * `span` instead of a `label` element.
   */
  elementType?: "label" | "span";
  /**
   * The id of the control the label names, rendered as the `for` attribute.
   */
  htmlFor?: string;
}

export const labelContextKey: InjectionKey<LabelContext> = Symbol("sail-label");
