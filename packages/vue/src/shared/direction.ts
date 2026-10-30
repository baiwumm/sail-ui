import {onBeforeUnmount, onMounted, ref, type Ref} from "vue";

/**
 * Tracks the reading direction of the document.
 *
 * The direction is not reactive on its own, so the `dir` attribute of the root
 * element is observed. Components merge it with their own `dir` prop.
 */
export function useDocumentDirection(): Ref<"ltr" | "rtl"> {
  const direction = ref<"ltr" | "rtl">("ltr");
  let observer: MutationObserver | undefined;

  const update = () => {
    direction.value = document.documentElement.dir === "rtl" ? "rtl" : "ltr";
  };

  onMounted(() => {
    update();

    observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributeFilter: ["dir"],
      attributes: true,
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
  });

  return direction;
}
