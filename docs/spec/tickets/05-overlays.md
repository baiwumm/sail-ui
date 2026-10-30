# T05 — 覆盖层与 Toast（7）

- Milestone: M2
- Status: Pending
- Blocked by: [T02](./02-contract-tooling.md)
- Unblocks: [T06](./06-collections-and-pickers.md), [T09](./09-nuxt-docs-release.md)
- Related: [Spec §5.4](../0001-heroui-v3-vue-port.spec.md), [上游审计 §3](../../research/heroui-v3-audit.md), [ADR 0002](../../decisions/0002-behavior-layer-reka-ui.md)

## What to build

交付覆盖层家族：

`alert-dialog`、`drawer`、`modal`、`popover`、`sheet`、`toast`、`tooltip`。

目标是**动画、焦点、层级、SSR 全部正确**，而不是“能弹出来”。覆盖层是 HeroUI 移植中最容易出细微差异的部分。

## Scope

| 组件 | 基础 | 关键行为 |
|---|---|---|
| Modal | Reka Dialog | 焦点陷阱、Esc、遮罩关闭、`data-placement`、退场动画、滚动锁 |
| AlertDialog | Reka AlertDialog | `role="alertdialog"`、默认不可遮罩关闭、确认/取消 |
| Drawer | Reka Drawer | 方向、swipe、拖拽把手、滚动锁 |
| Sheet | Reka Dialog/Drawer | 侧边面板、`data-placement` left/right、尺寸 |
| Popover | Reka Popover | Floating UI 定位、`data-side` vs `data-placement`、箭头、碰撞、嵌套 |
| Tooltip | Reka Tooltip | 延迟、`aria-describedby`、不可交互内容、触摸策略 |
| Toast | Reka Toast | 队列、位置、超时、hover 暂停、Promise、关闭、`data-frontmost`/`data-stack-index` |

## 关键实现点

### 覆盖层状态机

`useOverlayState` 必须提供：

- `isOpen`、`isEntering`、`isExiting`；
- `data-open`、`data-entering`、`data-exiting`；
- exit hold（见 [Spec §5.4](../0001-heroui-v3-vue-port.spec.md)）；
- `shouldSkipAnimation`（初始 open / 减少动画偏好）；
- SSR 关闭态不渲染。

### 层叠与滚动

- modal 级覆盖层（Modal/AlertDialog/Drawer/Sheet）使用 `--z-index-overlay: 100000`；toast 使用 `--z-index-toast: 100001`；popover/tooltip 依赖 portal 层叠，不额外发明更高层级。
- 滚动锁只锁 body，保留滚动条宽度，避免布局跳动；嵌套覆盖层引用计数。
- Teleport 目标可配置（默认 body）；SSR 不输出。

### 定位

- Reka 提供 `data-side` / `data-align`；上游 CSS 可能用 `data-placement`。在组件上补 `data-placement`，不要让 CSS 直接依赖 Floating UI 词汇。
- Popover 的 `data-placement` 值与上游一致（`top`/`bottom`/`left`/`right` + 对齐）。
- 测试碰撞、翻转、箭头、RTL。

### Toast

- 每 app/请求一个 manager；Nuxt plugin 注入，禁止模块级单例。
- 根级 `<ToastProvider />` 负责 viewport 与 manager；Vue 手动挂载，Nuxt module 自动挂载。
- 支持 `useToast()`（返回 `toast` 实例）、`promise()`、`update()`、`dismiss()`；不提供绕过 provider 的全局单例。
- 队列上限、位置、超时、hover/focus 暂停、关闭按钮、`data-frontmost`。
- SSR 不渲染 toast；客户端挂载后才有 viewport。
- 与 Reka Toast 的 `createToastManager` / `useToastManager` 对接，但不泄漏其类型。

### 动画

- 使用上游 CSS 的 `[data-entering]` / `[data-exiting]` 与 keyframes。
- 处理 WebKit pending；不使用固定 `setTimeout` 作为主要机制。
- 支持 `prefers-reduced-motion`。

## Acceptance

- [ ] 7 个组件的 `data-slot` 与上游一致。
- [ ] Modal/AlertDialog/Drawer/Sheet：焦点陷阱、Esc、遮罩、关闭按钮、`aria-modal`、标题关联。
- [ ] Drawer：四个方向、swipe 阈值、把手、嵌套滚动。
- [ ] Popover/Tooltip：定位、碰撞翻转、箭头、嵌套、触摸策略。
- [ ] Toast：队列、超时暂停、Promise、关闭、位置、上限、`data-frontmost`。
- [ ] 退场动画在 Chromium 与 WebKit 下不闪烁、不提前卸载；使用真动画测试。
- [ ] 减少动画偏好下跳过入场/退场，但 DOM 生命周期正确。
- [ ] SSR：关闭态无 DOM；打开后 hydrate 无 mismatch；Toast viewport 不在 server HTML。
- [ ] 每请求 Toast 隔离：两个并发 SSR 请求不共享队列。
- [ ] 浏览器测试：焦点陷阱、Esc、遮罩、定位、动画。
- [ ] 视觉：light/dark × 各 placement × 进出场关键帧截图。
- [ ] axe：无 critical/serious；`aria-hidden` 焦点管理正确。
- [ ] 文档：7 个 demo + 动画/SSR 注意事项。
- [ ] 组件矩阵状态更新。

## Demo

`/overlays` 页面：

1. Modal（默认/底部/居中/无遮罩）；
2. AlertDialog（危险操作）；
3. Drawer（左右上下 + swipe）；
4. Sheet（左侧导航）；
5. Popover + Tooltip（碰撞/RTL）；
6. Toast（普通/成功/错误/Promise/长队列）；
7. 慢速动画开关（0.25x）用于 review。

## Out of scope

- Select/Combobox 的 popover 组合（T06）；
- DatePicker 的日历弹层（T07）；
- Toast 的持久化/跨页路由（不做）；
- 覆盖层内嵌 Table（T08 后另行组合）。

## Risks

| 风险 | 处理 |
|---|---|
| 退场时序在 WebKit/Safari 与 Chromium 不同 | 浏览器双项目；复刻 exit hold；慢速动画回放 |
| Reka Presence 卸载与我们的 `data-exiting` 冲突 | 自己控制 presence，禁用 Reka 的自动 unmount 或包一层 |
| 嵌套覆盖层的滚动锁计数错误 | 引用计数 + 浏览器测试 |
| Toast 模块级单例导致 SSR 串数据 | 每请求 manager；SSR fixture 并发测试 |
| 定位词 `data-side` 与 `data-placement` 混淆 | 组件层统一映射；文档明确 |
| 焦点陷阱在 Teleport 后失效 | 以 Reka FocusScope 为准；打开后手动聚焦首个可聚焦元素 |
</content>
