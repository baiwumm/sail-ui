# ADR 0007: 组件 API 约定

- Status: Accepted
- Date: 2026-10-30
- Related: [Spec §5.7](../spec/0001-heroui-v3-vue-port.spec.md), [迁移指南](../migration-from-heroui.md)

## Context

HeroUI React 的 API 建立在 RAC 之上：`isDisabled`、`isRequired`、`isInvalid`、`isOpen`、`selectedKey`、`onSelectionChange`、render props、`className` 函数等。Vue 有 `v-model`、`class`、scoped slots、`as`/`asChild`。

如果完全照搬 React API，Vue 用户会觉得别扭；如果完全 Vue 化，迁移映射会变复杂，且容易在组件间出现命名不一致。需要一套明确、可测试的约定。

## Decision

### Props

- **状态形容词保留上游命名**：`isDisabled`、`isRequired`、`isInvalid`、`isReadOnly`、`isLoading`、`isIconOnly`、`isVirtualized`。
- **HTML 原生属性优先使用原生名**：`disabled` 只用于确实映射到原生 `<button disabled>` 的场景；组件级禁用统一 `isDisabled`，避免两套语义。
- **受控/非受控**：
  - 受控：`v-model`（值）、`v-model:open`（开关）、`v-model:expandedKeys`（展开集合）；
  - 非受控：`defaultValue`、`defaultOpen`、`defaultExpandedKeys`、`defaultSelectedKey`；
  - 同时传受控与非受控时，受控优先，开发环境输出一次警告。
- **不要新增 `disabled` / `invalid` 别名**。若未来需要，单独 ADR；v1 不做双 API。
- **`as` / `asChild`**：需要多态渲染的组件沿用 Reka 的约定；不要新增 `render` prop。
- **`class` / `style`**：Vue 原生；不接受函数形式的 `class`。

### Events

| HeroUI React | Sail UI Vue | 说明 |
|---|---|---|
| `onPress` | `@press` | 指针 + 键盘激活的统一事件，payload `PressEvent` |
| `onClick` | `@click` | 原生点击继续透传 |
| `onSelectionChange` | `@update:model-value` | `v-model` 的标准事件；另发 `@selection-change` 便于语义化监听 |
| `onOpenChange` | `@update:open` | `v-model:open` |
| `onValueChange` | `@update:model-value` | 输入类组件 |
| `onExpandedChange` | `@update:expanded-keys` | Accordion / DisclosureGroup |
| `onSortChange` | `@update:sort-descriptor` | Table |
| `onLoadMore` | `@load-more` | Table |

事件名在模板中可用 kebab-case（`@update:model-value`）或 camelCase（`@update:modelValue`）；**文档统一使用 kebab-case**。事件 payload 一律使用普通对象/原始值，不传 React 合成事件。

### Slots

- React render props → Vue scoped slots，slot props 使用 camelCase：`#default="{ isHovered, isPressed }"`。
- React 的 `children` 函数 → `#default` / 具名 scoped slot；不提供“函数作为 children”的运行时兼容。
- 具名 slot 使用 kebab-case：`#trigger`、`#empty`、`#loading`。
- 默认 slot 不传无意义的空对象；只传上游确实暴露的状态。

### Refs / ids

- `ref` 指向根 DOM 或根组件实例，与 Vue 生态一致。
- `id` 可外部传入；未传时用 `useId()` 生成 SSR 稳定 id。
- 不对内部分 part 暴露 `ref` 数组；需要时提供具名 `xxxRef`。

### Providers

- 不强制主题 Provider。主题通过 `<html>` 的 `dark` / `data-theme` 控制。
- `ConfigProvider` 仅在需要 locale、dir、`useId` 定制时使用；Nuxt module 默认配置一次，不要求用户包裹。
- Toast 需要一个根级 `<ToastProvider />`（viewport + 请求级 manager）。Vue 中手动挂载，Nuxt module 自动挂载；调用侧统一用 `useToast()`，不直接操作 Reka 的 manager。
- 不要求用户包裹表单/主题 Provider；字段上下文按组件树自动提供。

### Types

- 每个组件导出 `XxxProps`、`XxxSlots`、`XxxEmits` 类型。
- 变体类型从 `@sail-ui/styles` 重导出（`ButtonVariants`）。
- 事件 payload 类型导出（`PressEvent`、`Selection` 等），不泄漏 Reka 内部类型。

## Consequences

- API 与上游保持较高的可映射性，迁移文档可以逐条对照。
- Vue 用户需要接受 `isDisabled` 而不是 `disabled`；文档需明确解释。
- 事件同时提供 `update:model-value` 与语义事件，测试需覆盖两者，避免只测一个。
- scoped slot 的 props 命名必须与上游 render props 对齐，否则迁移成本上升。

## Alternatives considered

- **完全 Vue 化（`disabled`、`open`、`value`、`change`）**：更符合 Vue 习惯，但迁移映射和上游文档对照会变复杂，且容易与原生属性冲突；不采用。
- **双 API（`disabled` + `isDisabled`）**：短期友好，长期增加测试矩阵和文档负担；v1 不采用。
- **保留 React 事件名（`onPress`）**：Vue 模板不支持 `@onPress` 的语义，且与 Vue 事件系统冲突；不采用。
</content>
