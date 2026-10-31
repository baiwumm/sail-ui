# ADR 0009: Tabs 行为层——Reka 集合状态 + 自渲染 tab / panel / indicator

- Status: Accepted
- Date: 2026-10-31
- Related: [T06](../spec/tickets/06-collections-and-pickers.md), [ADR 0002](./0002-behavior-layer-reka-ui.md), [ADR 0007](./0007-component-api-conventions.md), 上游 HeroUI `89cd95ec1`

## Context

上游 HeroUI Tabs 基于 React Aria Components：

- `Tab` 渲染为 `<div role="tab">`，带 `data-selected` / `data-disabled` / `data-hovered` / `data-pressed` / `data-focused` / `data-focus-visible`，id 由 `useId` 生成，`aria-controls` 指向面板；
- `TabPanel` 默认只在选中时挂载，`shouldForceMount` 时保留 DOM 并设置 `inert` / `data-inert`；
- `SelectionIndicator` 位于**每个 Tab 内部**，切换时用 FLIP（translate/width/height）从旧位置过渡到新位置，首个客户端帧前 `data-animation-ready="false"`；
- `TabListContainer` 内嵌 ScrollShadow 滚动容器，滚动标志（`data-left/right-scroll` 等）决定两侧 chevron 的显隐；
- 公共 API 使用 `id` / `selectedKey` / `defaultSelectedKey`。

Reka UI 2.11.0 的 `Tabs` 原语提供集合状态、roving focus 与自动/手动激活，但 DOM 词汇与上游不同：

- `TabsTrigger` 默认渲染 `<button>`，并通过 asChild 合并注入 `type`、`disabled`、自己的 `id` / `aria-controls` 与 `data-state`；
- `TabsContent` 在未选中时卸载消费者传入的元素（该元素即 slot 内容本身，asChild 无法保留外层 div），也没有 `data-entering` / `data-exiting`；
- `TabsIndicator` 是列表内的单个元素，用 CSS 变量定位，要求特定的 DOM 结构，与上游“每个 Tab 内一个 indicator”的契约不符。

## Decision

1. **根节点**使用 Reka `TabsRoot` 管理集合状态与方向键；选择状态为 `v-model` + `defaultSelectedKey`，额外发出 `selection-change`（ADR 0007）。
2. **Tab** 用 `TabsTrigger asChild` 包裹消费者可见的 `<div role="tab">`；在 div 上覆盖 `useId` 生成的 `id` 与 `aria-controls`，不使用 Reka 的 collection id。通过子元素属性覆盖 Reka 注入的 `type` / `disabled`，让 DOM 与上游 RAC 的 `div` 一致。
3. **Panel** 用 `TabsContent asChild` 包裹 div，沿用 Reka 的挂载语义：默认只挂载选中面板；`forceMount` 时保留并设置 `inert` / `data-inert`。面板同时清空 Reka 注入的 `data-orientation` / `data-state`：上游面板没有这两个属性，且 `.tabs__panel[data-orientation="horizontal"]` 会误触 `margin-top`。
4. **TabIndicator** 自渲染（`tabs__indicator`），只在选中的 Tab 内渲染；切换时在 `flush: "pre"` 读取旧 indicator 的 rect 作为 FLIP 快照，新 indicator 挂载后测量自身 rect 并写入内联 `width` / `height` / `translate`，下一帧清除。`data-animation-ready` 在首个客户端帧后变为 `"true"`。
5. **TabListContainer** 直接渲染上游 ScrollShadow 的滚动容器（`scrollShadowVariants` + `data-*` 标志）与两个 chevron 按钮；ScrollShadow 在 T06 仍是内部实现，公共 `ScrollShadow` 组件留在 M3（ADR 0005）。
6. **不使用** Reka 的 `TabsIndicator`；**不发出** RAC 的 `data-entering` / `data-exiting`（见后果）。

## Consequences

正面：

- DOM 与上游一致：`div role="tab"`、无按钮专属属性、id 可预测且 SSR 稳定；
- indicator 与滚动标志只依赖本项目自己的 DOM，升级 Reka 时影响面小；
- 面板挂载语义与 RAC 默认一致（未选中不渲染），`forceMount` 时用 `inert` 保持可访问性。

负面：

- 面板没有进入/退出动画，上游 `.tabs__panel[data-exiting="true"]` 的 CSS 在 v1 不会生效；如需补齐，应作为独立 ticket 实现动画层；
- 依赖 Reka asChild 的合并顺序（子元素属性优先）；升级 Reka 时必须复核 `TabsTrigger` / `TabsContent` 的注入属性；
- 公共 API 以 `value` 标识 Tab（Reka 风格），上游以 `id` 标识，迁移文档需要逐条映射。

## Alternatives considered

- **直接使用 Reka 的 id 与 `TabsIndicator`**：DOM 词汇（button、`data-state`、CSS 变量 indicator）与上游契约不一致，且 indicator 不是 per-tab 结构，排除。
- **完全自研 Tabs（选择状态 + roving focus）**：重复 Reka 已稳定的键盘/集合逻辑，违背 ADR 0002，排除。
- **未选中面板也常驻并 hidden**：与 RAC 默认（卸载）不一致，DOM 膨胀，且 `aria-controls` 目标本就不要求常驻；不采用。
