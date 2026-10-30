# GLOSSARY

Shared vocabulary for Sail UI. If a term here conflicts with a local nickname, this file wins.

## Product and upstream

| Term                  | Meaning                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **HeroUI / upstream** | The React component library at `../heroui`, pinned to `3.2.7` / commit `89cd95ec1`. The source of the CSS and DOM contract. |
| **Sail UI**           | This project: an unofficial Vue 3 / Nuxt port of HeroUI v3.                                                                 |
| **RAC**               | React Aria Components. HeroUI's React behavior layer. We do not port RAC.                                                   |
| **Reka UI**           | The Vue headless primitive library (`reka-ui@2.11.0`) used as our behavior layer.                                           |
| **Port**              | Reproducing HeroUI's public behavior and visual contract in Vue, not translating React source line by line.                 |
| **Parity**            | Behavioral, API, and visual equivalence with the pinned upstream version.                                                   |

## Contracts

| Term                          | Meaning                                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CSS contract**              | The class names and selectors in upstream CSS. They are public styling API; we do not rewrite them.                                                  |
| **DOM contract**              | The element structure, `data-slot` values, `data-*` states, ARIA roles, and attributes that upstream CSS and tests expect.                           |
| **`data-slot`**               | Stable hook identifying a component part, e.g. `card-header`, `select-trigger`. Must match upstream exactly.                                         |
| **Compat CSS (`compat.css`)** | Generated selector aliases that map Reka's attribute vocabulary to HeroUI's. Never hand-edited.                                                      |
| **Attribute alias**           | A selector-list alias such as `[data-selected="true"], [data-state="checked"]`; does not change specificity.                                         |
| **Behavior primitive**        | A small composable that supplies a state Reka does not emit (`useHover`, `usePress`, `useFocusRing`, `useOverlayState`).                             |
| **Overlay state machine**     | The open/entering/exiting lifecycle that emits `data-open`, `data-entering`, `data-exiting` and holds unmount until the CSS exit animation finishes. |
| **Exit hold**                 | Keeping an overlay mounted until its real exit animation completes, including WebKit's pending-animation frame.                                      |

## Component API

| Term                          | Meaning                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Compound component**        | A root plus named parts (`Card`, `CardHeader`, `CardContent`). In Vue, named exports are primary; the compound object is for `:is` and programmatic use. |
| **Root**                      | The state-owning component of a compound family. `.Root` is an alias of the compound object's root.                                                      |
| **Named export API**          | The import style used in Vue templates: `import { CardHeader } from "@sail-ui/vue"`.                                                                     |
| **Subpath export**            | A per-component entry point, e.g. `@sail-ui/vue/button`, mirroring `@heroui/react/button`.                                                               |
| **Variant map**               | A `tv()` definition from `@heroui/styles` that maps props to BEM classes.                                                                                |
| **Slot**                      | A `tv()` part (e.g. `slots.trigger()`) or a Vue `<slot>`. Read the context to disambiguate.                                                              |
| **Scoped slot**               | Vue's replacement for React render props: `<slot :is-hovered="..." />`, consumed with `#default="{ isHovered }"`.                                        |
| **Uncontrolled / controlled** | Uncontrolled uses `default*` props and internal state; controlled uses `v-model` / `v-model:open`.                                                       |

## Delivery

| Term                  | Meaning                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Spec**              | The reviewable statement of problem, scope, decisions, acceptance, and risks.                                      |
| **Out of Scope**      | Explicit exclusions. A spec without this section is incomplete.                                                    |
| **Ticket**            | A vertical slice that crosses all layers and is independently demoable.                                            |
| **Vertical slice**    | Work that delivers a user-visible outcome end to end, not a horizontal layer.                                      |
| **Blocking edge**     | A dependency between tickets, recorded as `Blocked by`.                                                            |
| **Acceptance matrix** | The per-component checklist and global gates that define "done".                                                   |
| **DoD**               | Definition of Done: the gates a ticket must pass before review.                                                    |
| **Contract test**     | A test that renders the component and asserts the required `data-slot`/`data-*` contract against CSS expectations. |
| **SSR smoke**         | A server-render test that checks stable markup, ids, and no closed overlay DOM.                                    |
| **Visual regression** | Screenshot comparison against the upstream React reference for defined states and themes.                          |
| **M0-M4**             | Milestones: spike, foundation/MVP, overlays/collections, date/color/advanced, docs/a11y/release.                   |
| **MVP**               | The 40-component release described in the spec, not every upstream component.                                      |
| **ADR**               | Architecture Decision Record stored in `docs/decisions/`.                                                          |
| **Retro**             | End-of-milestone review whose conclusions become rules, ADRs, or tests.                                            |

## Naming rules

- Write **HeroUI** (one word) when referring to the upstream project.
- Write **Sail UI** (two words) for the product, and `@sail-ui/*` for packages.
- Do not call the project "HeroUI Vue" in package names or public docs; use "Sail UI — unofficial Vue port of HeroUI v3".
- Use **React Aria Components** or **RAC**, never "react-aria" alone when referring to the behavior layer.
