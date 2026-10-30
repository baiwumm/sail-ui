import SearchFieldClearButton from "./search-field-clear-button.vue";
import SearchFieldGroup from "./search-field-group.vue";
import SearchFieldInput from "./search-field-input.vue";
import SearchFieldRoot from "./search-field-root.vue";
import SearchFieldSearchIcon from "./search-field-search-icon.vue";

const SearchField = Object.assign(SearchFieldRoot, {
  Root: SearchFieldRoot,
  Group: SearchFieldGroup,
  Input: SearchFieldInput,
  SearchIcon: SearchFieldSearchIcon,
  ClearButton: SearchFieldClearButton
});

export {
  SearchField,
  SearchFieldRoot,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldSearchIcon,
  SearchFieldClearButton
};
export type {
  SearchFieldRootProps,
  SearchFieldRootProps as SearchFieldProps,
  SearchFieldGroupProps,
  SearchFieldInputProps,
  SearchFieldSearchIconProps,
  SearchFieldClearButtonProps
} from "./types";
export {searchFieldVariants, type SearchFieldVariants} from "@sail-ui/styles";
