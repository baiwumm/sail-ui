---
title: Migration from HeroUI
description: Mechanical mapping from HeroUI v3 React to Sail UI Vue.
---

# Migration from HeroUI React

The full mapping lives in the repository's
[migration guide](https://github.com/baiwumm/sail-ui/blob/main/docs/migration-from-heroui.md);
the highlights below cover most components.

## Imports and composition

| HeroUI React                           | Sail UI Vue                                  |
| -------------------------------------- | -------------------------------------------- |
| `import {Button} from "@heroui/react"` | `import {Button} from "@sail-ui/vue/button"` |
| `<Select.Trigger>`                     | `<SelectTrigger>` (named exports)            |
| `isOpen` / `onOpenChange`              | `v-model:open`                               |
| `selectedKey` / `onSelectionChange`    | `v-model` + `@selection-change`              |
| `onPress`                              | `@press`                                     |
| `className` function                   | scoped slot with state props                 |

## Props keep upstream names

State adjectives stay the same (`isDisabled`, `isInvalid`, `isRequired`,
`isLoading`, `isIconOnly`). Do not reach for `disabled` — it does not exist as
an alias.

## Controlled and uncontrolled

Every component supports both. Controlled uses `v-model` (+ `v-model:open` for
overlays); uncontrolled uses `default*` props (`defaultOpen`,
`defaultSelectedKey`).

## Known differences

The migration guide's section 9 lists every accepted difference (composite
tags, `Table` data-driven API, toast queue ownership, SSR select labels, …).
Skim it once before porting a codebase.
