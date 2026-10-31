import ColorFieldRoot from "./color-field-root.vue";
import ColorInputGroup from "./color-input-group.vue";
import ColorInputGroupInput from "./color-input-group-input.vue";
import ColorInputGroupPrefix from "./color-input-group-prefix.vue";
import ColorInputGroupSuffix from "./color-input-group-suffix.vue";

const ColorField = Object.assign(ColorFieldRoot, {
  Root: ColorFieldRoot,
  Group: ColorInputGroup,
  Input: ColorInputGroupInput,
  Prefix: ColorInputGroupPrefix,
  Suffix: ColorInputGroupSuffix,
});

export {
  ColorField,
  ColorFieldRoot,
  ColorInputGroup as ColorFieldGroup,
  ColorInputGroupInput as ColorFieldInput,
  ColorInputGroupPrefix as ColorFieldPrefix,
  ColorInputGroupSuffix as ColorFieldSuffix,
};

export type {
  ColorFieldRootProps,
  ColorFieldRootProps as ColorFieldProps,
  ColorFieldRootEmits,
  ColorFieldRootEmits as ColorFieldEmits,
  ColorInputGroupProps,
} from "./types";

export {colorFieldVariants, type ColorFieldVariants} from "@sail-ui/styles";
