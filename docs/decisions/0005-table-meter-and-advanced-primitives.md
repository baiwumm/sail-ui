# ADR 0005: Table、Meter、ScrollShadow 与组合型组件

- Status: Accepted（T08 已实现，2026-11-01）
- Date: 2026-10-30
- Related: [Ticket 08](../spec/tickets/08-advanced-data.md), [组件矩阵](../component-matrix.md)

## Context

Reka UI 覆盖了大部分 HeroUI 组件，但有四类缺口：

| 组件                                 | 缺口                                                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `Table`                              | Reka 没有 `TableRoot`；HeroUI Table 依赖 RAC 的 Collection、键盘网格导航、列宽调整、虚拟化、LoadMore |
| `Meter`                              | Reka 的 `Progress` 是 `role="progressbar"`；HeroUI Meter 是 `role="meter"`，语义不同                 |
| `ScrollShadow`                       | 没有现成原语；依赖 `scroll`/`ResizeObserver` 计算边缘阴影                                            |
| `ColorInputGroup` / `DateInputGroup` | 上游内部组合组件，不是公共导出，但样式存在                                                           |

不能为了“行为层统一”而削减这些能力；也不能把 RAC 的 Table 直接搬过来。

## Decision

### Table

**`@tanstack/vue-table` 负责数据模型，DOM/ARIA/键盘由我们实现。**

- TanStack 负责：列定义、排序、筛选、分组、列宽、选择状态、分页模型。
- 我们负责：`role="grid"`/`row`/`gridcell`/`columnheader` 语义、二维键盘导航、焦点管理、`data-slot`、`data-*` 状态。
- 虚拟化用 `@tanstack/vue-virtual`，只在 `isVirtualized` 时启用。
- 列宽调整用 pointer events + CSS 变量，不引入第三方 resizer。
- `LoadMore` 由组件暴露 `onLoadMore`，由用户接管数据加载，不做内置请求。
- MVP（M2）只交付：根/滚动容器/内容/表头/列/行/单元格/排序/单选/多选/键盘导航/空状态。
- M3（T08）再交付：列宽调整、虚拟化、LoadMore、粘性表头、行展开（若上游存在）。

### Meter

自研 `role="meter"`：

- 复用 `meterVariants` 与 BEM；
- `aria-valuemin/max/now/valuetext`；
- 支持 `showValueLabel`、`formatOptions`；
- 不伪装成 `progressbar`，不强行复用 Reka Progress。

### ScrollShadow

自研 `useScrollShadow`：

- `ResizeObserver` + `scroll` 监听；
- 计算 `data-top-scroll` / `data-bottom-scroll` / `data-left-scroll` / `data-right-scroll` 等上游属性；
- 支持 `visibility`、`offset`、`size`、`orientation`、`hideScrollBar`；
- 无 JS 时退化为无阴影（不阻塞内容）。

### Color / Date 组合

- 单值输入、滑块、区域、色板等优先用 Reka 的 `Color*` / `Date*` 原语。
- `ColorInputGroup`、`DateInputGroup` 作为内部组合组件实现，不对外导出；公共 `ColorPicker` / `DatePicker` 通过它们拼装。
- 上游 `calendar-year-picker` 仍在开发，按“尽力对齐”标记，等上游稳定后再锁定契约。

## Consequences

正面：

- 不把 Table 塞进 Reka 的抽象，避免为了复用而牺牲 2D 键盘导航、虚拟化和列宽能力。
- Meter 语义正确，屏幕阅读器不会把 meter 读成 progressbar。
- ScrollShadow 可按上游属性精确复刻，而不是靠 CSS mask 猜。

负面：

- Table 是最大的一块自研工作，估计占 T08 的一半以上。
- 键盘网格导航的边界（跨行、跨列、编辑态、选择态、RTL）测试成本高。
- 自研 `role="meter"` 和 ScrollShadow 需要额外的 a11y/浏览器测试。

## Alternatives considered

- **用 Reka Progress 冒充 Meter**：语义错误，排除。
- **移植 RAC Table**：工作量与风险最高，且 Vue 端没有收益，排除。
- **用原生 `<table>`**：无法满足 RAC 的 grid 键盘/虚拟化契约，排除。
- **CSS-only ScrollShadow**：无法感知滚动位置与边缘阈值，排除。

## Implementation notes（T08 落地）

- **数据驱动 Table**：`Table` 只有 `TableRoot` 一个 SFC，接收 `columns` / `data`，不导出 `TableContent`、`TableRow` 等 part。自定义内容走 `#cell-<key>`、`#header-<key>` 插槽。TanStack `getCoreRowModel` + `getSortedRowModel`，排序/选择状态同时支持受控（`v-model:*`）与非受控（`default*`）。
- **列宽**：pointer 拖拽 + 隐藏 `<input type="range">`，复刻 RAC resizer 的 ARIA 契约（`aria-label="Resizer"`、`aria-valuetext="N pixels"`、`aria-labelledby="${inputId} ${headerId}"`、`data-resizable-direction`）；宽度写入 `th` 内联 style，`table-layout: fixed; width: min-content`。
- **虚拟化**：`@tanstack/vue-virtual` + 固定 `rowHeight`（默认 44）。非虚拟化仍是原生 `<table>`；虚拟化切换为 `role="grid"` 的 div 结构，行/单元格外包 `role="presentation"`（与上游 CSS `[role="row"] > [role="presentation"]` 选择器一致）。SSR 固定渲染前 10 行，挂载后再由 virtualizer 接管，避免 hydration mismatch；键盘激活行不在窗口内时强制渲染并异步聚焦。
- **LoadMore**：`hasMore` / `isLoadingMore` 两个 props + `#loadMore` 插槽；`IntersectionObserver` 以滚动容器为 root，仅在可见且未加载时触发一次 `@load-more`。虚拟化模式下 sentinel 绝对定位在 `totalSize` 之后。
- **粘性表头**：`isStickyHeader` 使用内联 `position: sticky; top: 0`，不注入工具类（避免要求消费方扫描库源码）；滚动高度通过 `scrollContainerClass` 由消费方提供。
- **Meter / ScrollShadow / InputOtp**：按本 ADR 的自研方向实现；Meter 输出 `role="meter"` 与 `aria-valuetext`，ScrollShadow 输出四个方向的 `data-*` 滚动状态，InputOtp 用隐藏原生 input + 槽位镜像（粘贴/分组/完成态）。

## Consequences（落地后更新）

- 虚拟化仅支持固定行高；动态行高内容不在契约内（与上游 `TableLayout` 的 `rowHeight` 约束一致）。
- 虚拟化 DOM 与原生 `<table>` 不同，但类名与 `data-slot` 保持同一套；依赖 `<table>` 元素选择器的自定义 CSS 在虚拟化模式下不适用。
- 列宽只在 `isResizable` 时启用，且只有 `allowsResizing` 的列输出 resizer；宽度不持久化。
