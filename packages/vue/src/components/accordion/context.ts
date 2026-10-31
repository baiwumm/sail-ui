import type {InjectionKey} from "vue";

import {inject} from "vue";

import type {AccordionContext, AccordionItemContext} from "./types";

export const accordionContextKey: InjectionKey<AccordionContext> = Symbol("sail-accordion");

export const accordionItemContextKey: InjectionKey<AccordionItemContext> =
  Symbol("sail-accordion-item");

export function useAccordionContext(): AccordionContext {
  const context = inject(accordionContextKey);

  if (!context) {
    throw new Error("Accordion parts must be used inside <Accordion>.");
  }

  return context;
}

export function useAccordionItemContext(): AccordionItemContext {
  const context = inject(accordionItemContextKey);

  if (!context) {
    throw new Error("Accordion parts must be used inside <AccordionItem>.");
  }

  return context;
}
