import TagGroupList from "./tag-group-list.vue";
import TagGroupRoot from "./tag-group-root.vue";

const TagGroup = Object.assign(TagGroupRoot, {
  Root: TagGroupRoot,
  List: TagGroupList,
});

export {TagGroup, TagGroupRoot, TagGroupList};
export type {
  TagGroupRootProps,
  TagGroupRootProps as TagGroupProps,
  TagGroupRootEmits,
  TagGroupListProps,
  TagGroupContext,
  TagGroupSelection,
  TagGroupSelectionMode,
  TagGroupEscapeKeyBehavior,
  TagKey,
} from "./types";
export {tagGroupVariants, type TagGroupVariants} from "@sail-ui/styles";
