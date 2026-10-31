# ADR 0008: 折叠面板行为——Reka 集合状态 + 自研面板动画层

- Status: Accepted
- Date: 2026-10-31
- Related: [T06](../spec/tickets/06-collections-and-pickers.md), [ADR 0002](./0002-behavior-layer-reka-ui.md), 上游 HeroUI `89cd95ec1`

## Context

上游 Accordion / Disclosure 来自 React Aria Components：

- 面板**始终挂载**，展开/收起由 CSS 变量 `--disclosure-panel-height` 驱动（px → auto / px → 0px）；
- 收起动画结束后面板设置 `hidden="until-found"`；
- 面板 `role="group"`，`aria-labelledby` 指向 trigger，trigger 使用 `aria-controls` / `aria-expanded`；
- 指示器旋转依赖 trigger 的 `data-state` 与面板/条目上的 `data-expanded`。

Reka UI 2.11.0 的 `AccordionContent` / `CollapsibleContent` 默认**卸载**内容（需 `forceMount`），暴露的是 `--reka-collapsible-content-height`，面板 `role="region"`。直接使用会偏离上游的 DOM/CSS 契约，且收起后 `hidden="until-found"` 的时机无法通过 Reka 属性得到。

## Decision

- `AccordionRoot` / `AccordionItem` 继续使用 Reka 原语，负责单开/多开状态与方向键 collection 导航；
- trigger 与面板**自渲染**：trigger 为 `<button>` 并带 `data-reka-collection-item=""`，保留 Reka 的箭头键导航；面板通过 `packages/vue/src/shared/use-disclosure-panel.ts` 复刻 RAC 的高度动画与 `hidden="until-found"` 时序；
- `Disclosure` 不包裹 Reka `Collapsible`：展开状态、受控/非受控与 `DisclosureGroup` 协调由组件自身完成，面板复用同一个 composable。

## Consequences

正面：

- 面板常驻 DOM，SSR 输出与上游一致（关闭时 `hidden="until-found"`），CSS 变量与上游选择器直接对齐；
- 收起动画结束后才设置 `hidden`，保持与 RAC 相同的可搜索性与动画表现；
- trigger 的 `role`、`data-*`、id 关系完全可控。

负面：

- 面板动画依赖 `Element.getAnimations()`：jsdom 没有真实动画，测试只能断言同步属性，动画时序需浏览器测试覆盖；
- 升级 Reka 时必须重新确认 `data-reka-collection-item` 与方向键导航契约；
- `Disclosure` 的受控语义由本项目维护，不能再依赖 Reka 的 `Collapsible` 行为修复。

## Alternatives considered

- **Reka Content + `forceMount`**：仍需替换高度变量、`role`、收起后的 `hidden`，等于在 Reka 之上再包一层，复杂度高于自研面板。
- **完全自研 Accordion**：会丢失 Reka 已经稳定的方向键/collection 逻辑，违背 ADR 0002 的分层。
- **接受 Reka 的 DOM**：会破坏上游 CSS 契约（`--reka-collapsible-content-height`、`role="region"`、卸载行为），不可接受。
