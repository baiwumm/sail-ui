# T04 — 表单控件（19）

- Milestone: M1
- Status: Pending
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
