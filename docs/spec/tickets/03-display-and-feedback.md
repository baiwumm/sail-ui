# T03 — 展示 / 布局 / 反馈（24）

- Milestone: M1
- Status: Pending
- Blocked by: [T02](./02-contract-tooling.md)
- Unblocks: [T08](./08-advanced-data.md), [T09](./09-nuxt-docs-release.md)
- Related: [组件矩阵](../../component-matrix.md), [验收矩阵](../../acceptance-matrix.md)

## What to build

交付 24 个以展示、布局、反馈为主的组件，并建立**展示类组件的验收模板**（后续批次复用）：

`alert`、`avatar`、`avatar-group`、`badge`、`breadcrumbs`、`card`、`chip`、`close-button`、`description`、`empty-state`、`error-message`、`field-error`、`fieldset`、`header`、`kbd`、`label`、`link`、`progress-bar`、`progress-circle`、`separator`、`skeleton`、`spinner`、`surface`、`typography`。

完成后，展示画廊页可并排展示 light/dark、sm/md/lg、默认/禁用/无效/加载状态。

## Scope

| 类型 | 组件 | 要点 |
|---|---|---|
| 容器/布局 | card、surface、header、separator、fieldset | 复合结构、`data-slot`、polymorphic `as` |
| 标识 | avatar、avatar-group、badge、chip | 尺寸、颜色、fallback、堆叠 |
| 导航 | breadcrumbs、link | `as`/`asChild`、当前项、禁用 |
| 反馈 | alert、empty-state、error-message、progress-bar、progress-circle、skeleton、spinner | 语义角色、`aria-*`、值/不确定态 |
| 文本/辅助 | label、description、field-error、kbd、typography、close-button | 表单关联、`aria-describedby`、关闭按钮 |

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

- [ ] 24 个组件的 `data-slot` 快照与上游一致。
- [ ] 每个组件的 CSS 依赖 `data-*` 状态正确（契约测试）。
- [ ] 每个组件有 props/events/slots 类型与导出。
- [ ] 复合组件（Card、Breadcrumbs、AvatarGroup、Progress）同时提供命名导出与复合对象。
- [ ] 受控/非受控（适用者）测试通过。
- [ ] `as`/`asChild` 组件至少有一个多态渲染测试。
- [ ] 所有 `aria-*`/role 与上游一致；axe 无 critical/serious。
- [ ] RTL 冒烟：Breadcrumbs、AvatarGroup、ProgressCircle 方向正确。
- [ ] SSR：24 个组件全部可服务端渲染，无 hydration mismatch。
- [ ] 视觉：light/dark × 默认/禁用/加载/无效 × sm/md/lg 的截图通过。
- [ ] 文档站：24 个 demo + API 表 + 迁移差异。
- [ ] 组件矩阵状态更新为 `M1 done`。

## Demo

- `/components` 画廊页按类型分组；
- 主题切换（light/dark/system）；
- 尺寸切换（sm/md/lg）；
- 交互态开关（disabled/invalid/loading）；
- 与上游 React 参考的同屏截图对比。

## Out of scope

- 表单控件行为（T04）；
- 覆盖层（T05）；
- 日期/颜色（T07）；
- 高级数据（T08）；
- 文档站完整导航与搜索（T09 再收口）。

## Risks

| 风险 | 处理 |
|---|---|
| 展示类组件看似简单，但 `as`/`asChild` 与 `$attrs` 透传容易错 | 统一 `cn` + `$attrs` 工具；每个多态组件加测试 |
| Avatar 的图片加载/尺寸在 SSR 下不稳定 | 固定尺寸 + 本地 fixture；浏览器测试覆盖 |
| ProgressCircle 的 SVG 几何与上游有细微差异 | 直接复用上游 CSS 变量；截图为验收 |
| Field id 在 SSR/客户端不一致 | 统一 `useId()`；禁止 `Math.random()` |
</content>
