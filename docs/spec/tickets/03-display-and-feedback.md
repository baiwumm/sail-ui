# T03 — 展示 / 布局 / 反馈（24）

- Milestone: M1
- Status: Done
- Blocked by: [T02](./02-contract-tooling.md)
- Unblocks: [T08](./08-advanced-data.md), [T09](./09-nuxt-docs-release.md)
- Related: [组件矩阵](../../component-matrix.md), [验收矩阵](../../acceptance-matrix.md)

## What to build

交付 24 个以展示、布局、反馈为主的组件，并建立**展示类组件的验收模板**（后续批次复用）：

`alert`、`avatar`、`avatar-group`、`badge`、`breadcrumbs`、`card`、`chip`、`close-button`、`description`、`empty-state`、`error-message`、`field-error`、`fieldset`、`header`、`kbd`、`label`、`link`、`progress-bar`、`progress-circle`、`separator`、`skeleton`、`spinner`、`surface`、`typography`。

完成后，展示画廊页可并排展示 light/dark、sm/md/lg、默认/禁用/无效/加载状态。

## Scope

| 类型      | 组件                                                                                | 要点                                    |
| --------- | ----------------------------------------------------------------------------------- | --------------------------------------- |
| 容器/布局 | card、surface、header、separator、fieldset                                          | 复合结构、`data-slot`、polymorphic `as` |
| 标识      | avatar、avatar-group、badge、chip                                                   | 尺寸、颜色、fallback、堆叠              |
| 导航      | breadcrumbs、link                                                                   | `as`/`asChild`、当前项、禁用            |
| 反馈      | alert、empty-state、error-message、progress-bar、progress-circle、skeleton、spinner | 语义角色、`aria-*`、值/不确定态         |
| 文本/辅助 | label、description、field-error、kbd、typography、close-button                      | 表单关联、`aria-describedby`、关闭按钮  |

## 关键实现点

- **Card**：`CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`；命名导出 + 复合对象；命名导出示例必须进文档。
- **ProgressBar / ProgressCircle**：Reka `ProgressRoot` + 上游 `data-slot`；`aria-valuenow`、`aria-valuetext`；不确定态。
- **Avatar**：`img` 加载失败回退到 initials/icon；`AvatarGroup` 溢出计数；`data-slot` 与上游一致。
- **Breadcrumbs**：语义 `nav` + `ol`/`li`；`aria-current="page"`；分隔符 slot；RTL。
- **Alert**：`role="alert"` 还是 `status` 按上游；关闭按钮与 `data-slot`。
- **Skeleton / Spinner**：`aria-busy` / `role="status"`；减少动画偏好。
- **Field 相关**：`Label` 的 `for`/`id` 关联；`Description` / `FieldError` 由 field 上下文自动生成 id；无 Provider 时也能手动传 id。
- **CloseButton**：`aria-label` 默认值、键盘、`data-slot`。

## Acceptance

- [x] 24 个组件的 `data-slot` 快照与上游一致（`display-feedback.contract.test.ts` 对照 `data-slots.json`）。
- [x] 每个组件的 CSS 依赖 `data-*` 状态正确（`STATE_COVERAGE` 新增 alert/breadcrumbs/close-button/link/progress-bar/progress-circle）。
- [x] 每个组件有 props/events/slots 类型与导出（`index.ts` + 子路径 + barrel）。
- [x] 复合组件（Card、Breadcrumbs、AvatarGroup、Progress）同时提供命名导出与复合对象。
- [x] 受控/非受控（适用者）测试通过。T03 组件没有可切换的受控/非受控状态；Progress 仅受控。
- [x] `as`/`asChild` 组件至少有一个多态渲染测试。
- [x] 所有 `aria-*`/role 与上游一致；axe 非 `color-contrast` 规则无 critical/serious。上游令牌本身的 `color-contrast` 缺口见 Outcome。
- [x] RTL 冒烟：Breadcrumbs、AvatarGroup、ProgressCircle 方向正确（`tests/browser/rtl.spec.ts`）。
- [x] SSR：24 个组件全部可服务端渲染，双渲染一致（`display-feedback.ssr.test.ts`）。
- [x] 视觉：light/dark × 默认/禁用/加载/无效 × sm/md/lg 的画廊截图与 React 参考一致（48/48）。
- [ ] 文档站：24 个 demo + API 表 + 迁移差异。`apps/docs` 尚未创建；按本 ticket 约定以 playground 画廊替代 demo，API 表与迁移差异随 T09 收口。
- [x] 组件矩阵状态更新为 `M1 done`。

