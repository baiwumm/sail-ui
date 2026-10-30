# Sail UI 文档

本目录是 Sail UI 的“决策 + 切片 + 验收”文档集，遵循 **先想清楚、再切小、最后验收** 的顺序。公开 README 面向使用者；这里的文档面向实现者和 AI Agent。

## 阅读路径

| 你想做什么 | 先读 | 再读 |
|---|---|---|
| 了解项目是否值得做 | [Spec](./spec/0001-heroui-v3-vue-port.spec.md) §1–§2 | [上游审计](./research/heroui-v3-audit.md) |
| 评审架构决策 | [Spec](./spec/0001-heroui-v3-vue-port.spec.md) §5 | [ADRs](./decisions/README.md) |
| 开始实现 | [Ticket 01](./spec/tickets/01-m0-foundation-spike.md) | [AGENTS.md](../AGENTS.md) · [验收矩阵](./acceptance-matrix.md) |
| 查组件归哪个阶段 | [组件矩阵](./component-matrix.md) | [路线图](./roadmap.md) |
| 从 HeroUI React 迁移 | [迁移指南](./migration-from-heroui.md) | [GLOSSARY](../GLOSSARY.md) |
| 接手维护上游同步 | [ADR 0003](./decisions/0003-style-fork-and-compat-layer.md) | [ADR 0006](./decisions/0006-licensing-and-attribution.md) |

## 文档地图

```
docs/
├── README.md                        # 本文件
├── spec/
│   ├── 0001-heroui-v3-vue-port.spec.md   # 需求 / 决策 / 验收 / 风险
│   └── tickets/
│       ├── README.md                # 依赖图 + 状态
│       └── 01..09-*.md              # 垂直切片
├── decisions/                       # ADR
├── research/
│   └── heroui-v3-audit.md            # 上游实测证据
├── acceptance-matrix.md             # 全局门禁 + 组件验收
├── component-matrix.md              # 84 个组件的映射与阶段
├── roadmap.md                       # M0–M4
└── migration-from-heroui.md         # React → Vue 映射
```

## Spec 模板（7 节）

每份 spec 必须包含：

1. **Problem / Context** — 为什么做，证据是什么。
2. **Goals & Success Criteria** — 可验收的目标。
3. **In Scope** — 本次做什么。
4. **Out of Scope** — 明确不做什么（缺这节不算 spec）。
5. **Implementation Decisions** — 架构、API、依赖、测试缝。
6. **Acceptance Criteria** — 全局门禁 + 组件级验收。
7. **Risks & Open Questions** — 已知风险和待拍板项。

## Ticket 模板

每张 ticket 必须包含：

- `What to build`：完成后能演示什么；
- `Blocked by` / `Unblocks`：依赖边；
- `Scope`：涉及的包、组件、文档；
- `Acceptance`：可勾选的验收项；
- `Demo`：如何在 playground/docs 中验证；
- `Out of scope`：这张 ticket 不碰什么。

## 文档规则

- 所有代码示例必须是可运行的 Vue SFC，使用命名导出（`CardHeader`），不要写静态 `<Card.Header>`。
- 决策变更先改 ADR 或 spec，再改 ticket。
- 中文文档保留英文技术名词（`data-slot`、`compat.css`、`SSR`），首次出现时在 [GLOSSARY](../GLOSSARY.md) 中定义。
- 状态值与 [组件矩阵](./component-matrix.md) 保持同步。

## 当前状态

- 上游：HeroUI `3.2.7` / `89cd95ec1`（2026-10-29）。
- 本仓库：T01（M0 spike）与 T02（契约工具链）已完成；尚未发布任何 npm 包。
- 当前组件：Button / Input / Modal / Select，`pnpm verify` 为完整门禁。
- 下一步：T03、T04、T05、T07（T02 已解除阻塞）。
</content>
