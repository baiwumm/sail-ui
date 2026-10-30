import LinkIcon from "./link-icon.vue";
import LinkRoot from "./link-root.vue";

const Link = Object.assign(LinkRoot, {
  Root: LinkRoot,
  Icon: LinkIcon,
});

export {Link, LinkRoot, LinkIcon};
export type {LinkRootProps, LinkRootProps as LinkProps, LinkIconProps} from "./types";
export {linkVariants, type LinkVariants} from "@sail-ui/styles";
