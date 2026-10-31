import type {InjectionKey, Ref} from "vue";

import {inject} from "vue";

export interface DisclosureGroupRootProps {
  /**
   * Whether more than one disclosure can stay expanded.
   * @default false
   */
  allowsMultipleExpanded?: boolean;
  isDisabled?: boolean;
  /** The disclosure ids expanded when the group is uncontrolled. */
  defaultExpandedKeys?: string[];
}

export interface DisclosureGroupContext {
  expandedKeys: Ref<string[]>;
  isDisabled: Ref<boolean>;
  toggle: (id: string) => void;
}

export const disclosureGroupContextKey: InjectionKey<DisclosureGroupContext> =
  Symbol("sail-disclosure-group");

export function useDisclosureGroupContext(): DisclosureGroupContext | null {
  return inject(disclosureGroupContextKey, null);
}
