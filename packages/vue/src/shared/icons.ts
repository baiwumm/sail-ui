import type {FunctionalComponent} from "vue";

import {h} from "vue";

const svgProps = {
  "aria-hidden": "true",
  fill: "none",
  height: 16,
  role: "presentation",
  viewBox: "0 0 16 16",
  width: 16,
  xmlns: "http://www.w3.org/2000/svg"
} as const;

type IconComponent = FunctionalComponent<Record<string, unknown>>;

function createStatusIcon(path: string): IconComponent {
  return (_, {attrs}) =>
    h("svg", {...svgProps, ...attrs}, [
      h("path", {
        "clip-rule": "evenodd",
        d: path,
        fill: "currentColor",
        "fill-rule": "evenodd"
      })
    ]);
}

export const InfoIcon = createStatusIcon(
  "M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z"
);

export const WarningIcon = createStatusIcon(
  "M7.134 2.994L2.217 11.5a1 1 0 0 0 .866 1.5h9.834a1 1 0 0 0 .866-1.5L8.866 2.993a1 1 0 0 0-1.732 0m3.03-.75c-.962-1.665-3.366-1.665-4.329 0L.918 10.749c-.963 1.666.24 3.751 2.165 3.751h9.834c1.925 0 3.128-2.085 2.164-3.751zM8 5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 8 5m1 5.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
);

export const DangerIcon = createStatusIcon(
  "M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M8.75 5a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0z"
);

export const SuccessIcon = createStatusIcon(
  "M13.5 8a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-3.9-1.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z"
);

export const CloseIcon: IconComponent = (_, {attrs}) =>
  h("svg", {...svgProps, ...attrs}, [
    h("path", {
      "clip-rule": "evenodd",
      d: "M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z",
      fill: "currentColor",
      "fill-rule": "evenodd"
    })
  ]);

export const ChevronRightIcon: IconComponent = (_, {attrs}) =>
  h("svg", {...svgProps, ...attrs}, [
    h("path", {
      "clip-rule": "evenodd",
      d: "M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z",
      fill: "currentColor",
      "fill-rule": "evenodd"
    })
  ]);

export const ExternalLinkIcon: IconComponent = (_, {attrs}) =>
  h(
    "svg",
    {
      "aria-hidden": "true",
      fill: "none",
      height: 9,
      role: "presentation",
      viewBox: "0 0 7 7",
      width: 9,
      xmlns: "http://www.w3.org/2000/svg",
      ...attrs
    },
    [
      h("path", {
        d: "M1.20592 6.84333L0.379822 6.01723L4.52594 1.8672H1.37819L1.38601 0.731812H6.48742V5.83714H5.34421L5.35203 2.6933L1.20592 6.84333Z",
        fill: "currentColor"
      })
    ]
  );
