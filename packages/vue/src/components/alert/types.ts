import type {AlertVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface AlertRootProps extends PolymorphicProps {
  status?: AlertVariants["status"];
}

export type AlertIndicatorProps = PolymorphicProps;
export type AlertContentProps = PolymorphicProps;
export type AlertTitleProps = PolymorphicProps;
export type AlertDescriptionProps = PolymorphicProps;
