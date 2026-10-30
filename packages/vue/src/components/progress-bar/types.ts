import type {ProgressBarVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface ProgressBarRootProps extends PolymorphicProps {
  value?: number | null;
  minValue?: number;
  maxValue?: number;
  isIndeterminate?: boolean;
  valueLabel?: string;
  formatOptions?: Intl.NumberFormatOptions;
  isDisabled?: boolean;
  color?: ProgressBarVariants["color"];
  size?: ProgressBarVariants["size"];
}

export interface ProgressBarOutputProps extends PolymorphicProps {}

export interface ProgressBarTrackProps extends PolymorphicProps {}

export interface ProgressBarFillProps extends PolymorphicProps {}
