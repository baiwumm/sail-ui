# @sail-ui/styles

Verbatim fork of the HeroUI v3 styles plus a generated `compat.css` layer that maps Vue/Reka attribute vocabulary onto the upstream selectors.

The CSS targets the DOM contract documented in [the repository](https://github.com/baiwumm/sail-ui#readme) — use it with `@sail-ui/vue` (or the `@sail-ui/nuxt` module), not standalone.

## Install

```sh
pnpm add @sail-ui/styles
```

## Usage

Import the entry once, after Tailwind v4 is wired:

```ts
import "@sail-ui/styles/css";
```

`tailwind-variants` maps are re-exported for programmatic use (`buttonVariants`, `ButtonVariants`, …).

## License

Apache-2.0 — see the root [NOTICE](../../NOTICE) for upstream attribution.
