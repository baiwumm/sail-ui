import type {PropType} from "vue";

import {ConfigProvider} from "reka-ui";
import {defineComponent, h} from "vue";

import {ToastProvider} from "@sail-ui/vue/toast";

/**
 * App-level provider mounted by the module (or manually in `app.vue`):
 *
 * - Reka `ConfigProvider` seeds locale/dir/useId defaults for the behavior
 *   layer;
 * - Sail's `ToastProvider` mounts the toast region with a per-request queue.
 *
 * The module wraps the app with this provider automatically (`wrapApp`), so
 * users normally never render it themselves.
 */
export interface SailUIProviderProps {
  /** Document direction passed to the Reka config layer. */
  dir?: "ltr" | "rtl";
  /** Locale passed to the Reka config layer. */
  locale?: string;
}

export const SailUIProvider = defineComponent({
  name: "SailUIProvider",
  inheritAttrs: false,
  props: {
    dir: {
      type: String as PropType<"ltr" | "rtl">,
      default: undefined,
    },
    locale: {
      type: String,
      default: undefined,
    },
  },
  setup(props, {attrs, slots}) {
    return () =>
      h(ConfigProvider, {dir: props.dir, locale: props.locale}, () => [
        h(ToastProvider, attrs, slots),
      ]);
  },
});

export default SailUIProvider;
