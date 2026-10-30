import {effectScope, nextTick, ref} from "vue";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {useOverlayState, type UseOverlayStateProps} from "../use-overlay-state";

const originalMatchMedia = window.matchMedia;

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      matches: matches && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    })),
  });
}

const nextFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
      return;
    }

    setTimeout(resolve, 16);
  });

const flushFrames = async (count = 4) => {
  for (let index = 0; index < count; index += 1) {
    await nextFrame();
    await nextTick();
  }
};

const attachRunningAnimation = (element: HTMLElement, duration: number) => {
  const animation = {
    playState: "running",
    effect: {getTiming: () => ({duration, delay: 0}), target: element},
    finished: new Promise<Animation>(() => undefined),
  } as unknown as Animation;

  element.getAnimations = vi.fn(() => [animation]);

  return animation;
};

describe("useOverlayState", () => {
  const stops: (() => void)[] = [];

  const createState = (props: UseOverlayStateProps = {}) => {
    const scope = effectScope();
    const state = scope.run(() => useOverlayState(props));

    if (!state) {
      throw new Error("useOverlayState did not run");
    }

    stops.push(() => scope.stop());

    return state;
  };

  beforeEach(() => {
    setReducedMotion(false);
  });

  afterEach(() => {
    stops.splice(0).forEach((stop) => stop());

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  });

  it("mounts an initially open overlay without the entering state", () => {
    const state = createState({isOpen: true});

    expect(state.isOpen.value).toBe(true);
    expect(state.isMounted.value).toBe(true);
    expect(state.isEntering.value).toBe(false);
  });

  it("marks entering on open when motion is allowed", () => {
    const state = createState();

    state.open();

    expect(state.isMounted.value).toBe(true);
    expect(state.isEntering.value).toBe(true);
  });

  it("skips the enter animation when reduced motion is preferred", () => {
    setReducedMotion(true);
    const state = createState();

    state.open();

    expect(state.isMounted.value).toBe(true);
    expect(state.isEntering.value).toBe(false);
  });

  it("skips the exit animation but keeps the mount lifecycle under reduced motion", async () => {
    setReducedMotion(true);
    const onExitComplete = vi.fn();
    const state = createState({onExitComplete});
    const element = document.createElement("div");

    state.contentRef.value = element;
    attachRunningAnimation(element, 5_000);

    state.open();
    state.close();

    expect(state.isMounted.value).toBe(true);
    expect(state.isExiting.value).toBe(true);

    await flushFrames();

    expect(state.isMounted.value).toBe(false);
    expect(state.isExiting.value).toBe(false);
    expect(onExitComplete).toHaveBeenCalledTimes(1);
  });

  it("keeps the overlay mounted until the running exit animation finishes", async () => {
    const state = createState();
    const element = document.createElement("div");

    state.contentRef.value = element;
    state.open();
    attachRunningAnimation(element, 20);

    state.close();

    expect(state.isExiting.value).toBe(true);
    expect(state.isMounted.value).toBe(true);

    await vi.waitFor(() => expect(state.isMounted.value).toBe(false), {timeout: 1_000});
    expect(state.isExiting.value).toBe(false);
  });

  it("honors shouldSkipAnimation over the motion preference", async () => {
    const state = createState({shouldSkipAnimation: true});

    state.open();

    expect(state.isEntering.value).toBe(false);

    state.close();
    await flushFrames();

    expect(state.isMounted.value).toBe(false);
  });

  it("follows the controlled isOpen prop", async () => {
    const isOpen = ref(false);
    const state = createState({isOpen});

    isOpen.value = true;
    await nextTick();

    expect(state.isMounted.value).toBe(true);

    isOpen.value = false;
    await nextTick();

    expect(state.isExiting.value).toBe(true);

    await flushFrames();

    expect(state.isMounted.value).toBe(false);
  });

  it("reports open changes to the consumer callback", () => {
    const onOpenChange = vi.fn();
    const state = createState({onOpenChange});

    state.open();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    state.close();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
