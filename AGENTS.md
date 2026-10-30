# AGENTS.md

Instructions for AI agents and contributors working on **Sail UI** — an unofficial Vue 3 / Nuxt port of HeroUI v3.

> **Current phase: M1 complete.** T01 (M0 architecture spike), T02 (contract tooling), T03 (24 display/layout/feedback components), and T04 (19 form controls) are complete. The workspace builds and `pnpm verify` is the full gate. M1 delivered 43 components; every other entry in the component matrix is still pending. T08 (advanced data) and T09 (Nuxt module, docs site, release) are now unblocked.

---

## 1. What this project is

Sail UI reuses the **HeroUI v3 CSS and DOM contract** and swaps the React behavior layer for Vue-native behavior:

- **Styles** — verbatim fork of `@heroui/styles`, plus a generated `compat.css`.
- **Components** — Vue SFCs that wrap [Reka UI](https://reka-ui.com) primitives and emit the `data-*` attributes the upstream CSS expects.
- **Primitives** — four small composables for states Reka does not emit (`useHover`, `usePress`, `useFocusRing`, `useOverlayState`).
- **Packages** — `@sail-ui/vue`, `@sail-ui/styles`, `@sail-ui/primitives`, `@sail-ui/nuxt`, `@sail-ui/testing`.

Read these before making design changes:

1. [Spec](./docs/spec/0001-heroui-v3-vue-port.spec.md)
2. [Acceptance matrix](./docs/acceptance-matrix.md)
3. [Component matrix](./docs/component-matrix.md)
4. [Decision records](./docs/decisions/README.md)
5. [GLOSSARY.md](./GLOSSARY.md)

## 2. Source of truth and precedence

When documents disagree, use this order and **stop to ask** if the conflict affects public API or visual parity:

1. Upstream CSS and React source at the pinned commit — the DOM/CSS contract.
2. The spec and accepted ADRs — product and architecture decisions.
3. The active ticket — scope, acceptance, and blocking edges.
4. This file — workflow and implementation rules.

Project rules win over generic agent skills or model memory. If a skill recommends something that conflicts with this repository, follow the repository and record the trade-off in the commit message or an ADR.

## 3. Reference repositories (read-only)

| Repo      | Local sibling | Use for                                                            |
| --------- | ------------- | ------------------------------------------------------------------ |
| HeroUI v3 | `../heroui`   | CSS, React components, variants, docs, tests — the contract source |
| Nuxt UI   | `../nuxtui`   | Vue/Nuxt API and module patterns — reference only                  |

Pinned upstream: HeroUI `3.2.7`, commit `89cd95ec1` (`v3.2.6-53-g89cd95ec1`).

Rules:

- **Never modify** `../heroui` or `../nuxtui`.
- Never copy React implementation code verbatim into Sail UI. Copy the **contract**: class names, variants, `data-slot`, `data-*` states, ARIA semantics, and copy text only where licensing allows (see [NOTICE](./NOTICE)).
- The local Nuxt UI clone may be incomplete or broken (`HEAD` invalid). Do not depend on it until it is re-cloned; use npm package sources or official docs instead.
- When upstream and this file disagree, upstream behavior is the contract, but our **API shape** is defined by the spec/ADRs.

## 4. Technology baseline

Exact versions are pinned in the lockfile once T01 lands. The target baseline:

| Technology              | Target             | Notes                                                   |
| ----------------------- | ------------------ | ------------------------------------------------------- |
| Node.js                 | 22.22.x / 24.15.x  | Match HeroUI's engine range                             |
| pnpm                    | 10.x               | Workspace + `catalog:` versions if useful               |
| Vue                     | 3.5.x              | `useId` for SSR-stable ids; Reka requires >= 3.4        |
| TypeScript              | 5.9.x              | `strict`                                                |
| Tailwind CSS            | 4.3.3              | Same as upstream                                        |
| tailwind-variants       | 3.3.1              | `tv()`; keep `twMerge: false` like upstream             |
| Reka UI                 | 2.11.0             | Pin exactly; attribute behavior is part of the contract |
| @internationalized/date | 3.12.4             | Date/calendar components                                |
| @tanstack/vue-table     | 8.x                | Table behavior; resolve exact at T08                    |
| @tanstack/vue-virtual   | 3.x                | Collection virtualization                               |
| Vitest                  | latest compatible  | jsdom + browser projects                                |
| Storybook               | latest `vue3-vite` | Component workshop                                      |
| Nuxt                    | 4.x                | Docs site, module, SSR fixtures                         |
| Nuxt Content            | 3.x                | Docs site                                               |

Do not upgrade Reka UI, Tailwind CSS, or tailwind-variants in a feature PR. Upgrades are separate tickets with contract/visual re-runs.

## 5. Repository layout (target)

```
sail-ui/
├── apps/
│   ├── docs/                 # Nuxt docs site + live Vue demos
│   └── playground/           # Vite + Nuxt fixtures, visual harness
├── packages/
│   ├── primitives/           # useHover / usePress / useFocusRing / useOverlayState
│   ├── styles/               # upstream CSS (verbatim) + compat.css (generated)
│   ├── vue/                  # components, variants re-export, subpath exports
│   ├── nuxt/                 # Nuxt module
│   └── testing/              # contract / SSR / visual helpers
├── docs/                     # spec, tickets, ADRs, matrices
├── AGENTS.md
├── GLOSSARY.md
├── NOTICE
└── pnpm-workspace.yaml · turbo.json
```

Every component lives at `packages/vue/src/components/<name>/`:

```
button/
├── button.vue                # implementation
├── index.ts                  # named exports + compound object + variant re-export
└── __tests__/                # jsdom, SSR, browser, contract
```

## 6. Target command surface

These commands are implemented. T01 wired the scaffold; T02 added the contract gates. Do not lower a threshold or delete a test to make a gate green.

| Action                | Command                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| Install               | `pnpm install`                                                            |
| Build libraries       | `pnpm build`                                                              |
| Dev playground        | `pnpm dev`                                                                |
| Dev Nuxt fixture      | `pnpm dev:nuxt`                                                           |
| Dev docs              | `pnpm dev:docs`                                                           |
| Lint / typecheck      | `pnpm lint` · `pnpm typecheck`                                            |
| Format check          | `pnpm format:check`                                                       |
| Unit tests (jsdom)    | `pnpm test`                                                               |
| SSR smoke             | `pnpm test:ssr`                                                           |
| Browser tests         | `pnpm test:browser`                                                       |
| Contract tests        | `pnpm test:contract`                                                      |
| Visual regression     | `pnpm test:visual`                                                        |
| Full gate             | `pnpm verify` (format + lint + typecheck + contract + unit + SSR + build) |
| Regenerate compat CSS | `pnpm gen:compat`                                                         |
| Sync upstream styles  | `pnpm sync:styles`                                                        |
| Scaffold component    | `pnpm add:component <Name>`                                               |
| Pack dry-run          | `pnpm pack:check`                                                         |

If a command fails, read the error and fix the cause. Never lower a threshold or delete a test to make a gate green.

## 7. Agent workflow for non-trivial work

The project follows the **grill -> spec -> tickets -> TDD -> review** loop:

1. **Grill before designing.** For a new feature, scope change, or ambiguous bug, list the decisions that must be made. Ask only questions whose prerequisites are settled; include a recommended answer. Output goes into the spec or an ADR.
2. **Spec before tickets.** Update the spec. `Out of Scope` is mandatory; a spec without it is not reviewable.
3. **Tickets are vertical slices.** Each ticket crosses styles, component, tests, and docs, and is independently demoable. Mark `Blocked by` and `Unblocks`. Do not create horizontal "schema -> DAO -> API -> UI" tickets.
4. **Implement one ticket at a time.** Write the acceptance checks first, then red-green-refactor at the seams agreed in the ticket. Keep unrelated refactors out.
5. **Review before delivery.** Run the full gate. Review against both the ticket and this file. If a milestone ends, run a retro and write durable conclusions back into AGENTS.md, an ADR, or a test.
6. **Small fixes** (typo, docs, a one-line bug) may skip to implement + review, but still run the relevant gate.

Rules that prevent the common failures:

- Do not start coding from a one-line idea. Grill it first.
- Do not use framework APIs from memory. Read the installed types/source in `node_modules` or the pinned upstream source.
- Do not "fix" a visual mismatch by editing upstream CSS. Fix the DOM contract or the compat alias.
- Do not let AI-generated volume bypass the contract tests. Volume is not quality.

## 8. Hard rules

### 8.1 Styles

- `packages/styles/upstream/**` is **verbatim** upstream CSS and must never be edited.
- All compatibility changes live in **generated** `compat.css`. Never hand-edit it; change `scripts/gen-compat.mjs` and regenerate.
- Adding a selector alias must append to the selector list; do not change an existing selector's specificity.
- Record the upstream version, commit, and CSS file hashes in a manifest. `pnpm sync:styles` verifies before copying.
- Do not rewrite BEM class names. Upstream BEM classes are the public styling contract.
- Never construct Tailwind class names dynamically (`text-${color}`). Use complete mappings.
- Reuse upstream `tv()` variant maps. Component-local `tv()` is only allowed when upstream has no variant module, and must follow the same naming convention.
- Keep `twMerge: false` for parity. Class merging is concatenation, not conflict resolution.

### 8.2 DOM contract

- Every component and part must emit the exact upstream `data-slot` value (334 unique values in React source at the pinned commit; the earlier JSX-only count of 332 missed two object-key slots).
- Interaction states must use the upstream attribute names and values, e.g. `data-hovered="true"`, `data-selected="true"`, `data-focus-visible="true"`, `data-open="true"`, `data-entering`, `data-exiting`.
- Prefer omitting the attribute over emitting `"false"` when upstream CSS selects on presence or `="true"`.
- `data-placement` is HeroUI's own modal/drawer placement (`auto|top|center|bottom|left|right`), not Floating UI's `data-side`.
- If Reka emits a different vocabulary (`data-state="open"`, `data-outside-view`), add an alias in `compat.css` or normalize in the component. Do not change upstream CSS.
- Run `pnpm test:contract` after any change to attributes, slots, or compat aliases.

### 8.3 Vue implementation

- Use `<script setup lang="ts">` and SFCs. No JSX, no React compatibility runtime.
- Set `inheritAttrs: false` when class/style/attrs need to be routed to an inner primitive; merge with `cn()` and `v-bind="$attrs"` exactly once.
- **Compound API**: named exports are the primary template API (`CardHeader`, `SelectTrigger`). Also export a compound object (`Card`, `Select`) for `<component :is="Select.Trigger" />` and programmatic access. Static `<Select.Trigger>` tags do **not** resolve from a script-setup object; see [ADR 0004](./docs/decisions/0004-compound-component-api.md).
- Use `provide`/`inject` with `InjectionKey<T>` instead of module-level mutable state.
- Do not use module-level singletons for per-request state (toast queues, ids, registries). Toast managers are created per app/request.
- Use Vue 3.5 `useId()` (or Reka's `ConfigProvider` `useId`) for SSR-stable ids.
- Guard browser APIs with `isClient` / `onMounted` / `onBeforeMount`. Never read `window` during setup in SSR.
- Portals/teleports render only after the overlay is open (`v-if`), so the server does not emit overlay DOM.
- Delete React-only concepts: `"use client"`, `forwardRef`, render props as functions in `class`, `useSyncExternalStore`, `createContext`.
- Prop names stay close to upstream (`isDisabled`, `isIconOnly`, `isRequired`, `isInvalid`) for migration parity. Vue-idiomatic `v-model` / `v-model:open` replace controlled `value`/`isOpen` pairs. Do not add dual aliases unless an ADR accepts them.
- Do not `extends` an imported type in a props interface: the SFC compiler cannot resolve it and fails the build. Declare the props explicitly, or use an indexed access (`ButtonVariants["variant"]`).
- Merge the fallthrough attributes with `useForwardedAttrs()` from `packages/vue/src/shared/attrs.ts`. It drops `class` before forwarding, because `v-bind="$attrs"` plus `:class` renders the consumer class twice.
- Some upstream CSS selects on the `slot` attribute (`:has([slot="increment"])`, `:has([slot="clear"])`). The literal attribute is deprecated in Vue templates, so bind it: `v-bind="{...forwarded, slot: 'increment'}"`. Two `v-bind` attributes on one element are a parse error.

### 8.4 Naming

- Component files and tags: `Button`, `CardHeader`, `SelectTrigger` (PascalCase).
- Compound objects: `Card`, `Select` (the root component object, with `.Root` alias).
- Variants: `buttonVariants`, `ButtonVariants` (re-exported from `@sail-ui/styles`).
- CSS: upstream BEM (`button`, `card__header`, `button--primary`).
- Slots: upstream `data-slot` values (`card`, `card-header`, `select-trigger`).
- Display names: `SailUI.Button`, `SailUI.Select.Trigger` via `defineOptions({ name })` where useful for devtools.

### 8.5 SSR and Nuxt

- No hydration mismatch: server and client must render the same attributes and text for closed overlays, ids, and theme class.
- Toast queue and any per-request registry live in `defineNuxtPlugin` (one per request) or an app-level provider, never module scope.
- Theme (`dark` / `data-theme`) is applied on `<html>`; do not wrap the app in a provider just for theming.
- `@sail-ui/nuxt` must work with prefix `S` by default and allow `prefix: ""`.
- The Nuxt module wires Tailwind v4 (`@tailwindcss/vite`), injects the styles entry, and auto-imports components + `useToast`.
- If Reka's Nuxt module is used internally, configure its prefix to avoid collisions; do not expose Reka components as public API by accident.

## 9. Component implementation recipe

For each component:

1. Read the upstream React component, its `*.styles.ts`, its CSS file, and its docs/demos. Extract:
   - public parts and `data-slot` values;
   - props and defaults;
   - variant/size maps;
   - `data-*` states the CSS selects on;
   - ARIA roles and keyboard behavior.
2. Map behavior to Reka primitives. If Reka lacks the primitive, record the gap and implement the smallest composable/state machine.
3. Create the SFC with:
   - `data-slot` on every part;
   - `tv()` slots from `@sail-ui/styles`;
   - `v-bind="$attrs"` and class merge;
   - controlled + uncontrolled state (`v-model` and `default*`);
   - SSR guards.
4. Create `index.ts` with named exports, the compound object, prop types, and variant re-export.
5. Add the subpath export and barrel export.
6. Add tests: jsdom behavior, SSR smoke when risk-based, browser tests for geometry/pointer/portal risk, contract snapshot.
7. Add a docs demo and a migration note if the API differs.
8. Run `pnpm verify` and attach the visual comparison to the ticket.

Do not ship a component with only a render test. "Renders without crashing" is not acceptance.

## 10. Testing rules

### Layers

| Layer         | Tool                                           | Required when                                                                   |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| Unit/behavior | Vitest + `@vue/test-utils` (jsdom)             | Every component: roles, names, callbacks, focus, state attributes               |
| Contract      | SSR render + CSS/data-slot snapshot            | Every component; gate for aliases and slots                                     |
| SSR           | `@vue/server-renderer` / Nuxt fixture          | Exported components that render server-side, generate ids, or read browser APIs |
| Browser       | Vitest browser mode / Playwright               | Layout/measurement, pointer capture, portals/focus traps, real animations       |
| Visual        | Playwright screenshots + `pixelmatch`          | Every component in the acceptance matrix; states x themes                       |
| A11y          | axe-core (browser) + manual keyboard checklist | Overlays, collections, forms; no critical/serious violations                    |

### Conventions

- Query by role/label/text first; `data-testid` only when no accessible query exists. Never query by utility classes.
- Assert roles, accessible names, callbacks, focus, and documented `data-*`/`data-slot` hooks — not full class lists or colors.
- Test both controlled and uncontrolled modes where supported.
- Fake timers per suite, not globally; flush animation frames and promises deliberately.
- SSR tests assert the expected `data-slot`/attributes and the absence of closed overlays.
- Browser tests are risk-based, not universal. jsdom geometry is always zero, so do not fake it to satisfy coverage.
- Coverage is a ratchet, never a target and never the only gate. Raise floors when coverage improves; never lower them to pass.

## 11. Documentation rules

- Every public component needs: a demo, a props/events/slots table, and notes for React -> Vue differences.
- Code examples must be valid SFCs using the named-export API. Do not use static `<Card.Header>` tags in docs.
- Docs use the same component version as the code; do not document unmerged APIs.
- Keep `docs/component-matrix.md` status in sync when a ticket lands.
- Record non-obvious decisions in an ADR, not only in a ticket or PR description.
- Update `AGENTS.md` when a retro produces a rule that should survive the next session.

## 12. Git and reviews

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(button): add button`, `fix(select): emit data-open`, `docs(spec): ...`.
- Allowed types: `feat`, `fix`, `refactor`, `style`, `docs`, `build`, `test`, `ci`, `chore`, `revert`.
- A PR must state: ticket ID, what is demoable, which gates ran, and any parity gaps.
- Do not mix upstream sync, dependency upgrades, and feature work in one PR.
- Do not commit generated artifacts that can be reproduced (compat CSS is an exception: commit it for review and publish it).

## 13. Current inventory and gotchas

- Public component inventory: `docs/component-matrix.md`. Source of truth for the upstream contract: `../heroui/packages/react/src/components/index.ts` and `../heroui/packages/styles/components/index.css`.
- `calendar-year-picker` is in progress upstream; parity is best-effort until upstream stabilizes.
- `color-input-group` and `date-input-group` are internal composites in upstream (not exported); they still have styles and may need internal Vue implementations.
- Upstream `tv()` disables `twMerge`; do not "improve" class merging.
- The upstream overlay exit logic waits for the real CSS animation (including WebKit's pending state) and pins opacity before unmount. Do not replace it with a naive `setTimeout`.
- Upstream modal-level overlays (Modal/AlertDialog/Drawer/Sheet) use `--z-index-overlay: 100000`; toast uses `--z-index-toast: 100001`. Popover/tooltip rely on portal stacking; do not invent a higher layer.
- `@heroui/styles` has zero inline utility classes in components, so Tailwind does not need to scan `node_modules` with `@source`.
- Reka renders `CheckboxRoot`, `RadioGroupItem` and `SwitchRoot` as `<button role="checkbox|radio|switch">`. Upstream HeroUI renders a `<label>` with a visually hidden native input, so the upstream checkbox, radio and switch are self-implemented in Sail UI to keep the DOM contract.
- `useFocusRing` only reports `data-focus-visible` after a keyboard interaction. Browser tests must press a key before focusing an element programmatically, otherwise the attribute is intentionally absent.
- If the Nuxt UI reference clone is broken, re-clone instead of guessing its internals.

## 14. When blocked

Ask a concise question when a decision affects public API, licensing, package names, visual parity, or scope. Do not silently choose a different contract. If the answer is already in the spec/ADRs, follow it and cite the file.
</content>
