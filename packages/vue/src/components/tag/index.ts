import TagRemoveButton from "./tag-remove-button.vue";
import TagRoot from "./tag-root.vue";

const Tag = Object.assign(TagRoot, {
  Root: TagRoot,
  RemoveButton: TagRemoveButton,
});

export {Tag, TagRoot, TagRemoveButton};
export type {
  TagRootProps,
  TagRootProps as TagProps,
  TagRemoveButtonProps,
  TagItemContext,
} from "./types";
export {tagVariants, type TagVariants} from "@sail-ui/styles";
