# T09 — Nuxt module + 文档站 + 发布门禁

- Milestone: M4
- Status: In progress（2026-11-01：切片 A–C 已落地，见文末进度记录；剩余覆盖层视觉矩阵、RTL 冒烟与 canary 发布）
- Blocked by: [T03](./03-display-and-feedback.md), [T04](./04-form-controls.md), [T05](./05-overlays.md), [T06](./06-collections-and-pickers.md), [T07](./07-date-and-color.md), [T08](./08-advanced-data.md)
- Unblocks: —
- Related: [Spec §5.8](../0001-heroui-v3-vue-port.spec.md), [Spec §5.11](../0001-heroui-v3-vue-port.spec.md), [Roadmap](../../roadmap.md)

## What to build

把“能跑的组件”变成“可安装、可浏览、可发布的产品”：

1. `@sail-ui/nuxt` 模块；
2. Nuxt 文档站（84 个组件的 demo/API/迁移说明）；
3. 发布门禁（tarball、类型、许可证、a11y、视觉基线）；
4. canary 发布与安装验证。

## Scope

### Nuxt module

- 自动导入组件，默认前缀 `S`（`<SButton>`），可配置 `prefix: ""`。
- 注入 `@sail-ui/styles` 入口 + Tailwind v4（`@tailwindcss/vite`）。
- `ConfigProvider` 默认 locale/dir；允许用户覆盖。
- Toast 每请求 manager，`useToast` 自动导入。
- 不自动注册 Reka 组件；不污染全局。
- 支持 Nuxt 4 `ssr: true` 与 `ssr: false`。
- 模块选项类型与文档。

### 文档站

- Nuxt 4 + Nuxt Content 3；Markdown/MDC + 真实 Vue demo。
- 每个公共组件：demo、props/events/slots 表、键盘说明、React → Vue 差异。
- 导航：Getting Started / Components / Theming / Migration / Roadmap。
- 主题切换（light/dark/system）；RTL 示例。
- 搜索（本地索引）。
- 部署到静态托管；构建产物可复现。

### 发布门禁

- `pnpm pack:check`：干净 Vite + Nuxt fixture 安装 tarball。
- 类型检查：`exports` 每个子路径可解析；`arethetypeswrong` 类检查。
- 许可证：根 LICENSE/NOTICE，上游快照 LICENSE/NOTICE，依赖清单。
- 视觉基线：84 个组件（或 MVP 40 先行）截图入库；**补齐 T05 顺延的覆盖层视觉截图**（light/dark × placement × 进出场关键帧）。
- a11y：axe 全量 + 键盘清单抽检。
- Bundle/CSS 体积记录（不设硬 SLA，回归 >10% 需说明）。
- changesets + `0.x` 版本；canary dist-tag。
- GitHub Actions：lint/typecheck/test/contract/ssr/visual 分 job；缓存 pnpm。

## 关键实现点

- **自动导入命名冲突**：`S` 前缀默认；用户组件名冲突时可通过 `prefix` 或显式导入。
- **样式注入顺序**：Tailwind v4 → theme → base → components；与上游 `index.css` 一致。
- **SSR**：模块必须确保 Toast manager 每请求；文档站 SSR 构建不出现 `window` 错误。
- **文档 demo**：使用真实组件，不用截图；demo 源码可展开。
- **API 表**：从类型/元数据生成或手写，必须与 ADR 0007 一致。
- **迁移指南**：与 [migration-from-heroui.md](../../migration-from-heroui.md) 同步。
- **发布说明**：每个包 README 有安装、CSS、Nuxt、License/NOTICE 链接。

## Acceptance

### 模块

- [ ] 新建 Nuxt 4 应用，`modules: ["@sail-ui/nuxt"]` 后 `<SButton>` 可用。
- [ ] `prefix: ""` 时 `<Button>` 可用；无命名冲突。
- [ ] `ssr: true` 页面源码含预期 `data-slot`；关闭覆盖层无 DOM。
- [ ] `ssr: false` 正常。
- [ ] `useToast` 自动导入；两个并发请求不串队列。
- [ ] 模块选项类型与默认值有文档。

### 文档

- [ ] 84 个组件页（或 MVP 40 + 其余标注 coming）。
- [ ] 每页有 demo、API 表、键盘说明、迁移差异。
- [ ] Getting Started 在干净项目可复现。
- [ ] 主题/RTL/SSR 示例可用。
- [ ] 搜索可用；导航无死链。
- [ ] 构建静态产物成功，无 404。

### 发布

- [ ] `pnpm verify` 全绿。
- [ ] `pnpm pack:check` 在 Vite + Nuxt fixture 通过。
- [ ] 所有子路径 exports 与类型解析通过。
- [ ] LICENSE/NOTICE 随包发布；依赖许可证清单完成。
- [ ] 视觉基线入库；CI 可复跑（含覆盖层状态矩阵）。
- [ ] axe 无 critical/serious；键盘清单通过。
- [ ] changesets 版本与 CHANGELOG 生成。
- [ ] canary 发布后，在独立项目安装并渲染成功。
- [ ] README/文档中的安装命令与实际包名一致。

## Demo

1. 新建 `fixtures/nuxt-app`，只装 tarball，运行 `pnpm dev`；
2. 打开文档站，浏览 Button → Modal → Select → Table；
3. 切换 light/dark/RTL；
4. 查看 SSR 页面源码；
5. 安装 canary 并截图。

## Out of scope

- 文档站多语言（先英文 + 中文核心页）；
- 主题市场/在线主题编辑器；
- 独立 CDN / 其他 registry；
- 1.0 语义化版本承诺（MVP 仍 `0.x`）；
- 企业级 SLA/性能承诺。

