import Tab from "./tabs-tab.vue";
import TabIndicator from "./tabs-indicator.vue";
import TabList from "./tabs-list.vue";
import TabListContainer from "./tabs-list-container.vue";
import TabPanel from "./tabs-panel.vue";
import TabSeparator from "./tabs-separator.vue";
import TabsRoot from "./tabs-root.vue";

const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  ListContainer: TabListContainer,
  List: TabList,
  Tab,
  Indicator: TabIndicator,
  Separator: TabSeparator,
  Panel: TabPanel,
});

export {Tabs, TabsRoot, TabListContainer, TabList, Tab, TabIndicator, TabPanel, TabSeparator};
export type {
  TabsRootProps,
  TabsRootProps as TabsProps,
  TabsRootEmits,
  TabsListContainerProps,
  TabsListProps,
  TabsTabProps,
  TabsTabProps as TabProps,
  TabsTabEmits,
  TabsIndicatorProps,
  TabsPanelProps,
  TabsSeparatorProps,
  TabsKey,
  TabsOrientation,
} from "./types";
export {tabsVariants, type TabsVariants} from "@sail-ui/styles";
