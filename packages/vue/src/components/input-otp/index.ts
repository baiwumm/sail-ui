import InputOtpGroup from "./input-otp-group.vue";
import InputOtpRoot from "./input-otp-root.vue";
import InputOtpSeparator from "./input-otp-separator.vue";
import InputOtpSlot from "./input-otp-slot.vue";

const InputOtp = Object.assign(InputOtpRoot, {
  Root: InputOtpRoot,
  Group: InputOtpGroup,
  Slot: InputOtpSlot,
  Separator: InputOtpSeparator,
});

export {InputOtp, InputOtpRoot, InputOtpGroup, InputOtpSlot, InputOtpSeparator};
export type {
  InputOtpRootProps,
  InputOtpRootProps as InputOtpProps,
  InputOtpRootEmits,
  InputOtpGroupProps,
  InputOtpSlotProps,
  InputOtpSeparatorProps,
} from "./types";
export {inputOTPVariants, type InputOTPVariants} from "@sail-ui/styles";

export const REGEXP_ONLY_DIGITS = "^\\d+$";
export const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";
