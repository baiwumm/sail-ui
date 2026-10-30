# Spec 0001 — HeroUI v3 → Vue 3 / Nuxt 移植

- Status: Draft for review
- Date: 2026-10-30
- Upstream: HeroUI `3.2.7`, commit `89cd95ec1` (`v3.2.6-53-g89cd95ec1`)
- Repository: `sail-ui` (`@sail-ui/*`)
- Related: [Tickets](./tickets/README.md) · [ADRs](../decisions/README.md) · [Acceptance](../acceptance-matrix.md) · [Audit](../research/heroui-v3-audit.md)

---

## 1. Problem / Context

HeroUI v3 是一个成熟、视觉完成度高的 React 组件库，但没有官方 Vue 版本。Vue 3 / Nuxt 团队如果喜欢它的设计，只能：

- 继续用 React（技术栈不匹配）；
- 用 Nuxt UI 等 Vue 库（视觉与 API 不同）；
- 自己抄样式（无法跟上上游，且容易破坏可访问性）。

HeroUI v3 的结构让移植变得可行：

- 9,959 行 CSS 只依赖 BEM 类名与 `data-*`/ARIA 契约，没有任何 React 运行时；
- 组件是薄封装，行为集中在 RAC；
- 变体（`tv()`）是独立包，可直接复用；
- Vue 生态有 Reka UI，覆盖 Accordion、Dialog、Select、Combobox、Calendar、DatePicker、Color、Toast、Drawer、PinInput 等大部分行为；
- Nuxt UI 4 与 HeroUI v3 使用同一套底座版本（Reka UI 2.11.0、Tailwind CSS 4.3.3、tailwind-variants 3.x、`@internationalized/date` 3.12.x）。

实测证据见 [上游审计](../research/heroui-v3-audit.md)。核心数字：

| 指标                         |                                           数值 |
| ---------------------------- | ---------------------------------------------: |
| CSS 文件 / 行数              |                                     96 / 9,959 |
| 组件样式表 / 变体模块        |                                        86 / 85 |
| 公共组件导出                 | 84（含 1 个上游开发中组件；另有 2 个内部组合） |
| React 源码唯一 `data-slot`   | 334（完整提取；早期统计 332 漏掉两个对象键值） |
| 上游 CSS `data-*` 选择器种类 |                                             65 |
| Reka 导出                    |                                            521 |

### 1.1 用户与场景

| 用户                       | 场景                                       | 关键诉求                                           |
| -------------------------- | ------------------------------------------ | -------------------------------------------------- |
| Vue 3 + Vite 产品团队      | 想要 HeroUI 的视觉与交互，但不想引入 React | 按需导入、类型完整、主题可控                       |
| Nuxt 4 团队                | 内容站/后台，需要 SSR 与自动导入           | 无 hydration mismatch、模块化接入、覆盖层 SSR 安全 |
| 从 HeroUI React 迁移的团队 | 已有设计语言与页面，想换技术栈             | API 可映射、样式一致、迁移路径清晰                 |
| 组件库维护者/AI Agent      | 跟随上游迭代，批量移植                     | 契约可验证、上游同步可重复、失败可定位             |
| 设计与 QA                  | 验收视觉与可访问性                         | 截图对比、键盘清单、axe 结果可追溯                 |

核心用户故事：

- 作为 Vue 开发者，我可以 `pnpm add @sail-ui/vue @sail-ui/styles` 后渲染 Button/Card，并获得与 HeroUI 相同的视觉。
- 作为 Nuxt 开发者，我加一个模块就能用 `<SButton>`，SSR 页面无警告，关闭的 Modal 不污染 HTML。
- 作为 HeroUI 用户，我可以按迁移表把 `<Card.Header>` 改成 `<CardHeader>`，把 `isOpen` 改成 `v-model:open`，其余 props 尽量不变。
- 作为维护者，我升级上游后跑一条命令，就知道哪些 CSS 属性/视觉发生了变化。

## 2. Goals & Success Criteria

### 2.1 Goals

