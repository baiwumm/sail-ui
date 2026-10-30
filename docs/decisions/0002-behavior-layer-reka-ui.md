# ADR 0002: 行为层使用 Reka UI

- Status: Accepted
- Date: 2026-10-30
- Related: [Spec §5.2](../spec/0001-heroui-v3-vue-port.spec.md), [上游审计](../research/heroui-v3-audit.md)

## Context

HeroUI v3 的行为来自 React Aria Components（RAC）。Vue 端需要产出相同的 DOM/ARIA 契约，有三条路：

1. 自研全部行为 composable；
2. 移植 RAC；
3. 使用 Vue 生态中同层级的无头原语库，再补属性差异。

Reka UI 2.11.0 实测：

- peer dependency `vue >= 3.4.0`；
- 521 个导出，覆盖 Accordion、Dialog、Select、Combobox、Calendar、DatePicker、Color、Toast、Drawer、PinInput 等；
- 自带 `ConfigProvider`、Floating UI 定位、FocusScope、DismissableLayer、Presence；
- 与 Nuxt UI 4.12.0 的依赖栈同构（`reka-ui 2.11.0`、`tailwind-variants`、`tailwindcss 4`）。

Reka 不发射 `data-hovered`、`data-focus-visible`、`data-open`、`data-entering`、`data-exiting`，也不提供 `Table`。

## Decision

**Reka UI 作为行为层主体，HeroUI 特有状态由属性适配层补齐。**

三层职责：

| 层                    | 职责                                              |
| --------------------- | ------------------------------------------------- |
| `@sail-ui/vue`        | SFC、`tv()` 变体、`data-slot`、状态属性、组合 API |
| `@sail-ui/primitives` | Reka 空白处的 4 个 composable + overlay exit hold |
| `@sail-ui/styles`     | 上游 CSS + 生成的 `compat.css`                    |

不移植 RAC，不做 React 兼容运行时，不手写另一套全量无头组件。

## Consequences

正面：

- 日期、颜色、Toast、Drawer、PinInput、虚拟化等最贵的块直接复用，工期从“6–9 个月”压缩到“3–4 个月全量”。
- 键盘/焦点/浮层定位遵循成熟实现，a11y 风险低。
- 与 Nuxt UI 生态同栈，用户不会引入第二套冲突原语。

负面：

- 属性词汇差异需要长期维护，Reka 升级可能改变属性。
- 少数组件（Switch、RadioGroup 的内部 slot）需要补 `useHover` / `usePress` / `useFocusRing`。
- Table、Meter、ScrollShadow、ColorInputGroup、DateInputGroup 仍需自研（见 [ADR 0005](./0005-table-meter-and-advanced-primitives.md)）。

约束：

- Reka 版本精确锁定 `2.11.0`；升级必须单独 ticket，重跑契约与视觉。
- 不把 Reka 组件直接暴露为公共 API；所有公共组件都经过 `@sail-ui/vue` 封装。
- 属性差异优先用生成别名解决，其次在组件内归一化，绝不改上游 CSS。

## Alternatives considered

- **Ark UI / Zag.js**：状态机驱动，跨框架强；但属性词汇更偏 Zag，Table/Calendar 组合不如 Reka 贴合 HeroUI。
- **自研 composables**：完全可控，但日期/颜色/浮层成本过高，且难以达到 RAC 的边界处理。
- **移植 RAC**：工作量最大，且 Vue 端没有收益。
