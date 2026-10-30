import InputGroupInput from "./input-group-input.vue";
import InputGroupPrefix from "./input-group-prefix.vue";
import InputGroupRoot from "./input-group-root.vue";
import InputGroupSuffix from "./input-group-suffix.vue";
import InputGroupTextArea from "./input-group-text-area.vue";

const InputGroup = Object.assign(InputGroupRoot, {
  Root: InputGroupRoot,
  Input: InputGroupInput,
  TextArea: InputGroupTextArea,
  Prefix: InputGroupPrefix,
  Suffix: InputGroupSuffix
});

export {
  InputGroup,
  InputGroupRoot,
  InputGroupInput,
  InputGroupTextArea,
  InputGroupPrefix,
  InputGroupSuffix
};
export type {
  InputGroupRootProps,
  InputGroupRootProps as InputGroupProps,
  InputGroupInputProps,
  InputGroupTextAreaProps,
  InputGroupPrefixProps,
  InputGroupSuffixProps
} from "./types";
export {inputGroupVariants, type InputGroupVariants} from "@sail-ui/styles";
