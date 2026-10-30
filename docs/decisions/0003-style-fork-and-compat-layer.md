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

### 实际别名表（生成器输出）

| 上游需要                         | owner       | 生成策略                                                                         |
| -------------------------------- | ----------- | -------------------------------------------------------------------------------- |
| `data-hovered="true"`            | `compat`    | 追加 `:hover`；组件另用 `useHover` 补齐                                          |
| `data-pressed="true"`            | `compat`    | 追加 `:active`、`[data-state="pressed"]`；组件另用 `usePress`                    |
| `data-focus="true"`              | `compat`    | 追加 `[data-highlighted]`（Reka 的活动集合项）                                   |
| `data-focused="true"`            | `component` | 不生成别名；`useFocusRing` / Reka FieldRoot 发射 presence                        |
| `data-focus-visible="true"`      | `compat`    | 追加 `:focus-visible`；跳过 `:not()` 内和同组已含该伪类的选择器                  |
| `data-focus-within="true"`       | `compat`    | 追加 `:focus-within`                                                             |
| `data-selected="true"`           | `compat`    | 追加 `[data-state="checked"]`、`[data-state="on"]`                               |
| `data-open="true"`               | `compat`    | 追加 `[data-state="open"]`；trigger 同时补 `data-open`                           |
| `data-expanded="true"`           | `compat`    | 追加 `[data-state="open"]`；`except: ["sheet", "toast"]`，这两个自绘表面自己设置 |
| `data-disabled="true"`           | `compat`    | 追加 `[data-disabled]`（presence）                                               |
| `data-invalid="true"`            | `compat`    | 追加 `[data-invalid]`；字段发射 presence 形式                                    |
| `data-indeterminate="true"`      | `compat`    | 追加 `[data-state="indeterminate"]`                                              |
| `data-outside-month="true"`      | `compat`    | 追加 `[data-outside-view]`                                                       |
| `data-entering` / `data-exiting` | `component` | 自研覆盖层状态机直接设置                                                         |
| `data-placement`                 | `component` | 组件根据 props 直接设置；不是 Floating UI 的 `data-side`                         |
| `data-slot`                      | `component` | 组件硬编码                                                                       |

### 属性归属清单（防回归）

上游 CSS 目前出现 65 种 `data-*` 选择器。每个属性必须在 `packages/styles/contracts/attributes.json` 中声明**恰好一个** owner，`manifest.json` 记录实际分布：

| owner       | 数量 | 含义                                                                                       |
| ----------- | ---- | ------------------------------------------------------------------------------------------ |
| `compat`    | 12   | 生成选择器别名                                                                             |
| `component` | 52   | Vue 组件显式发射（`data-slot`、`data-*` 状态、`data-theme` 等）                            |
| `native`    | 0    | 上游已有原生回退，无需额外处理；当前所有回退都通过 `compat` 追加原生伪类实现，因此计数为 0 |
| `reka`      | 1    | `data-orientation`，Reka 原样发射                                                          |

条目格式：

```json
{
  "data-hovered": {"owner": "compat", "map": [":hover"]},
  "data-focus-visible": {"owner": "compat", "map": [":focus-visible"]},
  "data-selected": {"owner": "compat", "map": ["[data-state=\"checked\"]", "[data-state=\"on\"]"]},
  "data-expanded": {
    "owner": "compat",
    "map": ["[data-state=\"open\"]"],
    "except": ["sheet", "toast"]
  },
  "data-slot": {"owner": "component"},
  "data-entering": {"owner": "component"},
  "data-placement": {"owner": "component"}
}
```

`gen-compat.mjs` 的行为：

1. 扫描全部 96 个上游 CSS，收集所有 `[data-*]` 属性；
2. 与归属清单比对：未知属性、重复键、未使用属性、`map` 非 compat / 为空 / 非法选择器、`except` 未知组件 → **CI 失败**，并给出修复指引；
3. 校验 `scope.json` 与上游组件 CSS 一一对应，`data-slots.json` 的 pin 与总数；
4. 对 `owner: compat` 的属性在原规则位置追加选择器别名，跳过 `:not()` 等伪类函数内部、跳过同组已含的原生伪类、按组件应用 `except`；
5. 生成 `generated/components/**` 与 `manifest.json`（上游版本/commit、每个源文件与生成文件哈希、别名数、属性使用文件/组件、owner 分布、data-slot 哈希）；
6. `--check` 逐字节比对 manifest 和每个生成文件，并检测多余生成文件与上游文件增删改；CI 用 `--check`，不重新写盘，因此确定性由“期望输出 = 提交输出”保证。

`data-slots.json` 实测为 **334 个唯一值 / 81 个组件**，不是 ticket 初稿的 332。初稿只匹配 JSX 字面量，漏掉了对象键形式（`"data-slot": "select-indicator"`、`"data-slot": "autocomplete-indicator"`）。以完整提取的 334 为准，差异记录在 [T02 findings](../research/t02-contract-findings.md#2-data-slot332--334)。

### 上游同步流程

```bash
pnpm check:styles                     # 离线校验本地快照，CI 使用
pnpm sync:styles --source ../heroui   # 用已校验的本地 checkout 覆盖快照
```

维护脚本必须：

1. 确认源仓库 `packages/styles` 工作区干净；
2. **先**逐文件比对源 CSS 哈希与快照，再比对版本/commit；不匹配且未显式 `--allow-upstream-change` 时拒绝覆盖，并列出第一个不匹配的文件；
3. 显式升级必须同时提供 `--commit <sha>`，且与源 `HEAD` 一致；
4. 覆盖 98 个文件（96 个 CSS + LICENSE + README）；
5. 更新 `contracts/upstream.json` 后，由维护者重新运行 `gen:compat`、`gen:slots`、`test:contract` 和视觉回归；
6. 在 PR 中输出：上游 commit、CSS 变更摘要、新增/移除的 `data-*`、视觉差异截图。

不修改上游 CSS；不把上游同步和功能开发混在一个 PR。维护细节见 [packages/styles/CONTRIBUTING.md](../../packages/styles/CONTRIBUTING.md)。

## Consequences

正面：

- 上游样式修复自动继承；我们只维护“薄别名层”。
- 别名与原始规则同位置，层叠顺序与上游一致。
- 属性清单让“AI 批量移植”导致的漏属性在 CI 暴露，而不是上线后由用户发现。
- 生成过程确定性可校验，review 可读。
- `manifest.json` 把 96 个上游文件、86 个生成文件、65 个属性、263 个别名和 334 个 data-slot 固定为可 diff 的契约；未知属性、未使用属性、生成漂移、快照差异都会让 CI 失败。

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
