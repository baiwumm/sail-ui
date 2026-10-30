# T04 — 表单控件（19）

- Milestone: M1
- Status: Done
- Blocked by: [T02](./02-contract-tooling.md)
- Unblocks: [T08](./08-advanced-data.md), [T09](./09-nuxt-docs-release.md)
- Related: [ADR 0007](../../decisions/0007-component-api-conventions.md), [验收矩阵](../../acceptance-matrix.md)

## What to build

交付 19 个表单/操作控件，并证明“无头原语 + 属性补齐”在表单场景可行：

`button`、`button-group`、`checkbox`、`checkbox-group`、`form`、`input`、`input-group`、`number-field`、`radio`、`radio-group`、`search-field`、`slider`、`switch`、`switch-group`、`textarea`、`textfield`、`toggle-button`、`toggle-button-group`、`toolbar`。

完成后有一个真实表单页：校验、错误、禁用、受控、键盘提交、重置。

## Scope

| 组件 | 关键行为 |
|---|---|
| Button / ButtonGroup / ToggleButton / ToggleButtonGroup / Toolbar | press、focus-visible、disabled、loading、form 提交类型、方向键 roving tabindex |
| Input / Textarea / Textfield / SearchField / InputGroup | 受控/非受控、清除、前后缀、组合输入法、`aria-describedby` |
| Checkbox / CheckboxGroup | indeterminate、全选、`v-model` 数组、错误 |
| Radio / RadioGroup | 方向键、roving tabindex、`data-selected`、错误 |
| Switch / SwitchGroup | `data-selected`、`data-hovered`、`data-pressed`、`data-focus-visible`（内部 slot 无伪类回退） |
| NumberField | 步进、长按、格式、min/max、无效输入、spinbutton 语义 |
| Slider | 单值/范围、键盘、`data-dragging`、RTL |
| Form | 提交、校验聚合、错误聚焦顺序、`aria-live` |

## 关键实现点

- **Button**：T01 的实现扩展为完整变体/尺寸/加载/图标；`as`/`asChild`；`type` 默认 `button`。
- **useHover / usePress / useFocusRing** 在这里被真正使用：
  - `switch` 的内部 indicator 需要 `data-hovered` / `data-pressed` / `data-focus-visible`；
  - `radio` 的 indicator 需要 `data-hovered` / `data-pressed`；
  - `accordion` 的 trigger 需要 `data-pressed`（T05 复用）。
- **CheckboxGroup**：父级 `value` 数组 + 全选/半选；`indeterminate` 映射 `data-state="indeterminate"`。
- **Input 组合**：`Label` / `Description` / `FieldError` 通过 field context 自动生成 id；不强制 Provider。
- **NumberField**：`@internationalized/number` 格式化；保持上游 `data-slot`。
- **Slider**：Reka Slider 的 `data-dragging` 与上游命名核对；RTL 用 `dir`。
- **Form**：不接管校验库；只提供 `onSubmit` / `onInvalid` / 原生约束集成，错误聚合由用户或示例实现。

## Acceptance

- [ ] 19 个组件的 `data-slot` 快照与上游一致。
- [ ] Button：全部变体/尺寸/loading/disabled/icon-only 截图通过。
- [ ] Checkbox/Radio/Switch：选中、半选、hover、press、focus-visible 的 `data-*` 契约通过。
- [ ] Switch/Radio 的 `useHover` / `usePress` / `useFocusRing` 在触屏与键盘下行为正确。
- [ ] Input/Textarea/Search/Number/Slider 的受控 + 非受控测试通过。
- [ ] 组合输入法（IME）不误触发提交/选择。
- [ ] 表单：提交、校验、错误聚焦、重置、禁用整组。
- [ ] 键盘：Tab 顺序、Space/Enter 激活、方向键切换 radio/toggle、Slider 方向键。
- [ ] RTL：RadioGroup、Slider、ToggleButtonGroup 方向正确。
- [ ] SSR：全部可服务端渲染；id 稳定；无 hydration mismatch。
- [ ] 视觉：light/dark × 默认/hover/focus/disabled/invalid × sm/md/lg。
- [ ] 文档：19 个 demo + API 表 + 与 React 的事件差异。
- [ ] 组件矩阵状态更新。

## Demo

`/forms` 示例页包含：

1. 登录表单（Input + Label + Error + Button）；
2. 设置表单（SwitchGroup + RadioGroup + Slider + NumberField）；
3. 搜索框（SearchField + 清除 + 提交）；
4. 工具栏（Toolbar + ToggleButtonGroup）；
5. 全禁用 + 全错误两种极端状态。

## Outcome

