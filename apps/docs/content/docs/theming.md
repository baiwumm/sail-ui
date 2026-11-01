---
title: Theming
description: Light, dark and system themes with the upstream CSS variables.
---

# Theming

Sail UI reuses the HeroUI v3 theme system. There is no theme provider to wrap:
themes are driven by attributes on `<html>`.

## Modes

- `light` — default.
- `dark` — add the `dark` class to `<html>`.
- `system` — resolve the OS preference yourself and toggle the class.

```ts
const applyTheme = (resolved: "light" | "dark") => {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = resolved;
};
```

The docs site ships this exact logic in its theme switcher; the playground and
reference app exercise both modes in the visual matrix.

## Customizing

Colors, radii and spacing are CSS variables (`--background`, `--foreground`,
`--primary`, …) defined per mode by the upstream base CSS. Override them on
`:root` / `html.dark` in your own stylesheet — never edit the upstream package
sources; `@sail-ui/styles` regenerates its compat layer from the upstream
snapshot.

## Component variants

Variants are plain BEM classes produced by `tailwind-variants` maps
(`button--primary`, `card__header`, …). Because `twMerge` is disabled for
parity, class lists concatenate — compose them explicitly rather than
overriding.
