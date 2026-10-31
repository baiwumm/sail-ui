import type {CloseButtonVariants} from "@sail-ui/styles";
import type {ComputedRef} from "vue";

import type {TagKey} from "../tag-group/types";

export interface TagRootProps {
  /** Identifies the tag inside `v-model` and the removal payload. */
  value: TagKey;
  /** Accessible name used by typeahead; derived from the first text child by default. */
  textValue?: string;
  /** Disables this tag without affecting the others. */
  isDisabled?: boolean;
}

export interface TagRemoveButtonProps {
  isDisabled?: boolean;
  variant?: CloseButtonVariants["variant"];
}

export interface TagItemContext {
  isDisabled: ComputedRef<boolean>;
  removeButtonClass: ComputedRef<string>;
  remove: () => void;
}
