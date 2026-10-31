import type {InjectionKey} from "vue";

import {inject} from "vue";

import type {DisclosureContext} from "./types";

export const disclosureContextKey: InjectionKey<DisclosureContext> = Symbol("sail-disclosure");

export function useDisclosureContext(): DisclosureContext {
  const context = inject(disclosureContextKey);

  if (!context) {
    throw new Error("Disclosure parts must be used inside <Disclosure>.");
  }

  return context;
}
