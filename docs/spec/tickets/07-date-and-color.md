# T07 — 日期 / 颜色与自动完成（15）

- Milestone: M3
- Status: Pending
- Blocked by: [T02](./02-contract-tooling.md)
- Unblocks: [T09](./09-nuxt-docs-release.md)
- Related: [ADR 0002](../../decisions/0002-behavior-layer-reka-ui.md), [ADR 0005](../../decisions/0005-table-meter-and-advanced-primitives.md)

## What to build

交付日期、颜色与自动完成家族：

`autocomplete`、`calendar`、`calendar-year-picker`、`combo-box`、`date-field`、`date-picker`、`date-range-picker`、`range-calendar`、`time-field`、`color-area`、`color-field`、`color-picker`、`color-slider`、`color-swatch`、`color-swatch-picker`。

这是“组合型组件”的集中批次：日期弹层依赖 T05，选择逻辑依赖 T06，颜色输入依赖表单上下文。

## Scope

| 组件                                                                                 | 基础                                | 关键行为                                                                            |
| ------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------------------- |
| Calendar / RangeCalendar / CalendarYearPicker                                        | Reka Calendar                       | 键盘网格、月/年切换、不可用日期、`data-outside-view`、`data-today`、`data-selected` |
| DateField / DatePicker / DateRangePicker / TimeField                                 | Reka DateField/DatePicker/TimeField | 分段输入、校验、min/max、locale、timezone、弹层                                     |
| ComboBox / Autocomplete                                                              | Reka Combobox                       | 输入过滤、异步/受控、键盘、允许自由输入、空状态                                     |
| ColorArea / ColorSlider / ColorField / ColorPicker / ColorSwatch / ColorSwatchPicker | Reka Color*                         | 格式（hex/rgb/hsl）、键盘、拖动、色板选择、受控/非受控                              |

## 关键实现点

- **日期算术**统一 `@internationalized/date`；禁止用原生 `Date` 做时区/跨月计算。
- **timezone / locale** 通过 `ConfigProvider`；默认跟随浏览器，SSR 必须可显式传入，避免 server/client 不一致。
- **分段输入**：DateField 的 `data-slot` 与上游一致；无效/不完整状态不冒泡为假值。
- **弹层**：DatePicker 复用 T05 的 popover；关闭时焦点回到输入。
- **Calendar 属性**：`data-outside-month` 通过 compat 别名映射到 Reka `data-outside-view`；`data-current` / `data-today` 按上游核对。
- **Color 格式**：解析/序列化统一用 `@internationalized/color`（或 Reka 依赖）；无效输入显示错误但不崩溃。
- **ColorPicker**：组合 `ColorArea` + `ColorSlider` + `ColorField` + `ColorSwatchPicker`；内部 `ColorInputGroup` 不导出。
- **RTL**：Calendar 方向、ColorSlider、DatePicker 弹层方向。

## Acceptance

- [ ] 15 个组件的 `data-slot` 与上游一致。
- [ ] Calendar：键盘网格（方向键/Home/End/PageUp/PageDown）、不可用日期、跨月、选中/范围、RTL。
- [ ] DateField/DatePicker：分段输入、校验、min/max、locale、timezone、清空、关闭回焦。
- [ ] RangeCalendar/DateRangePicker：起止选择、反向选择、范围高亮、键盘。
- [ ] TimeField：12/24 小时、分钟步进、键盘。
- [ ] ComboBox/Autocomplete：过滤、空状态、允许自由输入、异步受控、键盘。
- [ ] Color：area/slider/field/swatch 的受控/非受控、格式切换、无效输入、键盘。
- [ ] 日期/颜色在 SSR 下 locale/timezone 显式传入时无 mismatch。
- [ ] 视觉：light/dark × 打开/关闭/选中/无效 × 各尺寸。
- [ ] 浏览器测试：Calendar 键盘网格、Color 拖动、DatePicker 定位。
- [ ] axe：无 critical/serious。
- [ ] 文档：15 个 demo + locale/timezone 说明 + 迁移差异。
- [ ] `calendar-year-picker` 标注 preview（若上游仍未稳定）。
- [ ] 组件矩阵状态更新。

## Demo

`/date-color` 页面：

1. Calendar（单月/双月/不可用日期/RTL）；
2. DatePicker / DateRangePicker（locale/timezone 切换）；
3. TimeField（12/24 小时）；
4. ComboBox / Autocomplete（同步/异步/自由输入）；
5. ColorPicker（格式切换/色板/透明度）；
6. 日期 + 颜色组合表单。

## Out of scope

- 日期库适配层（Day.js/date-fns）——只提供 `@internationalized/date` 值；
- 时区选择器组件；
- 颜色历史/吸管（EyeDropper）——若上游没有；
- 日历事件/日程（不是日历组件的能力）；
- 移动端原生日期选择器。

## Risks

| 风险                                      | 处理                                             |
| ----------------------------------------- | ------------------------------------------------ |
| 时区/夏令时边界                           | 固定 `@internationalized/date`；测试 DST fixture |
| SSR locale 不一致                         | 显式传 locale/timezone；禁止默认读 `navigator`   |
| Reka Color API 变动                       | 锁 2.11.0；颜色格式单测                          |
| Calendar 的 `data-outside-month` 映射错误 | 契约测试 + 视觉跨月截图                          |
| ComboBox 异步与受控状态竞态               | 受控优先；取消过期请求的示例                     |
| `calendar-year-picker` 上游未稳定         | 标 preview；不阻塞 MVP                           |
