import type {InjectionKey, Ref} from "vue";

/**
 * Field state for Sail composites that do not sit inside a Reka `FieldRoot`.
 * `Label`, `FieldError`, and the date/time inputs read it; components that
 * provide a Reka field context keep working through that context instead.
 */
export interface FieldContext {
  invalid: Readonly<Ref<boolean>>;
  disabled: Readonly<Ref<boolean>>;
  required: Readonly<Ref<boolean>>;
  errors: Readonly<Ref<string[]>>;
  describedBy: Readonly<Ref<string | undefined>>;
  registerDescription: (id: string) => () => void;
}

export const fieldContextKey: InjectionKey<FieldContext> = Symbol("sail-field");
