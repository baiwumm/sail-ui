import type {KbdVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";
import type {KbdKey} from "./kbd.constants";

export interface KbdRootProps extends PolymorphicProps {
  variant?: KbdVariants["variant"];
}

export interface KbdAbbrProps extends PolymorphicProps {
  keyValue: KbdKey;
}

export interface KbdContentProps extends PolymorphicProps {}
