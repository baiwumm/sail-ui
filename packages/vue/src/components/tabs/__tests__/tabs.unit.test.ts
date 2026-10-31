import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import {Tab, TabIndicator, TabList, TabListContainer, TabPanel, TabSeparator, Tabs} from "../index";

interface TabItem {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface RenderOptions {
  props?: Record<string, unknown>;
  items?: TabItem[];
  withContainer?: boolean;
  withIndicator?: boolean;
  withSeparator?: boolean;
}

const defaultItems: TabItem[] = [
  {label: "One", value: "one"},
  {label: "Two", value: "two"},
  {label: "Three", value: "three"},
];

function tabsSlot({
  items = defaultItems,
  withContainer = true,
  withIndicator = true,
  withSeparator = false,
}: Pick<RenderOptions, "items" | "withContainer" | "withIndicator" | "withSeparator"> = {}) {
  const tabNodes = items.map((item) =>
    h(
      Tab,
      {isDisabled: item.isDisabled, key: item.value, value: item.value},
      {
        default: () => [
          withSeparator && item.value !== items[0]!.value ? h(TabSeparator) : null,
          item.label,
          withIndicator ? h(TabIndicator) : null,
        ],
      },
    ),
  );

  return [
    withContainer
      ? h(TabListContainer, null, {
          default: () => h(TabList, {"aria-label": "Sections"}, {default: () => tabNodes}),
        })
      : h(TabList, {"aria-label": "Sections"}, {default: () => tabNodes}),
    ...items.map((item) =>
      h(
        TabPanel,
        {key: item.value, value: item.value},
        {
          default: () => `Panel ${item.label}`,
        },
      ),
    ),
  ];
}

function renderTabs(options: RenderOptions = {}) {
  return mount(Tabs, {
    attachTo: document.body,
    props: options.props,
    slots: {default: () => tabsSlot(options)},
  });
}

const tabsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll("[data-slot='tabs-tab']");
const panelsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll("[data-slot='tabs-panel']");
const indicatorsOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll("[data-slot='tabs-indicator']");

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

afterEach(() => {
  document.body.replaceChildren();
});

describe("Tabs", () => {
  it("renders every upstream part and derives ids from useId", () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "one"}});

    expect(wrapper.get("[data-slot='tabs']").classes()).toContain("tabs");
    expect(wrapper.get("[data-slot='tabs']").attributes("data-orientation")).toBe("horizontal");
    expect(wrapper.get("[data-slot='tabs-list']").attributes("role")).toBe("tablist");
    expect(wrapper.get("[data-slot='tabs-list']").attributes("data-orientation")).toBe(
      "horizontal",
    );

    expect(tabsOf(wrapper)).toHaveLength(3);
    expect(tabsOf(wrapper)[0]!.attributes("role")).toBe("tab");
    expect(tabsOf(wrapper)[0]!.attributes("type")).toBeUndefined();
    expect(tabsOf(wrapper)[0]!.attributes("disabled")).toBeUndefined();
    expect(tabsOf(wrapper)[0]!.attributes("aria-selected")).toBe("true");
    expect(tabsOf(wrapper)[0]!.attributes("data-selected")).toBe("true");
    expect(tabsOf(wrapper)[1]!.attributes("aria-selected")).toBe("false");
    expect(tabsOf(wrapper)[1]!.attributes("data-selected")).toBeUndefined();

    expect(panelsOf(wrapper)[0]!.attributes("role")).toBe("tabpanel");
    expect(panelsOf(wrapper)[0]!.attributes("tabindex")).toBe("0");
    expect(tabsOf(wrapper)[0]!.attributes("aria-controls")).toBe(
      panelsOf(wrapper)[0]!.attributes("id"),
    );
    expect(panelsOf(wrapper)[0]!.attributes("aria-labelledby")).toBe(
      tabsOf(wrapper)[0]!.attributes("id"),
    );
    expect(tabsOf(wrapper)[0]!.attributes("id")).not.toContain("reka-tabs");

    expect(indicatorsOf(wrapper)).toHaveLength(1);
    expect(tabsOf(wrapper)[0]!.find("[data-slot='tabs-indicator']").exists()).toBe(true);

