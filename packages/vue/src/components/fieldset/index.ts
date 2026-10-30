import FieldGroup from "./field-group.vue";
import FieldsetActions from "./fieldset-actions.vue";
import FieldsetLegend from "./fieldset-legend.vue";
import FieldsetRoot from "./fieldset-root.vue";

const Fieldset = Object.assign(FieldsetRoot, {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
  Group: FieldGroup,
  Actions: FieldsetActions
});

export {Fieldset, FieldsetRoot, FieldsetLegend, FieldGroup, FieldsetActions};
export type {
  FieldsetRootProps,
  FieldsetRootProps as FieldsetProps,
  FieldsetLegendProps,
  FieldGroupProps,
  FieldsetActionsProps
} from "./types";
export {fieldsetVariants, type FieldsetVariants} from "@sail-ui/styles";
