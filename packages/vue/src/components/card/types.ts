import type {CardVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface CardRootProps extends PolymorphicProps {
  variant?: CardVariants["variant"];
}

export interface CardHeaderProps extends PolymorphicProps {}
export interface CardTitleProps extends PolymorphicProps {}
export interface CardDescriptionProps extends PolymorphicProps {}
export interface CardContentProps extends PolymorphicProps {}
export interface CardFooterProps extends PolymorphicProps {}
