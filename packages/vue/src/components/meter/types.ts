import type {MeterVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface MeterRootProps extends PolymorphicProps {
  value?: number;
  minValue?: number;
  maxValue?: number;
  valueLabel?: string;
  formatOptions?: Intl.NumberFormatOptions;
  showValueLabel?: boolean;
  isDisabled?: boolean;
  color?: MeterVariants["color"];
  size?: MeterVariants["size"];
}

export interface MeterOutputProps extends PolymorphicProps {}

export interface MeterTrackProps extends PolymorphicProps {}

export interface MeterFillProps extends PolymorphicProps {}
