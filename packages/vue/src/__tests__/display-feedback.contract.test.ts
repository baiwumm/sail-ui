import {mount} from "@vue/test-utils";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import {dataAttributesOfSlot, dataSlots, renderSSR} from "@sail-ui/testing";

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle,
} from "../components/alert";
import {Avatar, AvatarFallback, AvatarImage} from "../components/avatar";
import {AvatarGroup} from "../components/avatar-group";
import {Badge, BadgeAnchor} from "../components/badge";
import {Breadcrumbs, BreadcrumbsItem} from "../components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import {Chip} from "../components/chip";
import {CloseButton} from "../components/close-button";
import {Description} from "../components/description";
import {EmptyState} from "../components/empty-state";
import {ErrorMessage} from "../components/error-message";
import {FieldError} from "../components/field-error";
import {FieldGroup, Fieldset, FieldsetActions, FieldsetLegend} from "../components/fieldset";
import {Header} from "../components/header";
import {Input, TextField} from "../components/input";
import {Kbd, KbdAbbr, KbdContent} from "../components/kbd";
import {Label} from "../components/label";
import {Link, LinkIcon} from "../components/link";
import {
  ProgressBar,
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarTrack,
} from "../components/progress-bar";
import {
  ProgressCircle,
  ProgressCircleFillCircle,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
} from "../components/progress-circle";
import {Separator} from "../components/separator";
import {Skeleton} from "../components/skeleton";
import {Spinner} from "../components/spinner";
import {Surface} from "../components/surface";
import {Typography, TypographyProse} from "../components/typography";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const uniqueSorted = (slots: string[]) => [...new Set(slots)].sort();

function expectUpstreamSlots(html: string, component: string, extras: string[] = []) {
  const expected = [...(slotSnapshot.components[component] ?? []), ...extras];

  expect(uniqueSorted(dataSlots(html)), `${component} data-slot parity`).toEqual(
    uniqueSorted(expected),
  );
}

const pointer = (element: Element, type: string, init: PointerEventInit = {}) => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      pointerType: "mouse",
      ...init,
    }),
  );
};

const focusWithKeyboard = async (element: HTMLElement) => {
  document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Tab"}));
  element.focus();
  await nextTick();
};

afterEach(() => {
  document.body.replaceChildren();
});

