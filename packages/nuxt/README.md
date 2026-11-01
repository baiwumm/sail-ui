# @sail-ui/nuxt

Nuxt module for [Sail UI](https://github.com/baiwumm/sail-ui) — the Vue 3 port of the HeroUI v3 CSS and DOM contract.

## Install

```sh
pnpm add @sail-ui/nuxt
```

## Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@sail-ui/nuxt"],
});
```

That is the whole setup. The module:

- auto-imports every Sail UI component with the `S` prefix (`<SButton>`, `<SSelectTrigger>`, …);
- injects the `@sail-ui/styles/css` entry (theme + components);
- wires Tailwind CSS v4 through `@tailwindcss/vite`;
- auto-imports `useToast()`;
- wraps the app with `SailUIProvider` (Reka `ConfigProvider` defaults + the toast region) so `useToast()` works without touching `app.vue`.

### Options

```ts
export default defineNuxtConfig({
  modules: ["@sail-ui/nuxt"],
  sailUI: {
    // Component prefix. Use "" to register bare export names.
    prefix: "S",
    // Inject the styles entry. Default: true.
    styles: true,
    // Wire Tailwind v4. Default: true.
    tailwind: true,
    // Wrap the app root with SailUIProvider. Default: true.
    wrapApp: true,
    // Passed to the Reka config layer.
    locale: "en",
    dir: "ltr",
  },
});
```

## License

Apache-2.0 — see the root [NOTICE](../../NOTICE) for upstream attribution.
