import BadgeAnchor from "./badge-anchor.vue";
import BadgeLabel from "./badge-label.vue";
import BadgeRoot from "./badge-root.vue";

const Badge = Object.assign(BadgeRoot, {
  Root: BadgeRoot,
  Anchor: BadgeAnchor,
  Label: BadgeLabel
});

export {Badge, BadgeRoot, BadgeAnchor, BadgeLabel};
export type {BadgeRootProps, BadgeRootProps as BadgeProps, BadgeAnchorProps, BadgeLabelProps} from "./types";
export {badgeVariants, type BadgeVariants} from "@sail-ui/styles";
