# Contributing to Sail UI

Thanks for helping port HeroUI v3 to Vue. Sail UI is an unofficial community project; it is not affiliated with HeroUI.

> **Phase note:** the repository is at the specification stage. The most useful contribution right now is review of the [spec](./docs/spec/0001-heroui-v3-vue-port.spec.md), [tickets](./docs/spec/tickets/README.md), and [ADRs](./docs/decisions/README.md). Implementation starts with [T01](./docs/spec/tickets/01-m0-foundation-spike.md).

## Before you code

1. Read [AGENTS.md](./AGENTS.md), [GLOSSARY.md](./GLOSSARY.md), and the active ticket.
2. Check the [component matrix](./docs/component-matrix.md) for the component's milestone and status.
3. For anything beyond a small fix, open the discussion first:
   - What decision does this change?
   - Which acceptance checks prove it?
   - What is explicitly out of scope?
4. If the change alters public API, add or update an ADR in `docs/decisions/`.

## Development setup (after T01)

```bash
pnpm install
pnpm dev          # playground
pnpm dev:docs     # docs site
pnpm verify       # lint + typecheck + contract + unit + SSR + build
```

Do not run commands from the target command surface until the scaffold exists; see [AGENTS.md section 6](./AGENTS.md#6-target-command-surface).

## Pull requests

A PR should be small enough to review against one ticket. Include:

- ticket ID and a one-line demo description;
- gates that ran (`pnpm verify`, visual, browser);
- parity gaps or intentional deviations;
- screenshots for visual changes.

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(button): port button with hover and press states
fix(select): emit data-open on the trigger
docs(spec): clarify toast SSR ownership
```

Allowed types: `feat`, `fix`, `refactor`, `style`, `docs`, `build`, `test`, `ci`, `chore`, `revert`.

## Code standards

- Vue SFCs with `<script setup lang="ts">`. No JSX, no React compatibility layer.
- Keep upstream class names, `data-slot`, and `data-*` attributes exactly.
- Never edit `packages/styles/upstream/**` or hand-edit `compat.css`.
- Use `tv()` variants from `@sail-ui/styles`; do not reimplement variant maps.
- Query and assert by role/name/state, not by utility classes.
- Add an SSR test when a component generates ids, reads browser APIs, or renders overlays.
- Add a browser test when correctness depends on layout, pointer capture, focus trapping, or animation.
- Docs examples use named exports, not static `<Card.Header>` tags.

## Visual parity

Visual changes must be compared against the pinned HeroUI version for the states listed in the [acceptance matrix](./docs/acceptance-matrix.md). If a difference is intentional, record it in the ticket and the ADR.

## Upstream sync

Upstream style sync and dependency upgrades are separate PRs, never mixed with feature work. Follow the procedure in [ADR 0003](./docs/decisions/0003-style-fork-and-compat-layer.md).

## Licensing

By contributing, you agree that your contribution is licensed under Apache-2.0. Do not copy code or assets that are not compatible with this license. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Questions

Open an issue with the `question` or `grilling` label. If the question affects scope, API, or visual parity, it belongs in the spec discussion before implementation.
</content>