## Outcome

- 24 个组件全部落地，并提供命名导出、复合对象与子路径导出；`packages/vue/src/index.ts` 与 `packages/vue/package.json` 同步更新。
- 契约：24 个 `data-slot` 与上游快照一致；`STATE_COVERAGE` 登记每个组件 CSS 需要的 `data-*`。`kbd`/`skeleton` 上游本就无 `data-slot`，未臆造。
- SSR：一页渲染 24 个组件，服务端双渲染 HTML 一致；`FieldError` 的 `aria-describedby` 在挂载后由 Reka 注册，SSR HTML 不含该关联，但无 hydration mismatch。
- 视觉：playground 与 `reference-react` 的 19 个画廊分组 × light/dark、T01 的 Button/Input/Select/Modal 共 48 条视觉对比通过；修复了 `AvatarGroup` 缺失 `avatar-group--grid`、布尔 shorthand 未转换的问题。
- 浏览器：Chromium + WebKit 100 条通过，含 38 条 axe/主题、3 条 RTL、T01 的 9 条行为测试。
- 单元/契约/SSR：`pnpm verify` 通过——unit 119、contract 68、SSR 4；另修复了 Select 单元测试依赖固定 80ms 等待导致的偶发失败，改为 `vi.waitFor` 轮询真实渲染/退出状态，断言未放宽。
- axe：非 `color-contrast` 规则 critical/serious 为 0。`color-contrast` 失败来自上游 HeroUI 3.2.7 令牌，React 参考逐分组计数完全一致（如 breadcrumbs 4.43、card secondary 4.20、chip primary 3.58）；由 `tests/visual/accessibility.visual.ts` 守住 Vue/React 计数一致，不在本 ticket 改上游颜色。
- API/parity gaps：
  - `Fieldset`：上游 React 用原生 `disabled`，Vue 按 AGENTS 统一为 `isDisabled`。
  - `ProgressBar` / `ProgressCircle`：Vue 扩展 `isDisabled`，同时输出 `data-disabled="true"` 与 `aria-disabled="true"`；上游 React 无此 prop，参考页用 `aria-disabled`。
  - `AvatarGroup` 的 `isGrid` 改为普通 `boolean` 类型，确保模板 `is-grid` shorthand 被运行时转换为 `true`。
- 文档偏差：`apps/docs` 不存在，未在本 ticket 搭站点；demo 以 playground 画廊交付，API 表与迁移差异随 T09 补齐。

## Demo

- playground 首页画廊按类型分组（19 个 section，覆盖 24 个组件）；
- 主题：`?theme=dark` 与页头切换按钮（未做 system 三态）；
- 尺寸与交互态同屏展示：sm/md/lg、disabled/invalid/loading/indeterminate；
- 与上游 React 参考的同屏截图对比：`pnpm test:visual`；
- `apps/docs` 站点不在本 ticket 范围，见 Acceptance 偏差。

## Out of scope

- 表单控件行为（T04）；
- 覆盖层（T05）；
- 日期/颜色（T07）；
- 高级数据（T08）；
- 文档站完整导航与搜索（T09 再收口）。

## Risks

| 风险                                                         | 处理                                          |
| ------------------------------------------------------------ | --------------------------------------------- |
| 展示类组件看似简单，但 `as`/`asChild` 与 `$attrs` 透传容易错 | 统一 `cn` + `$attrs` 工具；每个多态组件加测试 |
| Avatar 的图片加载/尺寸在 SSR 下不稳定                        | 固定尺寸 + 本地 fixture；浏览器测试覆盖       |
| ProgressCircle 的 SVG 几何与上游有细微差异                   | 直接复用上游 CSS 变量；截图为验收             |
| Field id 在 SSR/客户端不一致                                 | 统一 `useId()`；禁止 `Math.random()`          |

</content>
