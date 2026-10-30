# T05 — 覆盖层与 Toast（7）

- Milestone: M2
- Status: Completed
- Blocked by: [T02](./02-contract-tooling.md)
- Unblocks: [T06](./06-collections-and-pickers.md), [T09](./09-nuxt-docs-release.md)
- Related: [Spec §5.4](../0001-heroui-v3-vue-port.spec.md), [上游审计 §3](../../research/heroui-v3-audit.md), [ADR 0002](../../decisions/0002-behavior-layer-reka-ui.md)

## What to build

交付覆盖层家族：

`alert-dialog`、`drawer`、`modal`、`popover`、`sheet`、`toast`、`tooltip`。

目标是**动画、焦点、层级、SSR 全部正确**，而不是“能弹出来”。覆盖层是 HeroUI 移植中最容易出细微差异的部分。

## Scope

| 组件        | 基础                            | 关键行为                                                                         |
| ----------- | ------------------------------- | -------------------------------------------------------------------------------- |
| Modal       | Reka Dialog                     | 焦点陷阱、Esc、遮罩关闭、`data-placement`、退场动画、滚动锁                      |
| AlertDialog | Reka AlertDialog                | `role="alertdialog"`、默认不可遮罩关闭、确认/取消                                |
| Drawer      | Reka Dialog 原语 + 上游拖拽逻辑 | 方向、swipe、拖拽把手、滚动锁                                                    |
| Sheet       | Reka Dialog + 自研 motion/拖拽  | 侧边/底部面板、`data-placement`、把手拖拽、进出场                                |
| Popover     | Reka Popover                    | Floating UI 定位、`data-side` vs `data-placement`、箭头、碰撞、嵌套              |
| Tooltip     | Reka Tooltip                    | 延迟、`aria-describedby`、不可交互内容、触摸策略                                 |
| Toast       | Reka Toast                      | 队列、位置、超时、hover 暂停、Promise、关闭、`data-frontmost`/`data-stack-index` |

## 已定决策（2026-10-30）

