# 架构决策记录（ADR）

一个 ADR 只记录一个决策：背景、决定、后果、备选。已被取代的 ADR 不删除，标 `Superseded by`。

| 编号                                                  | 决策                                                | 状态     |
| ----------------------------------------------------- | --------------------------------------------------- | -------- |
| [0001](./0001-brand-and-naming.md)                    | 品牌与包名：Sail UI / `@sail-ui/*`                  | Accepted |
| [0002](./0002-behavior-layer-reka-ui.md)              | 行为层使用 Reka UI，而不是自研全量或移植 RAC        | Accepted |
| [0003](./0003-style-fork-and-compat-layer.md)         | 样式 fork 上游 CSS + 生成 `compat.css`              | Accepted |
| [0004](./0004-compound-component-api.md)              | 复合组件 API：命名导出为主，复合对象用于 `:is`      | Accepted |
| [0005](./0005-table-meter-and-advanced-primitives.md) | Table / Meter / ScrollShadow / 组合型组件的实现路线 | Proposed |
| [0006](./0006-licensing-and-attribution.md)           | Apache-2.0 + NOTICE + 上游归属                      | Accepted |
| [0007](./0007-component-api-conventions.md)           | Props / events / v-model / slots 命名约定           | Accepted |

## 模板

```md
# ADR 000N: 标题

- Status: Proposed / Accepted / Superseded by ADR-XXXX
- Date: YYYY-MM-DD
- Deciders: ...
- Related: spec / ticket / upstream commit

## Context

## Decision

## Consequences

## Alternatives considered
```

</content>
