import TextAreaRoot from "./textarea-root.vue";

const Textarea = Object.assign(TextAreaRoot, {
  Root: TextAreaRoot,
});

export {Textarea, TextAreaRoot};
export type {TextAreaRootProps, TextAreaRootProps as TextareaProps} from "./types";
export {textAreaVariants, type TextAreaVariants} from "@sail-ui/styles";
