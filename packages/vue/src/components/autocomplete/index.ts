import AutocompleteClearButton from "./autocomplete-clear-button.vue";
import AutocompleteFilter from "./autocomplete-filter.vue";
import AutocompleteIndicator from "./autocomplete-indicator.vue";
import AutocompletePopover from "./autocomplete-popover.vue";
import AutocompleteRoot from "./autocomplete-root.vue";
import AutocompleteTrigger from "./autocomplete-trigger.vue";
import AutocompleteValue from "./autocomplete-value.vue";

const Autocomplete = Object.assign(AutocompleteRoot, {
  Root: AutocompleteRoot,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
  Indicator: AutocompleteIndicator,
  ClearButton: AutocompleteClearButton,
  Popover: AutocompletePopover,
  Filter: AutocompleteFilter,
});

export {
  Autocomplete,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
  AutocompleteIndicator,
  AutocompleteClearButton,
  AutocompletePopover,
  AutocompleteFilter,
};

export type {
  AutocompleteRootProps,
  AutocompleteRootProps as AutocompleteProps,
  AutocompleteRootEmits,
  AutocompleteRootEmits as AutocompleteEmits,
  AutocompleteTriggerProps,
  AutocompleteValueProps,
  AutocompleteIndicatorProps,
  AutocompleteClearButtonProps,
  AutocompletePopoverProps,
  AutocompleteFilterProps,
} from "./types";

export {autocompleteVariants, type AutocompleteVariants} from "@sail-ui/styles";