| 决策                  | 结论                                                                                                                                                                                                             | 理由                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 覆盖层 Trigger 的 DOM | 对齐上游：Modal / AlertDialog 为 `div role="button"`，Drawer 为原生 `<button>`（上游使用 ButtonPrimitive），Sheet 无上游 trigger、使用原生 `<button>` 且不输出 `data-slot`；键盘 / 按压 / 禁用语义走 composables | 上游 CSS 与 a11y 合约按元素 / role 选择元素，`data-slot` 必须挂在与上游一致的节点                                                                                                               |
| Drawer 基础           | 复用 Reka `DialogRoot` / `DialogContent` 等原语，拖拽手势移植上游阈值与目标规则                                                                                                                                  | Reka `DrawerRoot` 的内建 swipe 只写内容 CSS 变量，DOM 与退出 `translate` 合约不同；上游 8px / 30% / 0.5px/ms 阈值及 handle/header/footer 限定需逐项保留                                         |
| 实现顺序              | Modal 加固 → Toast → AlertDialog / Drawer / Sheet → Popover / Tooltip                                                                                                                                            | Modal 是其余 modal 级覆盖层的状态机、动画与测试基线                                                                                                                                             |
| Sheet 的基础          | 复用 Reka `DialogRoot` / `DialogContent` + Reka 滚动锁与焦点陷阱；面板用原生 CSS 定位，进出场用 WAAPI，把手拖拽移植上游阈值                                                                                      | 上游 Sheet 依赖 React Aria 的 scroll-snap 容器，CSS 不含定位与进出场动画；Reka `DrawerRoot` 的 DOM/CSS 变量也不合上游合约。T05 不实现 snap points / detached / 嵌套 sheet，只保留方向与把手拖拽 |
| Modal 根节点          | `ModalRoot` 仅 provide/inject，不输出 DOM                                                                                                                                                                        | 上游 `modal-root` 无对应元素；避免多出契约节点                                                                                                                                                  |
| Trigger 不包 Reka     | `ModalTrigger` 自行实现 `div role="button"`，不经过 `DialogTrigger`（`as-child` 的 `Slot` 会删除子节点 `ref`，导致 Sail 交互 composable 失联）                                                                   | 保留 `useHover` / `usePress` / `useFocusRing`；焦点恢复由 `ModalRoot` 在卸载后手动执行                                                                                                          |
| Toast API             | `ToastProvider` + `useToast()`，队列由 Sail 自研 `ToastQueue` 实现，每 app / 请求创建                                                                                                                            | Reka Toast 不满足上游堆叠、退出保持与原位更新合约；SSR 隔离；不泄漏 Reka 类型                                                                                                                   |
| Popover Trigger       | 自研 `div role="button"`，注入 Reka `PopoverRoot` 提供 `triggerId` / `contentId` / `triggerElement`；Content 通过 `reference` 定位                                                                               | `PopoverTrigger` 默认渲染 `<button>` 且 `as-child` 的 `Slot` 会删除子节点 `ref`；自研 trigger 保留 Sail 的 focus-ring 状态与 `<div>` 合约                                                       |
| Popover Content 语义  | Reka `PopoverContent` 固定输出 `role="dialog"` 与 `aria-labelledby`；`PopoverDialog` 只输出 `.popover__dialog` 与 `data-slot`                                                                                    | Reka 在 `PopoverContentImpl` 内硬编码 dialog 语义，无法通过 attrs 覆盖；上游 Dialog 拥有语义。差异记入迁移文档，CSS 与 data-slot 不受影响                                                       |
| Tooltip 计时          | 延迟与关闭延迟由 Sail 管理，默认读取 `--tooltip-delay`（1500ms）与 `--tooltip-close-delay`（500ms）；根节点内部渲染 `TooltipProvider`                                                                            | Reka `TooltipTrigger` 无 close-delay 与 `trigger="focus"` 模式；自研 trigger 复刻 hover/focus/触摸语义并维持 hoverable 内容的 grace area                                                        |
| Tooltip 语义          | Reka `TooltipContent` 追加隐藏 `role="tooltip"` 节点供 `aria-describedby` 引用                                                                                                                                   | 可见内容不承担 role；与 RAC 的可交互 tooltip 结构不同但屏幕阅读器行为一致                                                                                                                       |
| 箭头旋转              | Reka `PopperArrow` 的 span 已按 side 旋转；上游 CSS 再旋转 svg，因此在 svg 上内联 `rotate: 0deg` 抵消二次旋转                                                                                                    | 保留 Reka 的 Floating UI 箭头定位与上游的 `data-slot` / fill / stroke 规则                                                                                                                      |
| 减少动态效果          | `useOverlayState` 内部检测 `prefers-reduced-motion`，跳过入场 / 退场动画但保留挂载生命周期                                                                                                                       | 一处修复覆盖全部覆盖层                                                                                                                                                                          |

## 关键实现点

### 覆盖层状态机

`useOverlayState` 必须提供：

- `isOpen`、`isEntering`、`isExiting`；
- `data-open`、`data-entering`、`data-exiting`；
- exit hold（见 [Spec §5.4](../0001-heroui-v3-vue-port.spec.md)）；
- `shouldSkipAnimation`（初始 open / 减少动画偏好；`useOverlayState` 已自动检测 `prefers-reduced-motion`，`shouldSkipAnimation` 可强制覆盖）；
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

