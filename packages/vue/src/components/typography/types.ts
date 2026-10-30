import type {TypographyVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export type TypographyType = NonNullable<TypographyVariants["type"]>;
export type TypographyAlign = NonNullable<TypographyVariants["align"]>;
export type TypographyColor = NonNullable<TypographyVariants["color"]>;
export type TypographyWeight = NonNullable<TypographyVariants["weight"]>;

export interface TypographyRootProps extends PolymorphicProps {
  align?: TypographyAlign;
  color?: TypographyColor;
  type?: TypographyType;
  truncate?: boolean;
  weight?: TypographyWeight;
}

export interface HeadingProps extends Omit<TypographyRootProps, "type"> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ParagraphProps extends Omit<TypographyRootProps, "type"> {
  size?: "base" | "sm" | "xs";
}

export interface CodeProps extends Omit<TypographyRootProps, "type"> {}

export interface ProseProps extends PolymorphicProps {}
