import type {InjectionKey, Ref} from "vue";

export interface SliderRootProps {
  /**
   * The orientation of the slider.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  isDisabled?: boolean;
  /**
   * The smallest value of the slider.
   * @default 0
   */
  min?: number;
  /**
   * The largest value of the slider.
   * @default 100
   */
  max?: number;
  /**
   * The stepping interval.
   * @default 1
   */
  step?: number;
  /**
   * The formatting options applied to the output and the marks.
   */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * The locale used to format the output and the marks.
   */
  locale?: string;
  /**
   * The reading direction of the slider. Inherited from the document when
   * omitted.
   */
  dir?: "ltr" | "rtl";
  /**
   * The name submitted with the owning form.
   */
  name?: string;
  isRequired?: boolean;
}

export interface SliderTrackProps {
  class?: string;
}

export interface SliderFillProps {
  class?: string;
}

export interface SliderThumbProps {
  class?: string;
  /**
   * The index of the thumb inside a range slider.
   * @default 0
   */
  index?: number;
}

export interface SliderOutputProps {
  class?: string;
}

export interface SliderStepProps {
  class?: string;
}

export interface SliderStepsProps {
  class?: string;
}

export interface SliderMarksProps {
  class?: string;
}

export interface SliderMarkProps {
  class?: string;
  /**
   * The value at which the mark is positioned.
   */
  value: number;
}

export interface SliderContext {
  values: Ref<number[]>;
  min: Ref<number>;
  max: Ref<number>;
  step: Ref<number>;
  orientation: Ref<"horizontal" | "vertical">;
  isDisabled: Ref<boolean>;
  isRTL: Ref<boolean>;
  isDragging: Ref<boolean>;
  labelId: string;
  format: (value: number) => string;
  percentOf: (value: number) => number;
}

export const sliderContextKey: InjectionKey<SliderContext> = Symbol("sail-slider");