## Risks

## 进度记录（2026-11-01）

### 已完成

- **切片 A：`@sail-ui/nuxt` 模块**（commit `2259da6`）
  - 构建时从 `@sail-ui/vue` dist 内省全部导出并按 `prefix`（默认 `S`）自动注册，重名 part 去重；注入 styles 入口 + Tailwind v4；`useToast` 自动导入；`wrapApp` 默认通过覆盖 Nuxt 的 `app-component.mjs` 模板挂载 `SailUIProvider`（ConfigProvider + ToastProvider）。nuxt-fixture 已改为纯模块用法。
- **切片 B：发布门禁**（commit `f8dcc6d`）
  - 5 个包 README；`pack:check` 扩展到 4 包 tarball + 消费者类型解析检查（bundler + node16，替代 attw 的 pnpm 伪影）；vue dts 修复（`.vue` 说明符 → `.vue.js`、workspace 别名 → 包名）；changesets（public access）+ `release.yml`（`NPM_PUBLISH_ENABLED` 变量门控）+ `ci.yml`（verify/contract/pack 三 job）。
- **切片 C：文档站**（commits `4bb67ab`、`964a7c9`、`2dc4691`、`256ab09`）
  - `apps/docs`：Nuxt 4 + Nuxt Content 3，英文内容；nitro `cloudflare_module` preset + `wrangler.jsonc`（D1 绑定 `DB`）；上游版式对齐（220px 侧栏/TOC/Inter/prose/代码块，全部取色自 `@sail-ui/styles` 主题变量）；chrome dogfood（SInput 过滤、SLink、SButtonGroup 主题切换，light/dark/system）。
  - **84 个组件页全部交付**（含真实 MDC demo + 核对过的 API 表 + 迁移差异）；总览页与侧栏导航由 `apps/docs/scripts/gen-components.mjs` 从组件矩阵生成（自动检测已交付页面，输出 `app/docs-nav.generated.ts`）。
  - 全文搜索：`/search?q=` 基于 Content 搜索段 + title>heading>body 打分，顶栏过滤框回车即搜。
  - 验证：88 页全 200 sweep（wrangler dev 本地 worker）；docs lint/typecheck/build 全绿；`pnpm verify`、visual 86、browser 348 全绿。

### 剩余任务（按优先级）

1. **覆盖层视觉截图矩阵**（T05 顺延项）：alert-dialog / drawer / sheet / popover / tooltip × light/dark × placement × 进出场关键帧。需要在 `apps/reference-react` 与 `apps/playground` 两侧 gallery 各加 overlay section（Modal/Select 已有，参照 `tests/visual/parity.visual.ts` 的对比模式），并确认进出场关键帧的截图时机（参考 T05 的"entering state before the first frame"测试手法）。
2. **RTL Drawer/Table 冒烟**：roadmap M3 顺延项。Drawer 用现有 `tests/browser/rtl.spec.ts` 的 calendar 模式补；Table 验证虚拟化 RTL 的列方向/键盘。完成后勾掉 roadmap 中 M3 的 RTL 项。
3. **Bundle/CSS 体积记录**：T09 acceptance 中的体积基线（无硬 SLA，回归 >10% 需说明）。
4. **canary 发布**（用户前置动作完成后执行）：
   - 用户：创建 npm `@sail-ui` scope → 仓库 Secrets 配 `NPM_TOKEN` → 仓库 Variables 设 `NPM_PUBLISH_ENABLED=true`；
   - 用户（文档站部署）：`wrangler d1 create sail-ui-docs` → 把 database_id 填入 `apps/docs/wrangler.jsonc` → `pnpm --filter @sail-ui/docs build && npx wrangler deploy`（在 apps/docs 下）；
   - 机器：merge 后 release workflow 走 changesets version + `changeset publish --tag canary`；发布后在干净项目 `pnpm add @sail-ui/vue@canary` 渲染验证（对应 Demo 步骤 5）。

### 续接上下文

- 本地预览：`pnpm --filter @sail-ui/docs build` 后在 `apps/docs` 跑 `npx wrangler dev .output/server/index.mjs --assets .output/public --port 8788`（D1 本地模拟即可）。
- 文档 demo 规范：部件名是**单数**（`TabList` 不是 `TabsList`，`STab-list` 不是 `STabs-list`），写错在 SSR 报 `RovingFocusGroupContext` 注入错误；demo 必须用 playground 已验证的复合结构；模板内 TS 断言（`as const`）必须放在 `<script setup lang="ts">` 里。
- 主题切换写 `<html>` 的 `dark` 类 + `data-theme`；文档站所有取色走 `@sail-ui/styles` 变量，无第二套主题。

| 风险                               | 处理                                                                |
| ---------------------------------- | ------------------------------------------------------------------- |
| Nuxt 自动导入与用户组件冲突        | 默认 `S` 前缀；文档说明                                             |
| Tailwind 扫描/样式注入顺序错误     | 用上游入口顺序；fixture 截图对比                                    |
| 类型导出在 NodeNext/bundler 下失败 | 双 tsconfig fixture；`pack:check`                                   |
| 文档 demo 与代码不同步             | demo 直接 import 源码；CI 构建文档站                                |
| 视觉基线体积/噪音                  | 只存关键状态；压缩；按组件分目录                                    |
| canary 安装发现 workspace 依赖泄漏 | `pnpm pack:check` 检查 dependencies，禁止 workspace: 协议进入发布物 |
| 发布前 scope/商标未确认            | 作为发布阻塞项，未确认不发                                          |
