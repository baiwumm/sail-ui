import CardContent from "./card-content.vue";
import CardDescription from "./card-description.vue";
import CardFooter from "./card-footer.vue";
import CardHeader from "./card-header.vue";
import CardRoot from "./card-root.vue";
import CardTitle from "./card-title.vue";

const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
});

export {Card, CardRoot, CardHeader, CardTitle, CardDescription, CardContent, CardFooter};
export type {
  CardRootProps,
  CardRootProps as CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps
} from "./types";
export {cardVariants, type CardVariants} from "@sail-ui/styles";