describe("T03 data-slot parity", () => {
  it("Alert renders every upstream slot", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            Alert,
            {status: "warning"},
            {
              default: () => [
                h(AlertIndicator),
                h(AlertContent, null, {
                  default: () => [
                    h(AlertTitle, null, {default: () => "Heads up"}),
                    h(AlertDescription, null, {default: () => "Check the details."}),
                  ],
                }),
              ],
            },
          );
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "alert");
    expect(html).toContain('data-slot="alert-default-icon"');
    expect(html).toContain("alert--warning");
  });

  it("Avatar and AvatarGroup render their upstream slots", async () => {
    const avatarHost = defineComponent({
      setup() {
        return () =>
          h(Avatar, null, {
            default: () => [
              h(AvatarImage, {alt: "Ada", src: "https://example.com/ada.png"}),
              h(AvatarFallback, null, {default: () => "AD"}),
            ],
          });
      },
    });
    const groupHost = defineComponent({
      setup() {
        return () =>
          h(
            AvatarGroup,
            {max: 2},
            {
              default: () => [
                h(
                  Avatar,
                  {key: "a"},
                  {default: () => h(AvatarFallback, null, {default: () => "A"})},
                ),
                h(
                  Avatar,
                  {key: "b"},
                  {default: () => h(AvatarFallback, null, {default: () => "B"})},
                ),
                h(
                  Avatar,
                  {key: "c"},
                  {default: () => h(AvatarFallback, null, {default: () => "C"})},
                ),
              ],
            },
          );
      },
    });

    expectUpstreamSlots(await renderSSR(avatarHost), "avatar");
    expectUpstreamSlots(await renderSSR(groupHost), "avatar-group", ["avatar-fallback"]);
    expect(await renderSSR(groupHost)).toContain("+1");
  });

  it("Badge renders anchor, badge, and label slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(BadgeAnchor, null, {
            default: () => [h("span", "Inbox"), h(Badge, {color: "danger"}, {default: () => "3"})],
          });
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "badge");
    expect(html).toContain("badge--danger");
  });

  it("Breadcrumbs renders items and separators", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Breadcrumbs, null, {
            default: () => [
              h(BreadcrumbsItem, {href: "/"}, {default: () => "Home"}),
              h(BreadcrumbsItem, {href: "/docs"}, {default: () => "Docs"}),
            ],
          });
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "breadcrumbs", ["link"]);
    expect(dataSlots(html).filter((slot) => slot === "breadcrumbs-item")).toHaveLength(2);
    expect(dataSlots(html).filter((slot) => slot === "breadcrumbs-separator")).toHaveLength(1);
  });

  it("Card renders every upstream slot", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            Card,
            {variant: "secondary"},
            {
              default: () => [
                h(CardHeader, null, {
                  default: () => [
                    h(CardTitle, null, {default: () => "Title"}),
                    h(CardDescription, null, {default: () => "Description"}),
                  ],
                }),
                h(CardContent, null, {default: () => "Body"}),
                h(CardFooter, null, {default: () => "Footer"}),
              ],
            },
          );
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "card");
    expect(html).toContain("card--secondary");
  });

  it("Chip renders its upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () => h(Chip, {color: "success"}, {default: () => "Active"});
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "chip");
    expect(html).toContain("chip--success");
  });

  it("CloseButton renders its icon by default", async () => {
    const html = await renderSSR(CloseButton);

    expectUpstreamSlots(html, "close-button");
    expect(html).toContain('aria-label="Close"');
  });

  it("Description, EmptyState, ErrorMessage, Header, Label, Separator, Surface each expose one slot", async () => {
    const cases = [
      [Description, "description", {default: () => "Help"}],
      [EmptyState, "empty-state", {}],
      [ErrorMessage, "error-message", {default: () => "Oops"}],
      [Header, "header", {default: () => "Header"}],
      [Label, "label", {default: () => "Label"}],
      [Separator, "separator", {}],
      [Surface, "surface", {default: () => "Surface"}],
    ] as const;

    for (const [component, slot, slots] of cases) {
      const html = await renderSSR(component, {slots});
      expectUpstreamSlots(html, slot);
    }

    const emptyState = await renderSSR(EmptyState);
    expect(emptyState).toContain("No results found");
  });

  it("FieldError renders inside an invalid field only", async () => {
    const invalidHost = defineComponent({
      setup() {
        return () =>
          h(
            TextField,
            {isInvalid: true},
            {
              default: () => [
                h(Label, null, {default: () => "Email"}),
                h(Input, {placeholder: "you@example.com"}),
                h(FieldError, null, {default: () => "Enter a valid email."}),
              ],
            },
          );
      },
    });
    const validHost = defineComponent({
      setup() {
        return () =>
          h(TextField, null, {
            default: () => [h(Label, null, {default: () => "Email"}), h(Input), h(FieldError)],
          });
      },
    });

    const html = await renderSSR(invalidHost);
    expectUpstreamSlots(html, "field-error", ["textfield", "label", "input"]);
    expect(dataAttributesOfSlot(html, "field-error")[0]).toHaveProperty("data-visible", "true");
    expect(await renderSSR(validHost)).not.toContain('data-slot="field-error"');
  });

  it("Fieldset renders legend, field group, and actions", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Fieldset, null, {
            default: () => [
              h(FieldsetLegend, null, {default: () => "Address"}),
              h(FieldGroup, null, {
                default: () => [
                  h(TextField, null, {
                    default: () => [h(Label, null, {default: () => "Street"}), h(Input)],
                  }),
                ],
              }),
              h(FieldsetActions, null, {default: () => "Save"}),
            ],
          });
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "fieldset", ["textfield", "label", "input"]);
    expect(html).toContain("<fieldset");
    expect(html).toContain("<legend");
  });

  it("Kbd renders without data-slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Kbd, null, {
            default: () => [
              h(KbdContent, null, {default: () => "Save"}),
              h(KbdAbbr, {keyValue: "command"}),
            ],
          });
      },
    });
    const html = await renderSSR(host);

    expect(dataSlots(html)).toEqual([]);
    expect(html).toContain("⌘");
    expect(html).toContain('title="Command"');
  });

  it("Link renders default icon slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            Link,
            {href: "https://example.com"},
            {
              default: () => ["Docs", h(LinkIcon)],
            },
          );
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "link");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('data-default-icon="true"');
  });

  it("ProgressBar renders output, track, and fill", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            ProgressBar,
            {value: 40},
            {
              default: () => [
                h(ProgressBarOutput),
                h(ProgressBarTrack, null, {
                  default: () => h(ProgressBarFill),
                }),
              ],
            },
          );
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "progress-bar");
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain("40%");
  });

  it("ProgressCircle renders both circles", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            ProgressCircle,
            {value: 75},
            {
              default: () =>
                h(ProgressCircleTrack, null, {
                  default: () => [h(ProgressCircleTrackCircle), h(ProgressCircleFillCircle)],
                }),
            },
          );
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "progress-circle");
    expect(html).toContain('viewBox="0 0 36 36"');
    expect(html).toContain('r="16"');
  });

  it("Skeleton renders without data-slots", async () => {
    const html = await renderSSR(Skeleton);

    expect(dataSlots(html)).toEqual([]);
    expect(html).toContain("skeleton--shimmer");
  });

  it("Spinner renders status and icon", async () => {
    const html = await renderSSR(Spinner);

    expectUpstreamSlots(html, "spinner");
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="Loading"');
    expect(html).toContain('aria-hidden="true"');
  });

  it("Typography renders prose and text slots", async () => {
    const host = defineComponent({
      setup() {
        return () => [
          h(Typography, {type: "h2"}, {default: () => "Title"}),
          h(TypographyProse, null, {default: () => h("p", "Copy")}),
        ];
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "typography", ["prose"]);
    expect(html).toContain('data-type="h2"');
  });
});