| ID  | 目标                   | 成功标准                                                                                 |
| --- | ---------------------- | ---------------------------------------------------------------------------------------- |
| G1  | **视觉一致**           | 相同 fixture、主题、尺寸、状态下，与上游 React 参考的截图差异在阈值内；关键区域 0 像素差 |
| G2  | **DOM/ARIA 契约一致**  | `data-slot` 完全一致；CSS 依赖的 `data-*` 状态存在且值正确；角色/可访问名一致            |
| G3  | **行为与可访问性一致** | 键盘路径、焦点管理、选择、关闭、类型筛选（typeahead）与上游一致；axe 无 critical/serious |
| G4  | **SSR 可用**           | Vue SSR 与 Nuxt 4 渲染无 hydration mismatch；关闭的覆盖层不产出 DOM；单请求状态隔离      |
| G5  | **Vue/Nuxt DX**        | 子路径导入、类型完整、Nuxt 自动导入、Tailwind v4 接入、主题可用                          |
| G6  | **可迁移**             | HeroUI React 示例能通过迁移表映射到 Vue；API 差异有文档                                  |
| G7  | **可维护**             | 上游同步可在 1 人日内完成；新增/变化的属性会让 CI 红，而不是静默漂移                     |
| G8  | **可发布**             | 包可打包、可安装、有 LICENSE/NOTICE、无未声明依赖、有 changesets 版本策略                |

### 2.2 非目标

- 不追求 100% 的 RAC 内部行为等价；以公开 DOM/ARIA/键盘行为为准。
- 不追求与 HeroUI React 源码逐行对应；以契约为准。
- 不追求一次交付 84 个组件；MVP 是 40 个。

### 2.3 里程碑指标

| 里程碑    |                               组件数 | 必须证明                                                |
| --------- | -----------------------------------: | ------------------------------------------------------- |
| M0        | 4（Button / Input / Modal / Select） | 架构可行、视觉可对齐、SSR 干净、打包可安装              |
| M1        |                                   43 | 展示类 + 表单类完整；主题/尺寸/状态矩阵；契约与视觉门禁 |
| M2（MVP） |          65（其中 40 个为“核心 40”） | 覆盖层、集合、Toast；MVP 组件 API 稳定                  |
| M3        |                                   84 | 日期/颜色/高级 Table/ScrollShadow/Meter/OTP             |
| M4        |                                   84 | a11y/视觉/发布门禁；npm canary；迁移指南完成            |

