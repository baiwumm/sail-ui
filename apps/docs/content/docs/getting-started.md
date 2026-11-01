---
title: Installation
description: Set up Sail UI in a Vite or Nuxt app.
---

# Installation

Sail UI ships as five packages. You normally need two of them:

| Package               | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `@sail-ui/vue`        | The 84 Vue components (subpath exports per component).    |
| `@sail-ui/styles`     | The HeroUI v3 CSS contract plus a generated compat layer. |
| `@sail-ui/nuxt`       | Nuxt module: auto-imports, styles, Tailwind, providers.   |
| `@sail-ui/primitives` | Interaction composables for custom components.            |

## Nuxt

```bash
pnpm add @sail-ui/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@sail-ui/nuxt"],
});
```

The module wires everything: component auto-imports with the `S` prefix
(`<SButton>`), the styles entry, Tailwind v4, `useToast()` and the app-level
provider. Options such as `prefix: ""` or an explicit `locale`/`dir` are
described in the module README.

## Vite

```bash
pnpm add @sail-ui/vue @sail-ui/styles tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
});
```

Import the styles entry once, after Tailwind:

```ts
// main.ts
import "@sail-ui/styles/css";
```

Then use the named-export API:

```vue
<script setup lang="ts">
import {Button} from "@sail-ui/vue/button";
</script>

<template>
  <Button variant="primary" @press="save">Save</Button>
</template>
```

## Requirements

- Vue 3.5+ / Nuxt 4
- Tailwind CSS 4.3 and `tailwind-variants` 3.3 (pinned by the packages)
- Node 22.22+

::demo-button
---

label: It works
---

::
