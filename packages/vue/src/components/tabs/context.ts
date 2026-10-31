import {inject} from "vue";

import type {TabsContext, TabItemContext} from "./types";

export const tabsContextKey = Symbol("sail-tabs");
export const tabItemContextKey = Symbol("sail-tab-item");

export function useTabsContext(): TabsContext {
  const context = inject(tabsContextKey, null);

  if (!context) {
    throw new Error("Tabs parts must be used inside <TabsRoot>.");
  }

  return context;
}

export function useTabItemContext(): TabItemContext {
  const context = inject(tabItemContextKey, null);

  if (!context) {
    throw new Error("<TabIndicator> must be used inside <Tab>.");
  }

  return context;
}
