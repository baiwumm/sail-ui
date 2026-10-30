import FormRoot from "./form-root.vue";

const Form = Object.assign(FormRoot, {
  Root: FormRoot,
});

export {Form, FormRoot};
export type {FormRootProps, FormRootProps as FormProps} from "./types";
