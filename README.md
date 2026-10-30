# Sail UI

> Unofficial Vue 3 / Nuxt port of the [HeroUI v3](https://heroui.com) design system.
> Component styles are reused from `@heroui/styles` (Apache-2.0, Copyright HeroUI) — see [NOTICE](./NOTICE).
> Not affiliated with or endorsed by HeroUI.

[![status](https://img.shields.io/badge/status-specification-orange)](./docs/README.md)
[![vue](https://img.shields.io/badge/vue-3.5+-42b883)](https://vuejs.org)
[![nuxt](https://img.shields.io/badge/nuxt-4+-00DC82)](https://nuxt.com)
[![tailwindcss](https://img.shields.io/badge/tailwindcss-4.3-38BDF8)](https://tailwindcss.com)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE)

Sail UI keeps HeroUI's **styles and DOM contract** intact, and replaces the React behavior layer with Vue-native primitives ([Reka UI](https://reka-ui.com)) plus a thin compatibility layer. The goal is pixel parity, not a visual redesign.

> **Status — specification stage (2026-10-30).** No packages are published yet and the repository does not contain runnable library code. This README describes the intended public API; the first runnable slice is [ticket 01](./docs/spec/tickets/01-m0-foundation-spike.md). Track progress in [docs/roadmap.md](./docs/roadmap.md).

---

## Why Sail UI

- **Same CSS, same look.** `@sail-ui/styles` is a verbatim fork of `@heroui/styles`; we neither rewrite nor hand-edit the 9,959 lines of component CSS. Upstream style fixes flow down when we re-sync.
- **Vue-native behavior.** Keyboard, focus, selection, and overlay behavior come from Reka UI 2.x, not a React compatibility runtime.
- **SSR-first.** Single-request state, stable ids, and portal rules that work in Nuxt and Vite SSR.
- **Nuxt module.** Auto-imports, prefix support, Tailwind v4 wiring, and theme integration.
- **Migration path.** HeroUI React examples map to Vue components, props, events, and slots through a documented translation table.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ apps/playground · apps/docs                                  │
├──────────────────────────────────────────────────────────────┤
│ @sail-ui/nuxt        Nuxt module (auto-import, CSS, SSR)     │
├──────────────────────────────────────────────────────────────┤
│ @sail-ui/vue         Vue SFC components + tv() variants      │
│                      (Reka UI behavior + data-* contract)    │
├──────────────────────────────────────────────────────────────┤
│ @sail-ui/primitives  useHover / usePress / useFocusRing /    │
│                      useOverlayState (+ exit hold)           │
├──────────────────────────────────────────────────────────────┤
│ @sail-ui/styles      upstream CSS (verbatim) + compat.css    │
│                      (generated, never hand-edited)          │
└──────────────────────────────────────────────────────────────┘
```

Read the full design in the [spec](./docs/spec/0001-heroui-v3-vue-port.spec.md) and [decision records](./docs/decisions/README.md).

## Packages

| Package               | Purpose                                                   | Status  |
| --------------------- | --------------------------------------------------------- | ------- |
| `@sail-ui/vue`        | Vue 3 components, subpath exports (`@sail-ui/vue/button`) | Planned |
| `@sail-ui/styles`     | HeroUI CSS fork + generated `compat.css`                  | Planned |
| `@sail-ui/primitives` | Shared composables for DOM-contract states                | Planned |
| `@sail-ui/nuxt`       | Nuxt 4 module                                             | Planned |
| `@sail-ui/testing`    | Contract checks, SSR smoke, visual-test helpers           | Planned |

Package names are not yet published on npm. Do not install these names until a release is announced.

## Quick start (intended API)

```bash
pnpm add @sail-ui/vue @sail-ui/styles
```

```css
/* app.css */
@import "tailwindcss";
@import "@sail-ui/styles";
```

```vue
<script setup lang="ts">
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sail-ui/vue";

const open = () => {
  // ...
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Sail with HeroUI styles</CardTitle>
      <CardDescription>The CSS and DOM contract stay identical.</CardDescription>
    </CardHeader>
    <CardContent> Vue 3 components, Reka UI behavior, Tailwind CSS v4. </CardContent>
    <CardFooter>
      <Button @press="open">Get started</Button>
    </CardFooter>
  </Card>
</template>
```

Nuxt:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@sail-ui/nuxt"],
  sailUI: {
    prefix: "S", // <SButton>, <SCard> — set to "" to disable prefixes
  },
});
```

```vue
<template>
  <SButton variant="primary">Ship it</SButton>
</template>
```

## What “port” means here

1. **CSS is the source of truth.** HeroUI styles select on `data-slot` and interaction attributes such as `data-hovered="true"` and `data-selected="true"`.
2. **We produce the same DOM contract.** Vue components emit the attributes the upstream CSS expects; a generated `compat.css` aliases Reka's attributes where the vocabulary differs.
3. **We do not port React Aria.** Behavior comes from Reka UI, with four small composables filling the gaps; APIs are adapted to Vue idioms where a direct translation is impossible.
4. **Parity is tested.** Contract snapshots, SSR smoke tests, keyboard tests, and visual regression compare against the pinned upstream version.

## Components

Sail UI targets all **84 public HeroUI v3 components** (86 stylesheets including two internal composites). The MVP is 40 components.

- [Component matrix](./docs/component-matrix.md) — component → Reka primitive → milestone → status
- [Acceptance matrix](./docs/acceptance-matrix.md) — what “done” means for every component
- [Roadmap](./docs/roadmap.md) — M0–M4 plan and estimates

## Documentation

| Document                                             | Contents                             |
| ---------------------------------------------------- | ------------------------------------ |
| [docs/README.md](./docs/README.md)                   | Documentation index                  |
| [Spec](./docs/spec/0001-heroui-v3-vue-port.spec.md)  | Scope, decisions, acceptance, risks  |
| [Tickets](./docs/spec/tickets/README.md)             | Vertical slices + blocking edges     |
| [AGENTS.md](./AGENTS.md)                             | Rules for AI agents and contributors |
| [GLOSSARY.md](./GLOSSARY.md)                         | Shared terminology                   |
| [Migration guide](./docs/migration-from-heroui.md)   | HeroUI React → Sail UI Vue           |
| [Upstream audit](./docs/research/heroui-v3-audit.md) | Measured evidence behind the design  |

中文读者可从 [docs/README.md](./docs/README.md) 开始；核心设计与验收文档以中文为主，公开 README 以英文为主。

## Contributing

Read [AGENTS.md](./AGENTS.md) and [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR. Scope changes start with a grilling session and a spec update, not with code.

## License

Original code and documentation are licensed under Apache-2.0. Forked styles retain HeroUI's copyright and license; see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

HeroUI is a trademark of its respective owner. Sail UI is an independent community project.