describe("T03 interactive state contract", () => {
  it("CloseButton emits hover, press, focus, pending, and disabled states", async () => {
    const wrapper = mount(CloseButton, {attachTo: document.body});
    const button = wrapper.get("button");

    pointer(button.element, "pointerenter");
    await nextTick();
    expect(button.attributes("data-hovered")).toBe("true");

    pointer(button.element, "pointerdown", {button: 0});
    await nextTick();
    expect(button.attributes("data-pressed")).toBe("true");

    pointer(button.element, "pointerup");
    await nextTick();
    expect(button.attributes("data-pressed")).toBeUndefined();

    await focusWithKeyboard(button.element as HTMLElement);
    expect(button.attributes("data-focused")).toBe("true");
    expect(button.attributes("data-focus-visible")).toBe("true");

    await wrapper.setProps({isPending: true});
    expect(button.attributes("data-pending")).toBe("true");
    expect(button.attributes("aria-disabled")).toBe("true");
    expect(button.attributes("data-disabled")).toBeUndefined();
    expect(button.attributes("disabled")).toBeUndefined();

    await wrapper.setProps({isPending: false, isDisabled: true});
    expect(button.attributes("data-disabled")).toBe("true");
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.attributes("data-pending")).toBeUndefined();

    wrapper.unmount();
  });

  it("Link emits hover, press, focus, current, and disabled states", async () => {
    const wrapper = mount(Link, {
      attachTo: document.body,
      props: {href: "https://example.com"},
      attrs: {"aria-current": "page"},
      slots: {default: () => "Docs"},
    });
    const link = wrapper.get("a");

    expect(link.attributes("data-current")).toBe("true");

    pointer(link.element, "pointerenter");
    await nextTick();
    expect(link.attributes("data-hovered")).toBe("true");

    pointer(link.element, "pointerdown", {button: 0});
    await nextTick();
    expect(link.attributes("data-pressed")).toBe("true");
    pointer(link.element, "pointerup");

    await focusWithKeyboard(link.element as HTMLElement);
    expect(link.attributes("data-focused")).toBe("true");
    expect(link.attributes("data-focus-visible")).toBe("true");

    await wrapper.setProps({isDisabled: true});
    const disabledLink = wrapper.get("span[role='link']");

    expect(disabledLink.attributes("aria-disabled")).toBe("true");
    expect(disabledLink.attributes("data-disabled")).toBe("true");
    expect(disabledLink.attributes("tabindex")).toBeUndefined();

    wrapper.unmount();
  });

  it("Breadcrumbs marks the last item current and hoverable links", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Breadcrumbs, null, {
            default: () => [
              h(BreadcrumbsItem, {href: "/"}, {default: () => "Home"}),
              h(BreadcrumbsItem, {href: "/docs"}, {default: () => "Docs"}),
            ],
          });
      },
    });
    const wrapper = mount(host, {attachTo: document.body});
    const items = wrapper.findAll('[data-slot="breadcrumbs-item"]');
    const links = wrapper.findAll("a, [role='link']");

    expect(items).toHaveLength(2);
    expect(items[0]!.attributes("data-current")).toBeUndefined();
    expect(items[1]!.attributes("data-current")).toBe("true");
    expect(items[1]!.attributes("data-disabled")).toBe("true");
    expect(links).toHaveLength(2);
    expect(links[1]!.attributes("aria-current")).toBe("page");

    pointer(links[0]!.element, "pointerenter");
    await nextTick();
    expect(links[0]!.attributes("data-hovered")).toBe("true");

    expect(wrapper.get("ol").attributes("aria-label")).toBe("Breadcrumbs");
    expect(wrapper.findAll('[data-slot="breadcrumbs-separator"]')).toHaveLength(1);

    wrapper.unmount();
  });

  it("ProgressBar exposes disabled and indeterminate states", async () => {
    const wrapper = mount(ProgressBar, {
      attachTo: document.body,
      props: {isDisabled: true, value: 25},
      slots: {
        default: () => [
          h(ProgressBarOutput),
          h(ProgressBarTrack, null, {default: () => h(ProgressBarFill)}),
        ],
      },
    });
    const root = wrapper.get('[data-slot="progress-bar"]');

    expect(root.attributes("data-disabled")).toBe("true");
    expect(root.attributes("aria-disabled")).toBe("true");

    await wrapper.setProps({isDisabled: false, isIndeterminate: true});
    expect(root.attributes("aria-valuenow")).toBeUndefined();
    expect(root.attributes("aria-valuetext")).toBeUndefined();
    expect(wrapper.get('[data-slot="progress-bar-output"]').text()).toBe("");

    wrapper.unmount();
  });

  it("ProgressCircle exposes the disabled state", async () => {
    const wrapper = mount(ProgressCircle, {
      attachTo: document.body,
      props: {isDisabled: true},
      slots: {
        default: () =>
          h(ProgressCircleTrack, null, {
            default: () => [h(ProgressCircleTrackCircle), h(ProgressCircleFillCircle)],
          }),
      },
    });
    const root = wrapper.get('[data-slot="progress-circle"]');

    expect(root.attributes("data-disabled")).toBe("true");
    expect(root.attributes("aria-disabled")).toBe("true");

    wrapper.unmount();
  });

  it("Fieldset marks its disabled state with presence and native disabled", async () => {
    const wrapper = mount(Fieldset, {
      attachTo: document.body,
      props: {isDisabled: true},
      slots: {default: () => h(FieldsetLegend, null, {default: () => "Title"})},
    });
    const fieldset = wrapper.get("fieldset");

    expect(fieldset.attributes("data-disabled")).toBe("true");
    expect(fieldset.attributes("disabled")).toBeDefined();

    wrapper.unmount();
  });
});