> “核心 40”清单见 [Roadmap §MVP](../roadmap.md#mvp-40-components)。M2 会实现 65 个，但对外承诺的 MVP 是 40 个；Nuxt module 与文档站在 M4 收口。

## 3. In Scope

1. **组件**：84 个公共组件全量对齐；MVP 先交付核心 40 个。
2. **样式**：`@sail-ui/styles`，上游 CSS 原样快照 + 构建期生成的属性兼容层 + 主题/工具类/变体。
3. **行为原语**：`@sail-ui/primitives`，含 `useHover`、`usePress`、`useFocusRing`、`useOverlayState`（含 exit hold）。
4. **Vue 包**：`@sail-ui/vue`，SFC 组件、`tv()` 变体、命名导出 + 复合对象、子路径导出、类型。
5. **Nuxt**：`@sail-ui/nuxt`，自动导入、前缀、Tailwind v4、SSR、Toast 每请求实例。
6. **测试**：契约、单元、SSR、浏览器、视觉、axe；`@sail-ui/testing` 提供复用工具。
7. **文档**：Nuxt 文档站、每个组件的 demo + API 表 + 迁移说明；Storybook/playground 用于开发。
8. **发布**：changesets、canary、tarball 安装验证、LICENSE/NOTICE、依赖许可证审计。
9. **可访问性**：键盘、焦点、ARIA、RTL 冒烟；不包含 WCAG 认证。
10. **上游同步**：版本固定、哈希清单、属性归属清单、同步脚本与 CI。

## 4. Out of Scope

以下内容**明确不做**；若要做，另开 spec/ADR 并重新评审。

### 4.1 品牌与法律

- 与 HeroUI 的官方合作、背书、商标授权。
- 使用 `@heroui/*` 包名、HeroUI Logo、HeroUI 域名作为产品身份。
- 对 HeroUI 商标做任何形式的注册或抢注。

### 4.2 React 兼容

- React 运行时、React 组件 API 兼容层、`forwardRef` 模拟、RSC。
- 与 RAC 内部 hooks/context/状态机逐项对齐。
- HeroUI v2 API 兼容（只针对 v3）。
- `heroui-native` / React Native / 移动端原生。

### 4.3 功能

- HeroUI v3 之外的视觉重设计、品牌主题包、主题市场。
- 完整的 i18n 文案翻译；仅提供 locale/日期格式化接入点。
- 迁移 codemod（文档给映射表，不做自动改写）。
- Figma 套件、MCP server、`llms.txt`、AI 文档生成。
- 官方未提供的组件（如富文本编辑器、图表）。
- Table 的高级能力（列固定、行拖拽、单元格编辑、服务端分组）——M3 只做到上游已有能力。
- SSR streaming、React Server Components、Edge runtime 专项优化。
- 旧浏览器（IE、Safari < 15.4、Chrome < 100）；只支持 evergreen 最近两个大版本。
- Tailwind CSS v3；只支持 v4。
- 其他 npm registry / CDN 发布；先发 npm。
- 性能 SLA；只记录 bundle/CSS 体积，不承诺绝对性能指标。

### 4.4 质量与流程

- WCAG 2.2 AA 认证/第三方审计。
- 全量 Storybook 故事与上游一一对应；只为验收矩阵要求的状态建故事。
- 每个组件都做浏览器测试；浏览器测试按风险触发。
- 100% 覆盖率目标；覆盖率只做 ratchet。

## 5. Implementation Decisions

每项决策的完整背景、备选与后果见对应 ADR。

### 5.1 分层架构

```
apps/docs · apps/playground
        ↑
@sail-ui/nuxt
        ↑
@sail-ui/vue  ←→  @sail-ui/styles (tv variants)
        ↑
@sail-ui/primitives
        ↑
Reka UI 2.11.0
```

- `@sail-ui/vue` 不直接暴露 Reka 组件；所有公共组件都经过封装。
- `@sail-ui/styles` 不依赖 Vue。
- `@sail-ui/primitives` 不依赖具体组件，只依赖 Vue + DOM API。

### 5.2 行为层：Reka UI

- 精确锁定 `reka-ui@2.11.0`；升级单独 ticket。
- 覆盖层使用 Reka 的 FocusScope / DismissableLayer / Floating UI / Presence 作为基础。
- Reka 缺口用最小 composable 补齐，不自研全量无头库。
- 详见 [ADR 0002](../decisions/0002-behavior-layer-reka-ui.md)。

### 5.3 样式：fork + 构建期生成

- `packages/styles/upstream/**` 逐字节保存上游 CSS，永不编辑。
- `gen-compat.mjs` 用 PostCSS 在**原规则位置**扩展选择器；生成到 `generated/`，保持文件划分与 `@import` 顺序。
- 属性归属清单 `attributes.json`：每个 CSS `data-*` 必须有 owner（`reka` / `native` / `compat` / `component`）；未知属性让 CI 失败。
- `manifest.json` 记录上游版本/commit/哈希/别名数。
- 默认别名：`data-open → [data-state=open]`、`data-expanded → [data-state=open]`、`data-indeterminate → [data-state=indeterminate]`、`data-outside-month → [data-outside-view]`、`data-disabled → [data-disabled]`、`data-hovered → :hover`、`data-pressed → :active`。
- `data-selected` 按组件核对（部分 Reka 为 `data-state=checked/on`）。
- `data-focus-visible` 依赖上游已有的 `:focus-visible` 回退，少数无回退处用 `useFocusRing`。
- 详见 [ADR 0003](../decisions/0003-style-fork-and-compat-layer.md)。

### 5.4 覆盖层状态机

复刻上游 `useOverlayExitHold` 的语义，而不是简单 `setTimeout`：

1. 关闭时设置 `data-exiting`，保留 DOM；
2. 监听 `animationend` / `animationcancel`，并用 `getAnimations()` 与最长时长兜底；
3. 处理 WebKit 在 layout effect 中 `playState === "pending"` 的情况；
4. 退场结束前把 opacity 钉为 0，下一帧前卸载；
5. `isOpen` 初始为 true 时跳过入场动画；
6. SSR 默认不渲染任何覆盖层 DOM，`open` 后才 `v-if`/Teleport。

覆盖层层级：modal 级覆盖层（Modal/AlertDialog/Drawer/Sheet）使用 `--z-index-overlay: 100000`；toast 使用 `--z-index-toast: 100001`；popover/tooltip 依赖 portal 层叠，不额外发明更高层级。详见 [Ticket 05](./tickets/05-overlays.md)。

### 5.5 四个行为原语

| Composable        | 用途                                                     | 典型场景                                     |
| ----------------- | -------------------------------------------------------- | -------------------------------------------- |
| `useHover`        | 指针 hover（排除触屏），输出 `data-hovered`              | switch、radio-group、无 `:hover` 回退的 slot |
| `usePress`        | 指针 + 键盘激活，输出 `data-pressed`                     | accordion、radio、combobox、switch           |
| `useFocusRing`    | `:focus-visible` + 程序化焦点，输出 `data-focus-visible` | 无原生回退的 3 处                            |
| `useOverlayState` | open/entering/exiting + exit hold                        | modal、drawer、popover、tooltip、toast       |

每个 composable 必须 SSR 安全、可销毁、无模块级全局状态。

### 5.6 复合组件 API

- 命名导出是模板主 API：`CardHeader`、`SelectTrigger`。
- 同时导出复合对象 `Card` / `Select`，用于 `<component :is="Select.Trigger" />` 与程序化访问。
- **不支持**静态 `<Select.Trigger>`：Vue 编译器会把它当字符串组件名解析，`<script setup>` 的 import 无法解析。实测见 [ADR 0004](../decisions/0004-compound-component-api.md)。
- 文档与迁移指南一律使用命名导出。

### 5.7 Props / events / slots 约定

- 状态形容词保留上游命名（`isDisabled`、`isRequired`、`isInvalid`）。
- `v-model` / `v-model:open` / `v-model:expanded-keys` 取代 `value` + `onChange`、`isOpen` + `onOpenChange`。
- `onPress → @press`；`onSelectionChange → @update:model-value`；`onOpenChange → @update:open`；原生 `@click` 继续透传。
- React render props → Vue scoped slots（camelCase slot props）。
- `className` → `class`；不接受函数形式。
- 详见 [ADR 0007](../decisions/0007-component-api-conventions.md)。

### 5.8 SSR 与 Nuxt

- 所有组件默认 SSR 可用；无 `window` 的 setup 读取。
- 生成的 id 使用 Vue 3.5 `useId()` 或 Reka `ConfigProvider` 的 `useId`。
- Toast 队列、任何注册表必须是 app/请求级实例，不能是模块级单例。
- `<html>` 上的 `dark` / `data-theme` 控制主题，不强制 Provider。
- Nuxt module 默认前缀 `S`，可配置为空；注入 Tailwind v4 插件与样式入口；自动导入组件与 `useToast`。
- SSR fixture 覆盖：普通组件、生成 id 的组件、关闭的覆盖层、打开后 hydrate 的覆盖层、Toast。

### 5.9 测试缝与契约验证

- **组件级**：jsdom 行为测试 + SSR 快照 + 契约测试。
- **风险级**：浏览器测试（几何、指针捕获、焦点陷阱、动画）。
- **视觉级**：Playwright 截图与上游 React 参考对比；状态 × 主题 × 尺寸。
- **契约级**：从上游 CSS 提取 `data-slot`/`data-*` 需求，渲染 Vue SSR，断言 DOM；`attributes.json` 防止漂移。
- **a11y**：浏览器 axe + 键盘清单。
- 详见 [验收矩阵](../acceptance-matrix.md)。

### 5.10 Table / Meter / ScrollShadow / 组合组件

- Table：TanStack Vue Table 管数据，DOM/ARIA/键盘自建；M3 先交付基础网格 + 排序 + 选择，再分阶段加列宽/虚拟化/LoadMore。
- Meter：自研 `role="meter"`，不复用 Progress 语义。
- ScrollShadow：自研 `useScrollShadow`，输出上游 `data-*-scroll` 属性。
- ColorInputGroup / DateInputGroup：内部组合，不对外导出。
- 详见 [ADR 0005](../decisions/0005-table-meter-and-advanced-primitives.md)。

### 5.11 文档与发布

- 文档站：Nuxt 4 + Nuxt Content 3；Demo 是真 Vue 组件，不是截图。
- Storybook（`vue3-vite`）只用于开发与状态调试，不作为发布站点。
- 发布：changesets；`0.x` 进入 MVP，`1.0` 在核心 40 稳定 + 迁移指南完成后。
- 每个包 `sideEffects` 明确、`exports` 完整、类型可解析。
- tarball 安装验证（Vite + Nuxt fixture），避免“workspace 内能跑、发布后坏掉”。

### 5.12 上游同步与许可

- 版本/commit 固定，`sync:styles` 校验哈希后覆盖快照。
- 同步 PR 必须附：CSS 变更摘要、新增/移除属性、视觉差异、契约结果。
- Apache-2.0 + NOTICE；上游 LICENSE/NOTICE 随快照保留；README 首屏三行声明。
- 详见 [ADR 0006](../decisions/0006-licensing-and-attribution.md)。

## 6. Acceptance Criteria

### 6.1 全局门禁

| ID  | 门禁            | 通过标准                                                                                     |
| --- | --------------- | -------------------------------------------------------------------------------------------- |
| A0  | Build & exports | `pnpm build` 通过；ESM 入口、子路径、类型声明可解析；`pnpm pack:check` 可在干净 fixture 安装 |
| A1  | Contract        | `data-slot` 与 CSS 期望完全一致；`data-*` 按 `attributes.json` 的面/值正确；无未知属性       |
| A2  | Unit/behavior   | 角色、可访问名、事件、焦点、受控/非受控、状态属性通过                                        |
| A3  | SSR             | 无 hydration mismatch；关闭覆盖层无 DOM；id 稳定；Toast 每请求隔离                           |
| A4  | Browser         | 风险组件通过：指针、焦点陷阱、动画、几何、虚拟化                                             |
| A5  | Visual          | 状态 × 主题 × 尺寸对比上游；关键区域 0 像素差，整体 ≤ 0.1%                                   |
| A6  | A11y            | axe 无 critical/serious；键盘清单逐项通过                                                    |
| A7  | Docs            | 每个公共组件有 demo + props/events/slots 表 + 迁移差异                                       |
| A8  | API             | 导出、类型、事件 payload 与 ADR 0007 一致；无意外泄漏 Reka 类型                              |
| A9  | Sync            | `gen:compat` 确定性；`manifest.json` 与上游快照一致                                          |

### 6.2 组件级验收

每个组件必须满足 [验收矩阵](../acceptance-matrix.md) 中对应行：

- 渲染与结构；
- `data-slot` / `data-*`；
- 角色与可访问名；
- 键盘与焦点；
- 受控/非受控；
- 主题/尺寸/变体；
- SSR（如适用）；
- 视觉（如适用）；
- 文档 demo。

### 6.3 Definition of Done

- [ ] 代码与类型完成，`pnpm verify` 通过；
- [ ] 契约/单元/SSR 测试覆盖新增行为；
- [ ] 风险组件有浏览器测试；
- [ ] 验收矩阵中的状态有截图对比；
- [ ] 文档 demo + API 表 + 迁移差异；
- [ ] 组件矩阵状态更新；
- [ ] ticket 中的 `Acceptance` 全勾；
- [ ] PR 描述包含门禁结果与已知差异。

### 6.4 里程碑出口

| 里程碑 | 出口条件                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------- |
| M0     | 4 个 spike 组件在 Vite + Nuxt SSR 中运行；视觉对比通过；tarball 安装通过；dot-notation 结论已验证 |
| M1     | 43 个组件 + 契约/视觉门禁 + 主题/尺寸矩阵；playground 可浏览                                      |
| M2     | 65 个组件（含 40 核心）+ 覆盖层/Toast + 迁移指南初稿；Nuxt module/文档站留到 M4                   |
| M3     | 84 个组件 + 日期/颜色/高级 Table/ScrollShadow/Meter/OTP                                           |
| M4     | axe/视觉/发布门禁全绿；npm canary；NOTICE/LICENSE/依赖审计完成                                    |

## 7. Risks & Open Questions

### 7.1 Risks

| 风险                | 影响                           | 缓解                                                           |
| ------------------- | ------------------------------ | -------------------------------------------------------------- |
| 上游 CSS 静默变更   | 视觉漂移                       | 版本固定 + 哈希清单 + 契约 CI + 视觉回归                       |
| Reka 升级改变属性   | 大面积回归                     | 精确锁版本；升级单独 ticket；属性归属清单                      |
| 覆盖层退场时序      | 闪烁/卡住                      | 复刻 exit hold；真动画浏览器测试；减少 `setTimeout`            |
| Table 被低估        | M3 延期                        | TanStack 管数据；先做基础网格，列宽/虚拟化分阶段；T08 单独评审 |
| 复合 API 误用       | 用户写 `<Select.Trigger>` 失败 | 文档/迁移表/运行时开发警告                                     |
| SSR Toast 串请求    | 数据泄漏                       | 每请求实例；Nuxt plugin；SSR fixture                           |
| 子路径导出/类型     | 发布后不可用                   | `pack:check` + 干净 fixture + `arethetypeswrong` 类检查        |
| npm scope 未确认    | 发布阻塞                       | M1 前完成 scope/org/商标确认                                   |
| 上游许可不一致      | 法律风险                       | Apache-2.0 + NOTICE；发布前法务确认                            |
| AI 生成量大但质量低 | 返工                           | ticket 验收 + 契约/视觉门禁；小步提交                          |
| 单维护者带宽        | 延期                           | MVP 40；批次交付；文档自动化                                   |
| RTL / 浏览器差异    | 视觉/交互问题                  | RTL 冒烟 + evergreen 浏览器矩阵                                |

### 7.2 Open Questions

| #   | 问题                                           | 建议                                                | 截止 |
| --- | ---------------------------------------------- | --------------------------------------------------- | ---- |
| Q1  | 最低 Vue 版本 3.4 还是 3.5？                   | 3.5（`useId` 稳定、生态一致）                       | M0   |
| Q2  | npm scope / GitHub org / 域名 / 商标是否可用？ | 发布前重新核查并保留证据                            | M1   |
| Q3  | 是否联系 HeroUI 寻求社区背书？                 | M0 后在 issue 中礼貌说明，不阻塞开发                | M0   |
| Q4  | 文档语言？                                     | README 英文；核心 spec/AGENTS 中文；M2 后加英文文档 | M1   |
| Q5  | MVP 是否包含 Table？                           | 不包含；M3 交付基础 Table，虚拟化/列宽随后          | M1   |
| Q6  | 日期/颜色是否进 MVP？                          | 不进 MVP，M3 交付                                   | M0   |
| Q7  | 浏览器矩阵？                                   | 最近两个大版本 evergreen + Safari 15.4+             | M1   |
| Q8  | Toast API 命名？                               | `useToast()` + `toast()` 方法；与 Reka manager 解耦 | T05  |
| Q9  | Nuxt 默认前缀？                                | `S`（`<SButton>`），可配置为空                      | T09  |
| Q10 | 是否提供迁移 codemod？                         | 不提供；先完善映射表与文档                          | 1.0  |
| Q11 | 是否支持 RTL 全量？                            | 冒烟 + 关键组件（Modal/Drawer/Select/Table）        | M3   |
| Q12 | 版本与发布节奏？                               | changesets；MVP 前 `0.x`；MVP 后两周一次            | M2   |
| Q13 | 是否提供 `disabled` 别名？                     | 不提供；保持 `isDisabled`                           | 1.0  |

### 7.3 待验证假设

- 40 个核心组件足以覆盖 80% 的 HeroUI 使用场景（需 M2 后的使用数据验证）。
- 生成的属性别名能覆盖绝大多数差异，剩余差异不超过 4 个 composable 的范围。
- TanStack Vue Table 能在不牺牲键盘/ARIA 的前提下复刻 Raptor 的表格语义。
- 上游 `calendar-year-picker` 会在 M3 前稳定；否则按当前快照交付并标注 preview。
