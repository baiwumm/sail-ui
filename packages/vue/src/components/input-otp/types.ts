import type {InputOTPVariants, inputOTPVariants} from "@sail-ui/styles";
import type {ComputedRef, Ref} from "vue";

export interface InputOtpRootProps {
  /** The OTP value when the field is controlled. */
  modelValue?: string;
  /** The OTP value when the field is uncontrolled. */
  defaultValue?: string;
  /** Number of characters the code accepts. */
  maxLength: number;
  /** Restricts the whole code to characters matching the pattern. */
  pattern?: string | RegExp;
  /** Placeholder forwarded to the native slot inputs. */
  placeholder?: string;
  /** @default "numeric" */
  inputMode?: "numeric" | "text";
  /** @default false */
  isDisabled?: boolean;
  /** @default false */
  isInvalid?: boolean;
  /** @default "primary" */
  variant?: InputOTPVariants["variant"];
  /** The name submitted with the owning form. */
  name?: string;
  /** Id applied to the form input. */
  id?: string;
  /** Extra classes for the hidden native inputs. */
  inputClassName?: string;
}

export interface InputOtpRootEmits {
  "update:modelValue": [value: string];
  complete: [value: string];
}

export interface InputOtpGroupProps {}

export interface InputOtpSlotProps {
  /** Zero-based position of the slot in the code. */
  index: number;
}

export interface InputOtpSeparatorProps {}

export interface InputOtpContext {
  slots: ComputedRef<ReturnType<typeof inputOTPVariants>>;
  isDisabled: ComputedRef<boolean>;
  isInvalid: ComputedRef<boolean>;
  characters: ComputedRef<string[]>;
  activeIndex: Ref<number | null>;
  inputClassName: ComputedRef<string | undefined>;
  setActiveIndex: (index: number | null) => void;
}
