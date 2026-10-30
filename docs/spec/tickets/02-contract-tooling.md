# T02 — 契约工具链与属性归属

- Milestone: M0/M1
- Status: Done
- Blocked by: [T01](./01-m0-foundation-spike.md)
- Unblocks: [T03](./03-display-and-feedback.md), [T04](./04-form-controls.md), [T05](./05-overlays.md), [T07](./07-date-and-color.md)
- Related: [ADR 0003](../../decisions/0003-style-fork-and-compat-layer.md), [验收矩阵](../../acceptance-matrix.md), [T02 findings](../../research/t02-contract-findings.md)

## What to build

把 T01 的最小生成链路升级为**可防回归的契约系统**：

1. `attributes.json` 覆盖上游 CSS 的 65 种 `data-*` 选择器；
2. `gen-compat.mjs` 完整、确定性、可读；
3. `manifest.json`（版本/commit/源与生成哈希/别名统计）；
4. `data-slot` 快照从上游 React 源码生成（完整提取为 334 个值；初稿的 332 漏掉了对象键形式，见 [findings](../../research/t02-contract-findings.md#2-data-slot332--334)）；
5. 契约测试：渲染 SSR → 断言 `data-slot` 与 CSS 需要的状态属性；
6. CI：未知属性、缺失属性、生成漂移、快照差异全部失败；
7. 一份“如何加新属性”的维护文档。

这张 ticket 的验收方式是**故意弄坏**：删掉 Button 的 `data-hovered`，契约测试必须红；恢复必须绿。

## T01 移交的现状

T01 已跑通最小生成链路，T02 在其上扩展，不要推倒重来。实测细节见 [M0 findings](../../research/m0-spike-findings.md)。

| 项 | T01 现状 | T02 要补 |
|---|---|---|
| `attributes.json` | 18 条：compat 9 / component 8 / reka 1 | 覆盖上游 65 种属性，47 个 pending 逐个定 owner |
| scope | 15 个组件（Button/Input/Modal/Select 及其 parts） | 扩展到全部组件，并按组件分组 |
| 别名 | 29 个，分布在 8 个生成文件 | 评审每个别名；新增别名必须保持原位追加 |
| `data-slots` | 4 个组件以契约列表人工核对 | 从 React 源码生成快照（完整提取 334 值） |
| 生成器 | PostCSS 原位追加、`:not()` 内跳过、同组已存在则跳过、`--check` 确定性 | 65 属性冲突检测、未知属性报错、漂移 CI |
| manifest | 版本/commit/96 文件哈希/别名统计/pending 属性 | 与 `sync-styles` 联动校验 |

### 生成器已知约束

- **别名不能进 `:not()`**：例如 `[data-focus-visible]` 的反义选择器不能替换成 `:focus-visible`，否则语义反转。当前实现直接跳过。
- **同组选择器已含别名时跳过**：`list-box-item.css` 的 `:focus-visible:not([data-focused]), [data-focus-visible="true"]` 再追加 `:focus-visible` 会扩大命中范围，曾导致 Select 弹层 1.7% 视觉差异。
- **`data-focused` 是组件补齐属性**：React Aria 在聚焦时设置，用于抑制原生焦点环；Vue 由 `useFocusRing.isFocused` 发射 presence 形式。不要把它当作纯 compat 别名删除。
- **`data-focus-visible` 需要键盘模态门槛**：Chromium 对弹层内的程序化焦点也返回 `:focus-visible`，只靠 `:focus-visible` 无法复刻上游行为。
- **Reka 词汇差异**：`data-state=open/checked/on`、`data-highlighted`、`data-side` 需在 `attributes.json` 或组件层归一化；Select trigger 的 `role="combobox"` 与上游 `aria-haspopup="listbox"` 尚未对齐，T05 决策。

## Scope

| 路径 | 内容 |
|---|---|
| `packages/styles/contracts/attributes.json` | 65 个属性的 owner/map/notes |
| `packages/styles/scripts/gen-compat.mjs` | PostCSS 扫描 + 原位扩展 + 生成 |
| `packages/styles/scripts/sync-styles.mjs` | 版本/哈希校验 + 覆盖 + 重生成 |
| `packages/styles/generated/**` | 生成产物 + manifest |
| `packages/testing/src/contract/*` | SSR 渲染、选择器需求提取、diff 断言 |
| `packages/styles/contracts/data-slots.json` | 上游 `data-slot` 快照 |
| `.github/workflows/contract.yml` | 生成/漂移/契约 CI |
| `docs/decisions/0003` 更新 | 记录实际 owner 分布与例外 |

## 设计要点

### 属性归属

每个属性必须且只能有一个 owner：

- `reka`：Reka 原生发射，无需处理；
- `native`：上游有 `:hover` / `:focus-visible` / `:active` 回退；
- `compat`：生成选择器别名（如 `[data-state="open"]`）；
- `component`：必须由 Vue 组件显式设置（如 `data-slot`、`data-placement`、`data-entering`）。

未知属性 → CI 失败，并输出：

```
Unknown data attribute: data-snap-points (carousel.css)
Choose an owner in packages/styles/contracts/attributes.json
```

### 契约测试

对每个组件：

1. 从组件 CSS 提取该组件选择器用到的属性集合；
2. 渲染组件在给定状态下（默认/open/selected/disabled/invalid）；
3. 断言：
   - `data-slot` 集合与 `data-slots.json` 对应项一致；
   - 需要的属性存在且值正确；
   - 不允许出现“CSS 需要但 DOM 没有”的静默失败。

### 确定性

`gen:compat` 连续运行两次，输出哈希必须一致；CI 重新生成并 `git diff --exit-code`。

### 维护文档

`packages/styles/CONTRIBUTING.md` 说明：

- 新增上游属性时如何选 owner；
- 如何写 per-component 例外；
- 如何更新 `data-slots.json`；
- 如何跑同步与视觉回归。

## Acceptance

- [x] `attributes.json` 覆盖 65 种属性，无遗漏、无重复、无未知。
- [x] `gen-compat` 对 Button/Input/Modal/Select 的生成结果与 T01 视觉一致（视觉 8/8，light/dark）。
- [x] `manifest.json` 记录上游 `3.2.7` / `89cd95ec1` / 96 个 CSS 文件哈希。
- [x] `data-slots.json` 含 334 个值（初稿 332，已校正），按组件分组（81 个组件）。
- [x] 契约测试覆盖 4 个 spike 组件的默认/交互状态。
- [x] **故障注入 1**：删除 Button 的 `data-hovered` → `pnpm test:contract` 红；恢复 → 绿。
- [x] **故障注入 2**：在 `button.css` 中加入未知 `data-foo` → CI 红并提示 owner；恢复 → 绿。
- [x] **故障注入 3**：手改 `generated/` → CI 因漂移红；重新生成 → 绿。
- [x] 生成器连续运行两次输出一致（manifest 与 86 个生成文件哈希一致）。
- [x] `pnpm sync:styles` 在错误版本/哈希不匹配时拒绝覆盖（9 个同步契约用例）。
- [x] 维护文档完成，并在 [ADR 0003](../../decisions/0003-style-fork-and-compat-layer.md) 记录 owner 分布（12/52/0/1）。
- [x] `pnpm verify` 通过。

## Outcome

- 65 个属性：compat 12 / component 52 / native 0 / reka 1；263 个别名分布在 50 个生成文件。
- `data-slots.json` 为 334 个值 / 81 个组件；与初稿 332 的差异及原因见 [findings](../../research/t02-contract-findings.md#2-data-slot332--334)。
- 新增 `scripts/sync-styles.mjs`、`scripts/gen-data-slots.mjs`、`packages/styles/CONTRIBUTING.md`、`.github/workflows/contract.yml`。
- 契约测试 45 条：生成器 13、data-slot 8、同步 9、Vue SSR/交互 15；每个 CSS 属性要么断言，要么在 `STATE_COVERAGE` 登记缺口。
- 故障注入 3 项、生成确定性、同步拒绝均有自动化用例；`pnpm verify`、浏览器 18/18、视觉 8/8 通过。
- 冷环境暴露的 `nuxt-fixture#typecheck` 依赖构建产物问题已用 `dependsOn: ["^build"]` 修复。
- 未在本次实现：WebKit 视觉基线、其余 80 个组件的契约表、Select/Modal 的 ARIA 欠账（仍归 T05）。

## Demo

```bash
pnpm test:contract
# 手动删除 button.vue 的 :data-hovered
pnpm test:contract   # 预期失败，错误指向 button.css 的 [data-hovered="true"]
# 恢复
pnpm test:contract   # 预期通过
```

## Out of scope

- 全量视觉回归（T03 起逐步接入）；
- 浏览器/a11y 测试；
- 其余 80 个组件的契约快照（随各自 ticket 增加）；
- npm 发布流程。

## Risks

| 风险 | 处理 |
|---|---|
| 65 个属性中相当一部分是组件特有，owner 判断成本高 | 先按 CSS 文件分组，批量评审；不确定的标 `component` 并在实现时校正 |
| 选择器扩展破坏 `:not()` / `:has()` 等复杂选择器 | PostCSS AST 级别处理，不字符串替换；加针对性 fixture |
| `data-slots.json` 从 React 源码提取误伤内部组件 | 只取公共导出组件的文件；对 `rac/`、`icons/` 排除 |
| 生成产物提交造成 review 噪音 | 生成文件与源文件分开目录；PR 附 `--stat` 摘要 |
</content>
