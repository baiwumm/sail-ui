import type {PropType, Slot, VNode} from "vue";

import {Comment, Fragment, Text, defineComponent, isVNode} from "vue";

export function flattenVNodes(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Fragment && Array.isArray(node.children)) {
      return flattenVNodes(node.children as VNode[]);
    }

    return isVNode(node) ? [node] : [];
  });
}

export function isRenderableVNode(node: VNode): boolean {
  if (node.type === Comment) {
    return false;
  }

  return !(
    node.type === Text &&
    typeof node.children === "string" &&
    node.children.trim() === ""
  );
}

export function hasSlotContent(slot?: Slot): boolean {
  return Boolean(slot) && flattenVNodes(slot?.() ?? []).some(isRenderableVNode);
}

export function plainTextChild(slot?: Slot): string | number | undefined {
  const nodes = flattenVNodes(slot?.() ?? []).filter(isRenderableVNode);

  if (nodes.length !== 1) {
    return undefined;
  }

  const [node] = nodes;

  if (
    node?.type === Text &&
    (typeof node.children === "string" || typeof node.children === "number")
  ) {
    return node.children;
  }

  return undefined;
}

/**
 * Renders vnodes produced by a slot inside wrapper components without caching
 * them, so reactive slot content stays fresh during parent updates.
 */
export const RenderNodes = defineComponent({
  name: "SailRenderNodes",
  inheritAttrs: false,
  props: {
    render: {
      type: Function as PropType<() => VNode | VNode[]>,
      required: true
    }
  },
  setup(props) {
    return () => props.render();
  }
});