- 19 个组件全部落地。`button`、`input`、`textfield` 三个 T01 组件补齐了 `as`/`asChild`、表单 `type`、受控/非受控、hover/focus 状态与 IME 守卫；其余 16 个为新增，均提供命名导出、复合对象、子路径导出与 `packages/vue/package.json` 的 exports 条目。
- 契约：`packages/vue/src/__tests__/form-controls.contract.test.ts` 对照 `data-slots.json` 校验 19 个组件的 slot，并断言每个上游 slot 都被渲染；`STATE_COVERAGE` 登记了 T04 全部 CSS 依赖的 `data-*`（断言项与真实 gap 及原因）。`form` 上游本就没有 `data-slot`，未臆造。
- DOM：Checkbox / Radio / Switch 采用**自研**结构（`<label>` + 视觉隐藏的原生 `input`），与上游 React Aria 的输出逐属性对齐（`data-selected` / `data-indeterminate` / `data-pressed` / `data-hovered` / `data-focus-visible` / `data-disabled` / `data-invalid`）。Reka 的 `CheckboxRoot` / `RadioGroupItem` / `SwitchRoot` 渲染的是 `<button role="checkbox|radio|switch">`，与上游 DOM 不同，因此未采用；RadioGroup 依赖原生 radio 组的浏览器行为获得方向键切换与 roving tabindex。
- 视觉：playground 与 `reference-react` 的 `#forms` 区块（登录、设置、搜索、工具栏、全禁用/全错误 5 个场景）在 light 与 dark 下 **0 像素差**；`pnpm test:visual` 50 条全部通过。
- 浏览器：Chromium 64 条通过（新增 `tests/browser/form-controls.spec.ts` 12 条：IME 不误提交、触屏 hover 不粘滞、press 与 click 分离、Radio/Toolbar 方向键、Slider 拖拽与步进、ToggleButtonGroup 选中态、SearchField 清除）。本机没有 WebKit 运行时，`PLAYWRIGHT_CHANNEL=chrome` 只跑了 Chromium；WebKit 需要 CI 复核。
- axe：`#forms` 区块在 light/dark 下非 `color-contrast` 规则 critical/serious 为 0；`color-contrast` 逐分组计数与 React 参考一致。
- 单元/契约/SSR：`pnpm verify` 通过——unit 183、contract 97、SSR 6。
- API / parity 偏差：
  - `Checkbox` 的半选状态映射为 `data-indeterminate="true"`（上游 CSS 选择的是 `[data-indeterminate]`），不是 `data-state="indeterminate"`。
  - `ToggleButtonGroup` 单选模式使用 `role="radiogroup"` + `role="radio"`（与上游一致），多选模式使用 `role="group"` + `aria-pressed`；上游多选模式的组角色是 `toolbar`。
  - `ToggleButtonGroup` 的 `value` 对应上游 React 的 `id`；选择模式用 `type="single" | "multiple"`，对应上游的 `selectionMode`。
  - Reka 的 `RadioGroupItem` 会在按钮上渲染 `required="false"`（Reka 自身的产物，HTML 上无效但无副作用）。
  - `Textarea` 的自适应高度是可选的 `autoResize`（默认关闭），因为上游 React Aria 的 TextArea 不自动增高，开启会破坏与参考实现的视觉一致性。
  - `NumberField` 的 group 不会自动继承 `data-invalid`，与上游一致（上游从未给 group 设置该属性，CSS 中该分支实际不可达）。
  - `Form` 不接管校验库，也不阻止默认提交；`@submit` 透传原生事件，`@invalid` 在捕获阶段监听。
  - 未新增 `@internationalized/number` 直接依赖：Reka 的 `NumberFieldRoot` 已经在内部使用它（当前树中为 3.6.9），格式化、min/max、步进与 spinbutton 语义全部由 Reka 提供。
- 文档偏差：`apps/docs` 不存在，未在本 ticket 搭站点；demo 以 playground 的 `#forms` 区块 + `reference-react` 同构页面交付，19 个 demo/API 表/迁移差异随 T09 收口。

## Out of scope

- Select / Combobox（T06）；
- 日期/颜色输入（T07）；
- Table 内联编辑（T08）；
- 表单库适配（React Hook Form / Zod 集成文档不做）。

## Risks

| 风险 | 处理 |
|---|---|
| `useHover` 在触屏上误触发 | 只在 `(hover: hover)` 且非 touch 时启用；浏览器测试覆盖 |
| `usePress` 与原生 click 双触发 | 统一 press 语义；文档说明 `@press` vs `@click` |
| IME 组合期间 Enter 误提交 | 检查 `isComposing`；测试覆盖中文/日文输入 |
| CheckboxGroup 的 indeterminate 级联 | 明确“全选/半选”规则；单测覆盖 |
| Reka NumberField 与上游格式化差异 | 用 `@internationalized/number`；固定 locale fixture |
| 表单错误 id 在 SSR 下重复 | `useId()` + field context；禁止手写随机 id |
</content>
