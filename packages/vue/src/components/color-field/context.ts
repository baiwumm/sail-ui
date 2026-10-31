import type {InjectionKey} from "vue";

import type {ColorFieldContext} from "./types";

export const colorFieldContextKey: InjectionKey<ColorFieldContext> = Symbol("sail-color-field");
