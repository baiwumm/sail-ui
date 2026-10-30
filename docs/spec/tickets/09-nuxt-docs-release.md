# T09 — Nuxt module + 文档站 + 发布门禁

- Milestone: M4
- Status: Pending
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
- 视觉基线：84 个组件（或 MVP 40 先行）截图入库。
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
- [ ] 视觉基线入库；CI 可复跑。
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

| 风险 | 处理 |
|---|---|
| Nuxt 自动导入与用户组件冲突 | 默认 `S` 前缀；文档说明 |
| Tailwind 扫描/样式注入顺序错误 | 用上游入口顺序；fixture 截图对比 |
| 类型导出在 NodeNext/bundler 下失败 | 双 tsconfig fixture；`pack:check` |
| 文档 demo 与代码不同步 | demo 直接 import 源码；CI 构建文档站 |
| 视觉基线体积/噪音 | 只存关键状态；压缩；按组件分目录 |
| canary 安装发现 workspace 依赖泄漏 | `pnpm pack:check` 检查 dependencies，禁止 workspace: 协议进入发布物 |
| 发布前 scope/商标未确认 | 作为发布阻塞项，未确认不发 |
</content>
