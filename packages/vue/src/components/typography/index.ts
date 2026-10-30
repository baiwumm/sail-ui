import TypographyCode from "./typography-code.vue";
import TypographyHeading from "./typography-heading.vue";
import TypographyParagraph from "./typography-paragraph.vue";
import TypographyProse from "./typography-prose.vue";
import TypographyRoot from "./typography-root.vue";

const Typography = Object.assign(TypographyRoot, {
  Root: TypographyRoot,
  Heading: TypographyHeading,
  Paragraph: TypographyParagraph,
  Code: TypographyCode,
  Prose: TypographyProse
});

export {
  Typography,
  TypographyRoot,
  TypographyHeading,
  TypographyParagraph,
  TypographyCode,
  TypographyProse
};
export type {
  TypographyRootProps,
  TypographyRootProps as TypographyProps,
  HeadingProps,
  ParagraphProps,
  CodeProps,
  ProseProps,
  TypographyType,
  TypographyAlign,
  TypographyColor,
  TypographyWeight
} from "./types";
export {typographyVariants, type TypographyVariants} from "@sail-ui/styles";
