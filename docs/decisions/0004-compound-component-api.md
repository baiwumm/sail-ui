# ADR 0004: 复合组件 API

- Status: Accepted
- Date: 2026-10-30
- Related: [Spec §5.6](../spec/0001-heroui-v3-vue-port.spec.md), [上游审计 §4](../research/heroui-v3-audit.md), [迁移指南](../migration-from-heroui.md)

## Context

HeroUI React 用复合组件：

```tsx
<Select>
  <Select.Trigger>...</Select.Trigger>
  <Select.Popover>...</Select.Popover>
</Select>
```

计划稿假设 Vue 也可以用：

```vue
<Select.Root>
  <Select.Trigger />
</Select.Root>
```

并用 `Object.assign(Root, { Trigger, ... })` 导出。实测 `@vue/compiler-sfc` 3.x 后，这个假设不成立：

```js
// 编译输出
const _component_Select46Root = _resolveComponent("Select.Root");
const _component_Select46Trigger = _resolveComponent("Select.Trigger");
```

模板把 `Select.Root` 当作**字符串组件名**解析。`<script setup>` 里 `import { Select }` 不会让 `<Select.Root>` 自动可用；除非全局/局部注册了名为 `Select.Root` 的组件，否则运行时会解析失败。

## Decision

Vue 端采用双出口：

1. **命名导出是模板主 API**

```vue
<script setup lang="ts">
import { Select, SelectTrigger, SelectValue, SelectPopover } from "@sail-ui/vue";
</script>

<template>
  <Select v-model="value">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectPopover>...</SelectPopover>
  </Select>
</template>
```

2. **同时导出复合对象，用于动态/程序化场景**

```ts
import { Select } from "@sail-ui/vue";

Select.Root;    // === SelectRoot
Select.Trigger; // === SelectTrigger
```

```vue
<component :is="Select.Trigger">...</component>
```

3. **不默认支持静态 `<Select.Trigger>`**。如果用户确实需要，可自行全局注册 `app.component("Select.Trigger", SelectTrigger)`；Nuxt module 不默认注册带点名字，避免污染全局命名空间和 auto-import 冲突。

4. **类型同时导出**：`SelectProps`、`SelectTriggerProps`，以及 `SelectParts` 对象类型。

5. **文档与迁移指南一律使用命名导出**；禁止在示例里写 `<Card.Header>`。

## Consequences

正面：

- 符合 Vue SFC 的解析规则，SSR/auto-import/类型推导都稳定。
- 子路径导入（`@sail-ui/vue/select`）可以只引入需要的 part，Tree-shaking 明确。
- 复合对象仍保留，React 用户的心智模型和程序化访问不受影响。

负面：

- 与 HeroUI 文档的 `<Select.Trigger>` 写法不完全一致，迁移时需要机械替换（见迁移表）。
- 每个组件需要维护“命名导出 + 对象属性”两份导出，index.ts 略长。
- Nuxt auto-import 名称可能较长（`SelectTrigger`），需用前缀 `S` 避免与业务组件冲突。

## Alternatives considered

- **只导出复合对象**：模板不可用，排除。
- **默认全局注册 `<Select.Trigger>`**：可行但污染全局，且与 Nuxt auto-import 冲突，排除。
- **提供 Vite 插件改写模板**：把 `<Select.Trigger>` 编译成 `Select.Trigger`，工程复杂度高，暂不做。
- **只导出命名 part**：程序化访问和 `:is` 场景不便，且失去与 React 的对应关系，不采用。

## Verification

M0（[Ticket 01](../spec/tickets/01-m0-foundation-spike.md)）必须包含：

- `<SelectTrigger>` 在 `<script setup>` 中正常解析；
- `<component :is="Select.Trigger" />` 正常渲染；
- 对静态 `<Select.Trigger>` 输出明确文档警告（不在库内做运行时兜底）。
</content>
