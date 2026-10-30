import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle,
} from "../components/alert";
import {Avatar, AvatarFallback, AvatarImage} from "../components/avatar";
import {AvatarGroup, AvatarGroupCount} from "../components/avatar-group";
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

const Page = defineComponent({
  setup() {
    return () =>
      h("main", [
        h(
          Alert,
          {status: "danger"},
          {
            default: () => [
              h(AlertIndicator),
              h(AlertContent, null, {
                default: () => [
                  h(AlertTitle, null, {default: () => "Error"}),
                  h(AlertDescription, null, {default: () => "Retry later."}),
                ],
              }),
            ],
          },
        ),
        h(
          AvatarGroup,
          {max: 1},
          {
            default: () => [
              h(Avatar, null, {
                default: () => [
                  h(AvatarImage, {alt: "Ada", src: "https://example.com/ada.png"}),
                  h(AvatarFallback, null, {default: () => "AD"}),
                ],
              }),
              h(Avatar, null, {default: () => h(AvatarFallback, null, {default: () => "BE"})}),
              h(AvatarGroupCount, null, {default: () => "9+"}),
            ],
          },
        ),
        h(BadgeAnchor, null, {
          default: () => ["Inbox", h(Badge, null, {default: () => "3"})],
        }),
        h(Breadcrumbs, null, {
          default: () => [
            h(BreadcrumbsItem, {href: "/"}, {default: () => "Home"}),
            h(BreadcrumbsItem, {href: "/docs"}, {default: () => "Docs"}),
          ],
        }),
        h(Card, null, {
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
        }),
        h(Chip, null, {default: () => "Active"}),
        h(CloseButton),
        h(Description, null, {default: () => "Help"}),
        h(EmptyState),
        h(ErrorMessage, null, {default: () => "Oops"}),
        h(Fieldset, null, {
          default: () => [
            h(FieldsetLegend, null, {default: () => "Address"}),
            h(FieldGroup, null, {
              default: () => [
                h(
                  TextField,
                  {isInvalid: true},
                  {
                    default: () => [
                      h(Label, null, {default: () => "Email"}),
                      h(Input),
                      h(FieldError, null, {default: () => "Invalid email."}),
                    ],
                  },
                ),
              ],
            }),
            h(FieldsetActions, null, {default: () => "Save"}),
          ],
        }),
        h(Header, null, {default: () => "Header"}),
        h(Kbd, null, {
          default: () => [
            h(KbdContent, null, {default: () => "K"}),
            h(KbdAbbr, {keyValue: "command"}),
          ],
        }),
        h(Link, {href: "https://example.com"}, {default: () => ["Docs", h(LinkIcon)]}),
        h(
          ProgressBar,
          {value: 40},
          {
            default: () => [
              h(Label, null, {default: () => "Upload"}),
              h(ProgressBarOutput),
              h(ProgressBarTrack, null, {default: () => h(ProgressBarFill)}),
            ],
          },
        ),
        h(
          ProgressCircle,
          {value: 70},
          {
            default: () =>
              h(ProgressCircleTrack, null, {
                default: () => [h(ProgressCircleTrackCircle), h(ProgressCircleFillCircle)],
              }),
          },
        ),
        h(Separator),
        h(Skeleton),
        h(Spinner),
        h(Surface, null, {default: () => "Surface"}),
        h(Typography, {type: "h2"}, {default: () => "Heading"}),
        h(TypographyProse, null, {default: () => "Prose"}),
      ]);
  },
});

describe("T03 SSR", () => {
  it("renders all display and feedback components with upstream slots", async () => {
    const html = await renderSSR(Page);

    for (const slot of [
      "alert-root",
      "alert-content",
      "alert-title",
      "alert-description",
      "alert-indicator",
      "alert-default-icon",
      "avatar-group",
      "avatar-fallback",
      "avatar-group-count",
      "badge-anchor",
      "badge",
      "badge-label",
      "breadcrumbs",
      "breadcrumbs-item",
      "breadcrumbs-separator",
      "link",
      "link-icon",
      "link-default-icon",
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-content",
      "card-footer",
      "chip",
      "chip-label",
      "close-button",
      "close-button-icon",
      "description",
      "empty-state",
      "error-message",
      "fieldset",
      "fieldset-legend",
      "fieldset-field-group",
      "fieldset-actions",
      "textfield",
      "label",
      "input",
      "field-error",
      "header",
      "progress-bar",
      "progress-bar-output",
      "progress-bar-track",
      "progress-bar-fill",
      "progress-circle",
      "progress-circle-track",
      "progress-circle-track-circle",
      "progress-circle-fill-circle",
      "separator",
      "spinner",
      "spinner-icon",
      "surface",
      "typography",
      "prose",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html).not.toContain("skeleton--pulse");
    expect(html).toContain("skeleton--shimmer");
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="40"');
  });

  it("is deterministic across renders", async () => {
    const first = await renderSSR(Page);
    const second = await renderSSR(Page);

    expect(second).toBe(first);
  });
});
