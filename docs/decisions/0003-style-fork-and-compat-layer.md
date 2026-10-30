# ADR 0003: 样式 fork 与属性兼容层

- Status: Accepted
- Date: 2026-10-30
- Related: [Spec §5.3](../spec/0001-heroui-v3-vue-port.spec.md), [上游审计 §1](../research/heroui-v3-audit.md)

## Context

HeroUI 的视觉一致性建立在 9,959 行 CSS 上。CSS 依赖 `data-*` 属性，Reka 的词汇与 HeroUI 不完全一致。可选方案：

1. 手改上游 CSS，把 `[data-hovered="true"]` 改成 Reka 词汇；
2. 不 fork，重写组件 CSS；
3. fork 上游 CSS 原样保留，在构建期生成属性别名；
4. 运行时用 JS 给元素补属性，不改 CSS。

方案 1 会让上游升级变成手工合并，且容易破坏 `:hover`/`:focus-visible` 的原生回退；方案 2 无法做到像素级一致；方案 4 会把样式契约变成运行时逻辑，SSR/首帧都更脆弱。

## Decision

采用 **fork + 构建期生成**，并做一处比计划稿更严格的修订：

- `packages/styles/upstream/**` 保存上游 CSS **逐字节原样**，永不编辑。
- `packages/styles/scripts/gen-compat.mjs` 用 PostCSS 遍历每个上游 CSS 文件，在**原规则位置**把需要的 `data-*` 选择器扩展为选择器列表。
- 生成结果写入 `packages/styles/generated/components/*.css`，保持与上游相同的文件划分和 `@import` 顺序。
- `packages/styles/index.css` 按上游层级导入 `generated/components/index.css`；`base`、`themes`、`utilities`、`variants` 仍原样导入上游。
- 不把别名规则统一追加到文件末尾：那会改变层叠顺序，可能让 `compat.css` 覆盖 theme 规则。别名必须与原始规则同位置。

“compat.css”在本文中指生成后的组件样式集合；包入口仍然是 `@sail-ui/styles`。

### 默认别名表

| 上游需要 | Reka 现状 | 生成策略 |
|---|---|---|
| `data-hovered="true"` | 不发射 | 追加 `:hover`（在 `@media (hover:hover)` 内）；无原生回退的组件用 `useHover` |
| `data-pressed="true"` | 部分组件发射 | 追加 `:active`；`accordion` / `radio` / `combobox` / `switch` 用 `usePress` 补齐 |
| `data-focused="true"` | 发射 | 不需要别名 |
| `data-focus-visible="true"` | 不发射 | 依赖上游已有的 `:focus-visible` 回退；少数无回退处用 `useFocusRing` |
| `data-selected="true"` | 多数发射 `data-selected`；部分为 `data-state="checked/on"` | 追加 `[data-state="checked"]`、`[data-state="on"]`；按组件核对 |
| `data-open="true"` | `data-state="open"` | 追加 `[data-state="open"]`，同时在组件 trigger 上补 `data-open` |
| `data-expanded="true"` | `data-state="open"` / `data-expanded` | 追加 `[data-state="open"]`，必要时组件补齐 |
| `data-disabled="true"` | `data-disabled` presence | 追加 `[data-disabled]` |
| `data-invalid="true"` | 发射 | 不需要别名 |
| `data-indeterminate="true"` | `data-state="indeterminate"` | 追加 `[data-state="indeterminate"]` |
| `data-outside-month="true"` | `data-outside-view` | 追加 `[data-outside-view]` |
| `data-entering` / `data-exiting` | 不发射 | 自研覆盖层状态机，组件直接设置 |
| `data-placement` | 不发射 | 组件根据 props 直接设置 |
| `data-slot` | 不发射 | 组件硬编码 |

### 属性归属清单（防回归）

上游 CSS 目前出现 65 种 `data-*` 选择器。每个属性必须在 `packages/styles/contracts/attributes.json` 中声明归属：

```json
{
  "data-hovered": { "owner": "compat", "map": ":hover" },
  "data-focus-visible": { "owner": "native", "fallback": ":focus-visible" },
  "data-selected": { "owner": "compat", "map": ["[data-state=checked]", "[data-state=on]"] },
  "data-slot": { "owner": "component" },
  "data-entering": { "owner": "component" },
  "data-placement": { "owner": "component" }
}
```

`gen-compat.mjs` 的行为：

1. 扫描上游 CSS，收集所有 `[data-*]` 属性；
2. 与归属清单比对，出现未知属性 → **CI 失败**，要求选择 owner；
3. 对 `owner: compat` 的属性做选择器扩展；
4. 生成文件 + `manifest.json`（上游版本、commit、每个源文件/生成文件哈希、别名数）；
5. 再跑一次生成，若结果不一致 → CI 失败（保证确定性）。

### 上游同步流程

```bash
pnpm sync:styles --version 3.2.7
```

脚本必须：

1. 从 npm 取指定版本 tarball（或固定本地快照），校验版本与哈希；
2. 覆盖 `packages/styles/upstream/**`；
3. 重新生成 `generated/**`；
4. 运行 `pnpm test:contract`；
5. 运行视觉回归；
6. 在 PR 中输出：上游 commit、CSS 变更摘要、新增/移除的 `data-*`、视觉差异截图。

不修改上游 CSS；不把上游同步和功能开发混在一个 PR。

## Consequences

正面：

- 上游样式修复自动继承；我们只维护“薄别名层”。
- 别名与原始规则同位置，层叠顺序与上游一致。
- 属性清单让“AI 批量移植”导致的漏属性在 CI 暴露，而不是上线后由用户发现。
- 生成过程确定性可校验，review 可读。

负面：

- 生成后的组件 CSS 比上游略大（选择器列表变长），由压缩抵消。
- 需要维护 `attributes.json`；上游新增属性会让 CI 红，迫使人工决策。
- 选择器扩展不能解决所有差异：`data-hovered` 在没有 `:hover` 语义的触屏/程序化状态里仍需 composable。
- 上游许可证与归属必须在每次同步时保留（见 [ADR 0006](./0006-licensing-and-attribution.md)）。

## Alternatives considered

- **手改 CSS**：升级不可维护，排除。
- **末尾追加 alias 文件**：层叠风险，排除。
- **只用组件补属性、不改 CSS**：无法覆盖上游 CSS 中已有的选择器，且漏一个属性就视觉错误，排除。
- **重写 CSS**：无法保证像素一致，排除。
</content>
