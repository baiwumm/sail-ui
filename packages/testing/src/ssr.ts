import type {Component} from "vue";

import {renderToString} from "@vue/server-renderer";
import {createSSRApp, h} from "vue";

export interface RenderSSROptions {
  props?: Record<string, unknown>;
  slots?: Record<string, () => unknown>;
}

export function renderSSR(root: Component, options: RenderSSROptions = {}): Promise<string> {
  const app = createSSRApp({
    render: () => h(root, options.props ?? {}, options.slots),
  });

  return renderToString(app);
}
