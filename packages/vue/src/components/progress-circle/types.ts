import type {ProgressCircleVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface ProgressCircleRootProps extends PolymorphicProps {
  value?: number | null;
  minValue?: number;
  maxValue?: number;
  isIndeterminate?: boolean;
  valueLabel?: string;
  formatOptions?: Intl.NumberFormatOptions;
  isDisabled?: boolean;
  color?: ProgressCircleVariants["color"];
  size?: ProgressCircleVariants["size"];
}

export interface ProgressCircleTrackProps extends PolymorphicProps {}

export interface ProgressCircleTrackCircleProps extends PolymorphicProps {}

export interface ProgressCircleFillCircleProps extends PolymorphicProps {}