    wrapper.unmount();
  });

  it("starts without a selection when no default is given", () => {
    const wrapper = renderTabs();

    expect(indicatorsOf(wrapper)).toHaveLength(0);
    expect(tabsOf(wrapper).every((tab) => tab.attributes("aria-selected") === "false")).toBe(true);
    expect(panelsOf(wrapper)).toHaveLength(0);

    wrapper.unmount();
  });

  it("mounts only the selected panel by default", () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "two"}});
    const panels = panelsOf(wrapper);

    expect(panels).toHaveLength(1);
    expect(panels[0]!.text()).toBe("Panel Two");
    expect(panels[0]!.attributes("data-selected")).toBe("true");
    expect(panels[0]!.attributes("data-inert")).toBeUndefined();
    expect(panels[0]!.attributes("id")).toBe(tabsOf(wrapper)[1]!.attributes("aria-controls"));
    expect(panels[0]!.attributes("aria-labelledby")).toBe(tabsOf(wrapper)[1]!.attributes("id"));

    wrapper.unmount();
  });

  it("keeps force-mounted panels mounted and inert", () => {
    const wrapper = mount(Tabs, {
      attachTo: document.body,
      props: {defaultSelectedKey: "one"},
      slots: {
        default: () => [
          h(TabList, null, {
            default: () => [
              h(Tab, {value: "one"}, {default: () => "One"}),
              h(Tab, {value: "two"}, {default: () => "Two"}),
            ],
          }),
          h(TabPanel, {value: "one"}, {default: () => "Panel One"}),
          h(TabPanel, {forceMount: true, value: "two"}, {default: () => "Panel Two"}),
        ],
      },
    });
    const panels = panelsOf(wrapper);

    expect(panels).toHaveLength(2);
    expect(panels[1]!.text()).toBe("Panel Two");
    expect(panels[1]!.attributes("data-selected")).toBeUndefined();
    expect(panels[1]!.attributes("data-inert")).toBe("true");
    expect(panels[1]!.attributes("inert")).toBeDefined();

    wrapper.unmount();
  });

  it("selects a tab on mousedown and mirrors it into the indicator", async () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "one"}});

    await tabsOf(wrapper)[2]!.trigger("mousedown");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["three"]);
    expect(wrapper.emitted("selection-change")?.[0]).toEqual(["three"]);
    expect(tabsOf(wrapper)[2]!.attributes("data-selected")).toBe("true");
    expect(tabsOf(wrapper)[0]!.attributes("data-selected")).toBeUndefined();

    expect(indicatorsOf(wrapper)).toHaveLength(1);
    expect(tabsOf(wrapper)[2]!.find("[data-slot='tabs-indicator']").exists()).toBe(true);
    expect(panelsOf(wrapper)).toHaveLength(1);
    expect(panelsOf(wrapper)[0]!.text()).toBe("Panel Three");

    wrapper.unmount();
  });

  it("does not re-emit when the selected tab is pressed again", async () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "one"}});

    await tabsOf(wrapper)[0]!.trigger("mousedown");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("selection-change")).toBeUndefined();

    wrapper.unmount();
  });

  it("supports a controlled host through v-model", async () => {
    const selected = ref<string | number | undefined>("one");

    const host = defineComponent({
      setup() {
        return () =>
          h(
            Tabs,
            {
              modelValue: selected.value,
              "onUpdate:modelValue": (value?: string | number) => {
                selected.value = value;
              },
            },
            {default: () => tabsSlot()},
          );
      },
    });
    const wrapper = mount(host, {attachTo: document.body});

    await wrapper.findAll("[data-slot='tabs-tab']")[1]!.trigger("mousedown");
    await nextTick();

    expect(selected.value).toBe("two");
    expect(wrapper.get("[data-slot='tabs-tab'][data-selected='true']").attributes("id")).toBe(
      wrapper.findAll("[data-slot='tabs-tab']")[1]!.attributes("id"),
    );
    expect(wrapper.get("[data-slot='tabs-panel']").text()).toBe("Panel Two");

    wrapper.unmount();
  });

  it("moves focus with arrow keys and activates automatically by default", async () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "one"}});
    const [first, second] = tabsOf(wrapper);

    (first!.element as HTMLElement).focus();
    await nextTick();
    first!.element.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "ArrowRight"}));
    await nextTick();
    await nextTick();

    expect(document.activeElement).toBe(second!.element);
    expect(second!.attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("waits for Enter to activate in manual mode", async () => {
    const wrapper = renderTabs({props: {activationMode: "manual", defaultSelectedKey: "one"}});
    const [first, second] = tabsOf(wrapper);

    (first!.element as HTMLElement).focus();
    await nextTick();
    first!.element.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "ArrowRight"}));
    await nextTick();

    expect(document.activeElement).toBe(second!.element);
    expect(second!.attributes("data-selected")).toBeUndefined();

    second!.element.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Enter"}));
    await nextTick();

    expect(second!.attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("ignores disabled tabs and disabled roots", async () => {
    const wrapper = renderTabs({
      props: {defaultSelectedKey: "one"},
      items: [
        {label: "One", value: "one"},
        {isDisabled: true, label: "Two", value: "two"},
      ],
    });

    expect(tabsOf(wrapper)[1]!.attributes("aria-disabled")).toBe("true");
    expect(tabsOf(wrapper)[1]!.attributes("data-disabled")).toBe("true");

    await tabsOf(wrapper)[1]!.trigger("mousedown");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(tabsOf(wrapper)[0]!.attributes("data-selected")).toBe("true");

    wrapper.unmount();

    const disabled = renderTabs({props: {defaultSelectedKey: "one", isDisabled: true}});

    expect(disabled.get("[data-slot='tabs']").attributes("data-disabled")).toBe("true");
    expect(tabsOf(disabled).every((tab) => tab.attributes("data-disabled") === "true")).toBe(true);

    await tabsOf(disabled)[1]!.trigger("mousedown");
    await nextTick();

    expect(disabled.emitted("update:modelValue")).toBeUndefined();

    disabled.unmount();
  });

  it("emits press and tracks hover, press, and focus-visible", async () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "one"}});
    const tab = tabsOf(wrapper)[0]!;
    const tabComponent = wrapper.findAllComponents(Tab)[0]!;
    const element = tab.element as HTMLElement;

    element.dispatchEvent(
      new PointerEvent("pointerenter", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
    );
    await nextTick();
    expect(tab.attributes("data-hovered")).toBe("true");

    element.dispatchEvent(
      new PointerEvent("pointerdown", {bubbles: true, button: 0, pointerId: 1}),
    );
    await nextTick();
    expect(tab.attributes("data-pressed")).toBe("true");

    element.dispatchEvent(
      new PointerEvent("pointerup", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
    );
    await flushPromises();
    expect(tabComponent.emitted("press")).toHaveLength(1);

    document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Tab"}));
    element.focus();
    await nextTick();
    expect(tab.attributes("data-focus-visible")).toBe("true");

    wrapper.unmount();
  });

  it("turns the indicator animation on after the first client frame", async () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "one"}});

    expect(indicatorsOf(wrapper)[0]!.attributes("data-animation-ready")).toBe("false");

    await flushPromises();
    await nextFrame();
    await nextTick();

    expect(indicatorsOf(wrapper)[0]!.attributes("data-animation-ready")).toBe("true");

    wrapper.unmount();
  });

  it("renders the scroll shadow scroller and chevron buttons", async () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "one"}});
    const container = wrapper.get("[data-slot='tabs-list-container']");
    const scroller = container.get("[data-slot='scroll-shadow']");

    expect(container.classes()).toContain("tabs__list-container");
    expect(scroller.classes()).toEqual(
      expect.arrayContaining([
        "scroll-shadow",
        "scroll-shadow--hide-scrollbar",
        "scroll-shadow--horizontal",
        "tabs__list-container__scroller",
      ]),
    );
    expect(scroller.attributes("data-orientation")).toBe("horizontal");
    expect(scroller.attributes("data-scroll-shadow-mode")).toBe("auto");
    expect(scroller.attributes("data-scroll-shadow-size")).toBe("64");
    expect(scroller.attributes("style")).toContain("--scroll-shadow-size: 64px");
    expect(scroller.attributes("style")).toContain("--scroll-shadow-offset: 0px");

    const buttons = container.findAll("button");

    expect(buttons.map((button) => button.attributes("aria-label"))).toEqual([
      "Scroll tabs left",
      "Scroll tabs right",
    ]);
    expect(buttons.every((button) => button.attributes("tabindex") === "-1")).toBe(true);

    await nextFrame();
    await nextTick();

    expect(scroller.attributes("data-left-scroll")).toBe("false");
    expect(scroller.attributes("data-right-scroll")).toBe("false");

    await buttons[1]!.trigger("click");

    wrapper.unmount();
  });

  it("switches the scroller and chevrons for vertical orientation", () => {
    const wrapper = renderTabs({props: {defaultSelectedKey: "one", orientation: "vertical"}});
    const root = wrapper.get("[data-slot='tabs']");

    expect(root.attributes("data-orientation")).toBe("vertical");
    expect(wrapper.get("[data-slot='tabs-list']").attributes("data-orientation")).toBe("vertical");

    const scroller = wrapper.get("[data-slot='scroll-shadow']");

    expect(scroller.classes()).toContain("scroll-shadow--vertical");
    expect(scroller.attributes("data-orientation")).toBe("vertical");
    expect(
      wrapper
        .findAll("[data-slot='tabs-list-container'] button")
        .map((button) => button.attributes("aria-label")),
    ).toEqual(["Scroll tabs up", "Scroll tabs down"]);

    wrapper.unmount();
  });

  it("applies the variant and alignment classes", () => {
    const wrapper = renderTabs({props: {align: "end", variant: "secondary"}});
    const root = wrapper.get("[data-slot='tabs']");

    expect(root.classes()).toContain("tabs--secondary");
    expect(root.classes()).toContain("tabs--align-end");

    wrapper.unmount();
  });

  it("renders separators and works without a list container", () => {
    const wrapper = renderTabs({withContainer: false, withSeparator: true});

    expect(wrapper.find("[data-slot='tabs-list-container']").exists()).toBe(false);
    expect(wrapper.find("[data-slot='scroll-shadow']").exists()).toBe(false);

    const separators = wrapper.findAll("[data-slot='tabs-separator']");

    expect(separators).toHaveLength(2);
    expect(separators[0]!.attributes("aria-hidden")).toBe("true");
    expect(separators[0]!.classes()).toContain("tabs__separator");

    wrapper.unmount();
  });
});
