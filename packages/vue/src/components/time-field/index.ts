import TimeFieldRoot from "./time-field-root.vue";
import DateInputGroupInput from "../date-input-group/date-input-group-input.vue";
import DateInputGroupInputContainer from "../date-input-group/date-input-group-input-container.vue";
import DateInputGroupPrefix from "../date-input-group/date-input-group-prefix.vue";
import DateInputGroupRoot from "../date-input-group/date-input-group-root.vue";
import DateInputGroupSegment from "../date-input-group/date-input-group-segment.vue";
import DateInputGroupSuffix from "../date-input-group/date-input-group-suffix.vue";

const TimeField = Object.assign(TimeFieldRoot, {
  Root: TimeFieldRoot,
  Group: DateInputGroupRoot,
  Input: DateInputGroupInput,
  InputContainer: DateInputGroupInputContainer,
  Segment: DateInputGroupSegment,
  Prefix: DateInputGroupPrefix,
  Suffix: DateInputGroupSuffix,
});

export {
  TimeField,
  TimeFieldRoot,
  DateInputGroupRoot as TimeFieldGroup,
  DateInputGroupInput as TimeFieldInput,
  DateInputGroupInputContainer as TimeFieldInputContainer,
  DateInputGroupSegment as TimeFieldSegment,
  DateInputGroupPrefix as TimeFieldPrefix,
  DateInputGroupSuffix as TimeFieldSuffix,
};

export type {
  TimeFieldRootProps,
  TimeFieldRootProps as TimeFieldProps,
  TimeFieldRootEmits,
  TimeFieldRootEmits as TimeFieldEmits,
  TimeValue,
} from "./types";

export type {
  DateInputGroupInputContainerProps as TimeFieldInputContainerProps,
  DateInputGroupInputProps as TimeFieldInputProps,
  DateInputGroupPrefixProps as TimeFieldPrefixProps,
  DateInputGroupRootProps as TimeFieldGroupProps,
  DateInputGroupSegmentProps as TimeFieldSegmentProps,
  DateInputGroupSuffixProps as TimeFieldSuffixProps,
  DateSegmentContent as TimeFieldSegmentContent,
} from "../date-input-group/types";

export {timeFieldVariants, type TimeFieldVariants} from "@sail-ui/styles";
