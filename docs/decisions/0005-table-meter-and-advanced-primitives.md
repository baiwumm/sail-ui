# ADR 0005: Table、Meter、ScrollShadow 与组合型组件

- Status: Proposed（Table 细节待 T08 评审）
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
</content>
