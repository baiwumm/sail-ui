import DateFieldRoot from "./date-field-root.vue";
import DateInputGroupInput from "../date-input-group/date-input-group-input.vue";
import DateInputGroupInputContainer from "../date-input-group/date-input-group-input-container.vue";
import DateInputGroupPrefix from "../date-input-group/date-input-group-prefix.vue";
import DateInputGroupRoot from "../date-input-group/date-input-group-root.vue";
import DateInputGroupSegment from "../date-input-group/date-input-group-segment.vue";
import DateInputGroupSuffix from "../date-input-group/date-input-group-suffix.vue";

const DateField = Object.assign(DateFieldRoot, {
  Root: DateFieldRoot,
  Group: DateInputGroupRoot,
  Input: DateInputGroupInput,
  InputContainer: DateInputGroupInputContainer,
  Segment: DateInputGroupSegment,
  Prefix: DateInputGroupPrefix,
  Suffix: DateInputGroupSuffix,
});

export {
  DateField,
  DateFieldRoot,
  DateInputGroupRoot as DateFieldGroup,
  DateInputGroupInput as DateFieldInput,
  DateInputGroupInputContainer as DateFieldInputContainer,
  DateInputGroupSegment as DateFieldSegment,
  DateInputGroupPrefix as DateFieldPrefix,
  DateInputGroupSuffix as DateFieldSuffix,
};

export type {
  DateFieldRootProps,
  DateFieldRootProps as DateFieldProps,
  DateFieldRootEmits,
  DateFieldRootEmits as DateFieldEmits,
} from "./types";

export type {
  DateInputGroupInputContainerProps as DateFieldInputContainerProps,
  DateInputGroupInputProps as DateFieldInputProps,
  DateInputGroupPrefixProps as DateFieldPrefixProps,
  DateInputGroupRootProps as DateFieldGroupProps,
  DateInputGroupSegmentProps as DateFieldSegmentProps,
  DateInputGroupSuffixProps as DateFieldSuffixProps,
  DateSegmentContent as DateFieldSegmentContent,
} from "../date-input-group/types";

export {dateFieldVariants, type DateFieldVariants} from "@sail-ui/styles";
