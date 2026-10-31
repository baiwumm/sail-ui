import type {InjectionKey} from "vue";

import type {InputOtpContext} from "./types";

export const inputOtpContextKey: InjectionKey<InputOtpContext> = Symbol("sail-input-otp");
