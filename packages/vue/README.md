# @sail-ui/vue

Vue 3 components that reuse the HeroUI v3 CSS and DOM contract verbatim: the same `data-slot` attributes, variants and BEM classes as upstream, with Vue-native behavior on Reka UI primitives.

## Install

```sh
pnpm add @sail-ui/vue @sail-ui/styles
```

## Usage

Import the styles entry once (Tailwind v4 setup required — see [the docs](https://github.com/baiwumm/sail-ui#readme) or use `@sail-ui/nuxt`):

```ts
import "@sail-ui/styles/css";
```

Then use the named-export API:

```vue
<script setup lang="ts">
import {Select, SelectItem, SelectPopover, SelectTrigger, SelectValue} from "@sail-ui/vue/select";
</script>

<template>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Pick one" />
    </SelectTrigger>
    <SelectPopover>
      <SelectItem value="a">A</SelectItem>
    </SelectPopover>
  </Select>
</template>
```

Every component is also available from a subpath export (`@sail-ui/vue/button`, `@sail-ui/vue/table`, …) for tree-shaking.

## License

Apache-2.0 — see the root [NOTICE](../../NOTICE) for upstream attribution.