- 每 app/请求一个队列；Nuxt plugin 注入，禁止模块级单例。
- 根级 `<ToastProvider />` 负责 viewport 与队列；Vue 手动挂载，Nuxt module 自动挂载。
- 支持 `useToast()`（返回 `toast` 实例）、`promise()`、`update()`、`close()`/`clear()`；不提供绕过 provider 的全局单例。
- 队列上限、位置、超时、hover/focus 暂停、关闭按钮、`data-frontmost`。
- SSR 不渲染 toast；客户端挂载后才有 viewport。
- 不直接使用 Reka Toast 原语：其 `data-*` 词汇、退场生命周期与原位更新的超时重置都不满足上游合约。`ToastQueue` 自行复刻 `createToastManager` 的公开行为（暂停/恢复计时、退出保持、Promise 更新、减少动画），只对外暴露 Sail 类型。

### 动画

- 使用上游 CSS 的 `[data-entering]` / `[data-exiting]` 与 keyframes。
- 处理 WebKit pending；不使用固定 `setTimeout` 作为主要机制。
- 支持 `prefers-reduced-motion`。

## Acceptance

- [x] 7 个组件的 `data-slot` 与上游一致。
- [x] Modal/AlertDialog/Drawer/Sheet：焦点陷阱、Esc、遮罩、关闭按钮、`aria-modal`、标题关联。
- [x] Drawer：四个方向、swipe 阈值、把手、嵌套滚动。
- [ ] Popover/Tooltip：定位、碰撞翻转、箭头、嵌套、触摸策略。
- [x] Toast：队列、超时暂停、Promise、关闭、位置、上限、`data-frontmost`。
- [ ] 退场动画在 Chromium 与 WebKit 下不闪烁、不提前卸载；使用真动画测试。
- [x] 减少动画偏好下跳过入场/退场，但 DOM 生命周期正确。
- [x] SSR：关闭态无 DOM；打开后 hydrate 无 mismatch；Toast viewport 不在 server HTML。
- [x] 每请求 Toast 隔离：两个并发 SSR 请求不共享队列。
- [x] 浏览器测试：焦点陷阱、Esc、遮罩、定位、动画。
- [ ] 视觉：light/dark × 各 placement × 进出场关键帧截图。
- [ ] axe：无 critical/serious；`aria-hidden` 焦点管理正确。
- [ ] 文档：7 个 demo + 动画/SSR 注意事项。
- [x] 组件矩阵状态更新。

### T05 收尾说明（2026-10-30）

- Popover 的基础定位、翻转与箭头已由浏览器测试覆盖；popover 内再嵌 popover 与 Tooltip 的触摸策略未在 T05 实现。
- 覆盖层视觉截图尚未纳入 `tests/visual`（当前 harness 只覆盖 Gallery 组件），后续在 T09 文档站补齐。
- 本机缺少 Playwright WebKit 二进制，浏览器测试仅在 Chromium 运行；CI 需运行 WebKit 项目以验证退出动画。

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
- 覆盖层内嵌 Table（T08 后另行组合）；
- Sheet 的 snap points、detached 模式、`data-has-descendants` 嵌套堆叠与 React Aria scroll-snap 容器（后续 ticket）。

## Risks

| 风险                                           | 处理                                                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 退场时序在 WebKit/Safari 与 Chromium 不同      | 浏览器双项目；复刻 exit hold；慢速动画回放                                                         |
| Reka Presence 卸载与我们的 `data-exiting` 冲突 | 自己控制 presence，禁用 Reka 的自动 unmount 或包一层                                               |
| 嵌套覆盖层的滚动锁计数错误                     | 引用计数 + 浏览器测试                                                                              |
| Toast 模块级单例导致 SSR 串数据                | 每请求 manager；SSR fixture 并发测试                                                               |
| 定位词 `data-side` 与 `data-placement` 混淆    | 组件层统一映射；文档明确                                                                           |
| 焦点陷阱在 Teleport 后失效                     | 以 Reka FocusScope 为准；打开后手动聚焦首个可聚焦元素                                              |
| Sheet 上游没有 CSS 进出场动画                  | Sail 用 WAAPI 复刻 500ms `cubic-bezier(0.32, 0.72, 0, 1)`；浏览器测试验证 transform 归零与减动跳过 |
