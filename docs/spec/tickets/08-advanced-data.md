# T08 — 高级数据（Table / Meter / ScrollShadow / OTP）

- Milestone: M3
- Status: Pending
- Blocked by: [T03](./03-display-and-feedback.md), [T04](./04-form-controls.md)
- Unblocks: [T09](./09-nuxt-docs-release.md)
- Related: [ADR 0005](../../decisions/0005-table-meter-and-advanced-primitives.md), [组件矩阵](../../component-matrix.md)

## What to build

交付 4 个高风险/高级组件：

`table`、`meter`、`scroll-shadow`、`input-otp`。

Table 是最大的一块：必须同时满足数据模型、2D 键盘导航、ARIA grid、排序/选择、列宽、虚拟化、LoadMore。Meter 与 ScrollShadow 是“没有合适原语”的自研件。OTP 是 PinInput 的契约封装。

## Scope

| 组件 | 基础 | 必须交付 |
|---|---|---|
| Table | TanStack Vue Table + 自研 DOM/ARIA | Root/ScrollContainer/Content/Header/Column/Body/Row/Cell/Footer/Empty；排序、单选/多选、键盘、列宽、虚拟化、LoadMore、粘性表头 |
| Meter | 自研 | `role="meter"`、`aria-valuemin/max/now/valuetext`、`showValueLabel`、格式化 |
| ScrollShadow | 自研 `useScrollShadow` | 上/下/左/右阴影、`visibility`、`offset`、`size`、`orientation`、`hideScrollBar` |
| InputOtp | Reka PinInput | 长度、分组、粘贴、键盘、完成态、`data-complete`、受控/非受控 |

## 关键实现点

### Table

- **ARIA**：`role="grid"`，行/列/单元格角色与索引；`aria-sort`；`aria-selected`；可聚焦网格。
- **键盘**：方向键移动、Home/End、PageUp/PageDown、Ctrl+Home/End、Enter 进入/选择、Space 选择、Shift+方向键范围选择（若上游支持）。
- **选择**：单选/多选、全选、禁用行、受控 `selectedKeys`。
- **排序**：`sortDescriptor` + `@update:sort-descriptor`；列头按钮与 `aria-sort`。
- **列宽**：pointer drag + CSS 变量；键盘调整（可选）；持久化不内置。
- **虚拟化**：`@tanstack/vue-virtual`；固定行高；滚动容器同步；键盘滚动到可见。
- **LoadMore**：`@load-more` + loading 状态；用户控制数据。
- **空状态/加载**：`TableEmpty` / `TableLoading` 的 `data-slot` 与上游一致（若上游存在）。
- **粘性表头**：CSS + scroll container；不改变 DOM 结构。

### Meter

- 不伪装 progressbar；`role="meter"` 只在支持该 role 的浏览器/AT 组合中生效。
- 高/低值区间（若上游支持）用 `data-low` / `data-high` / `data-optimum`。
- 值文本格式化；`aria-valuetext`。

### ScrollShadow

- `ResizeObserver` + `scroll` 节流（rAF）。
- 输出上游属性（`data-top-scroll` / `data-bottom-scroll` / `data-left-scroll` / `data-right-scroll`，以实际 CSS 为准）。
- `visibility` 控制模式与 `onVisibilityChange`。
- 无 JS / SSR：不输出阴影属性，内容可滚动。

### InputOtp

- 粘贴整段、方向键、Backspace、完成回调、`data-complete`。
- 分组渲染（如 3+3）；`aria-label` 每个输入。
- 受控/非受控；只允许数字/字母按上游配置。

## Acceptance

- [ ] 4 个组件的 `data-slot` 与上游一致。
- [ ] Table：网格角色/索引正确；键盘矩阵逐项通过；排序/选择/禁用；空状态/加载。
- [ ] Table：列宽拖拽、虚拟化滚动、LoadMore、粘性表头在 Chromium/WebKit 下通过。
- [ ] Table：受控 `selectedKeys` / `sortDescriptor` 与非受控模式。
- [ ] Table：1000 行虚拟化无掉帧级卡顿（录制/Probe 证据，不做绝对 SLA）。
- [ ] Meter：role/aria 值正确；`showValueLabel`；格式化；极端值。
- [ ] ScrollShadow：四方向阴影、阈值、`visibility` 模式、动态内容 resize。
- [ ] InputOtp：粘贴/键盘/完成态/分组/受控。
- [ ] SSR：4 个组件可服务端渲染；Table 的初始行/列可输出；无 mismatch。
- [ ] 视觉：Table 各状态、Meter 各颜色、ScrollShadow 各方向、OTP 各状态。
- [ ] 浏览器测试：Table 键盘/列宽/虚拟化；ScrollShadow 滚动；OTP 粘贴。
- [ ] axe：Table grid 语义、Meter、OTP 无 critical/serious。
- [ ] 文档：4 个 demo + Table 数据契约 + 虚拟化说明。
- [ ] 组件矩阵状态更新。

## Demo

`/data` 页面：

1. Table：基础/排序/多选/空/加载/列宽/虚拟化/LoadMore；
2. Meter：不同颜色/阈值/格式化；
3. ScrollShadow：水平/垂直/双向/禁用；
4. InputOtp：4/6 位、分组、粘贴、完成。

## Out of scope

- 服务端分组/聚合、行拖拽、单元格编辑、列固定（上游没有）；
- Table 的 CSV 导出/打印；
- Meter 的动画数值（若上游没有）；
- ScrollShadow 的滚动条自定义皮肤（用上游 CSS）；
- OTP 的短信/验证码发送逻辑。

## Risks

| 风险 | 处理 |
|---|---|
| Table 键盘/ARIA 复杂度被低估 | 单独评审；键盘矩阵先写测试；必要时缩窄列宽/虚拟化范围 |
| TanStack 与 RAC 的集合模型差异 | 只借数据模型，DOM/ARIA 自建；不强行对齐内部 |
| 虚拟化 + 粘性表头 + 列宽组合 | 分阶段：基础 → 列宽 → 虚拟化 → 组合 |
| ScrollShadow 的 ResizeObserver 性能 | rAF 节流；只观察容器与内容尺寸 |
| OTP 粘贴在移动端差异 | 浏览器测试；保留逐格输入兜底 |
| Meter role 兼容性 | 保留 `aria-valuetext`；文档说明 AT 支持差异 |
</content>
