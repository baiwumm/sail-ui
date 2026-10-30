import ButtonRoot from "./button.vue";

const Button = Object.assign(ButtonRoot, {
  Root: ButtonRoot
});

export {Button, ButtonRoot};
export type {ButtonProps} from "./types";
export {buttonVariants, type ButtonVariants} from "@sail-ui/styles";
