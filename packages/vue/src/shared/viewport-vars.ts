import {onBeforeUnmount, onMounted, ref} from "vue";

/**
 * Mirrors the viewport CSS vars React Aria sets as inline style on its modal
 * overlay root (`--visual-viewport-*`, `--page-*`). The upstream CSS sizes
 * modal-family containers with them, and Reka has no equivalent, so the Vue
 * backdrops bind them on the portal root themselves.
 *
 * Empty on the server and before mount, so SSR markup is unaffected.
 */
export function useViewportVars() {
  const vars = ref<Record<string, string>>({});
  let visualViewport: VisualViewport | null = null;

  function update() {
    const viewport = visualViewport ?? {width: window.innerWidth, height: window.innerHeight};
    const scrollingElement = document.scrollingElement ?? document.documentElement;
    const rect = scrollingElement.getBoundingClientRect();
    const pageWidth = scrollingElement.scrollWidth - (rect.width % 1);
    const pageHeight = scrollingElement.scrollHeight - (rect.height % 1);

    vars.value = {
      "--visual-viewport-width": `${viewport.width}px`,
      "--visual-viewport-height": `${viewport.height}px`,
      "--page-width": `${pageWidth}px`,
      "--page-height": `${pageHeight}px`,
    };
  }

  function listen(attach: boolean) {
    const method = attach ? "addEventListener" : "removeEventListener";
    visualViewport?.[method]("resize", update);
    window[method]("resize", update);
  }

  onMounted(() => {
    visualViewport = window.visualViewport ?? null;
    listen(true);
    update();
  });

  onBeforeUnmount(() => listen(false));

  return vars;
}
