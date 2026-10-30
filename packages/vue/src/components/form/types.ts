export interface FormRootProps {
  /**
   * The name of the form. Submitted with the form data.
   */
  name?: string;
  /**
   * The HTTP method used to submit the form.
   * @default "get"
   */
  method?: "get" | "post";
  /**
   * The action the form submits to.
   */
  action?: string;
  /**
   * Disable the native constraint validation of the browser.
   * @default false
   */
  noValidate?: boolean;
  /**
   * The reading direction of the form. Inherited from the document when
   * omitted.
   */
  dir?: "ltr" | "rtl";
}
