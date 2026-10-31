# T07 — 日期 / 颜色与自动完成（15）

- Milestone: M3
- Status: Done（2026-10-31；切片 A–E + 收尾完成）
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

- [x] 15 个组件的 `data-slot` 与上游一致（契约测试 29 项）。
- [x] Calendar：键盘网格（方向键/Home/End/PageUp/PageDown）、不可用日期、跨月、选中/范围、RTL。
- [x] DateField/DatePicker：分段输入、校验、min/max、locale、timezone、清空、关闭回焦。
- [x] RangeCalendar/DateRangePicker：起止选择、反向选择、范围高亮、键盘。
- [x] TimeField：12/24 小时、分钟步进、键盘。
- [x] ComboBox/Autocomplete：过滤、空状态、允许自由输入、异步受控、键盘。
- [x] Color：area/slider/field/swatch 的受控/非受控、格式切换、无效输入、键盘。
- [x] 日期/颜色在 SSR 下 locale/timezone 显式传入时无 mismatch（SSR 18 项）。
- [x] 视觉：light/dark × 打开/关闭/选中/无效 × 各尺寸（`pnpm test:visual` 78 项）。
- [x] 浏览器测试：Calendar 键盘网格、Color 拖动、DatePicker 定位（T07 31 项 × Chromium/WebKit）。
- [x] axe：无 critical/serious（gallery 覆盖 calendar/date-fields/date-pickers/combo-box/colors；上游 color-contrast 由视觉对照逐区块等值守护）。
- [x] 文档：15 个 demo + locale/timezone 说明 + 迁移差异（gallery 位于 playground 与 reference-react；文档站页面顺延 T09）。
- [x] `calendar-year-picker` 标注 preview（若上游仍未稳定）。
- [x] 组件矩阵状态更新。

### T07 切片 B 说明（2026-10-31）

- **交付**：`DateField`、`TimeField`，以及内部 `date-input-group`（root / input / input-container / segment / prefix / suffix）。`date-input-group` 不进公共 API，经 `DateField*` / `TimeField*` 别名导出。Label / Description / FieldError 通过 Sail `fieldContext` 关联 `aria-labelledby` / `aria-describedby`，无需 Reka FieldRoot。
- **分段交互**：Reka 的 as-child 合并会丢弃子节点 ref，Segment 改由自身 DOM 事件（focus/blur/pointer）跟踪 `data-focused` / `data-focus-visible` / `data-hovered`，并复用 `useFocusRing` 的键盘模态规则（新增 `isKeyboardFocusVisible` 辅助函数）。
- **接受的上游差异（parity gaps）**：
  1. Reka 根节点硬编码 `role="group"` 和 `dir`；上游根节点无 role。`data-disabled` / `data-readonly` / `data-invalid` 为 presence 空值（Reka 内部合并顺序优先于消费方属性），因此根节点额外输出 `aria-invalid="true"` / `data-required="true"`，上游 CSS 同样匹配 `[aria-invalid="true"]`，视觉不受影响。
  2. 隐藏 input 嵌在根节点内部（上游为根节点兄弟）；DateField 隐藏 input 的 `type` 在 `day` 粒度下为 `date`，其余粒度 Reka 输出 `datetime-local`；TimeField 隐藏 input 无 `type`，`value` 带秒。
  3. 分段的 `aria-label` 由 Reka 提供英文文案，未本地化；12 小时制的 hour 分段 `aria-valuenow` 使用 24 小时值（如 13），上游显示 1。
- **验证**：date-field 单测 7 + time-field 单测 6；契约 8；SSR 3；浏览器 `tests/browser/date-field.spec.ts` 10 项 × Chromium/WebKit。
- **下一个切片**：DatePicker / DateRangePicker（复用 `date-input-group` 与 T05 弹层）。

### T07 切片 C 说明（2026-10-31）

- **交付**：`DatePicker`（Root / Trigger / TriggerIndicator / Popover）与 `DateRangePicker`（另含 RangeSeparator）。两者复用 T05 的 popover 定位与退出动画，关闭时焦点回到 trigger；`Calendar` / `RangeCalendar` 在 picker 上下文内自动绑定 model、min/max、locale、禁用与不可用日期，并沿用 picker 的 `placeholder` / `weekStartsOn`。
- **字段接线**：Sail picker 根无法注入自己提供的 Reka context，因此内部新增 `date-picker-field` / `date-range-picker-field` 只负责把 Reka picker context 接到 `DateFieldRoot` / `DateRangeFieldRoot`；DOM 根由 field shell 渲染，沿用上游 `data-slot` 与 `data-*` 状态。范围输入以 `slot="start"` / `slot="end"` 字面属性区分（通过 `v-bind` 传入）。
- **接受的上游差异（parity gaps）**：
  1. Reka 的 as-child 只克隆第一个子节点，DateField 的隐藏 input 作为 picker 根节点的兄弟渲染；picker 根自身的属性与插槽不受影响。
  2. popover 对话框以 icon-only trigger 的 `aria-label` 命名，上游以字段 Label 命名。
  3. 范围 picker 的公开值是 `{start?, end?} | null`；键入中的 partial 范围会转发给 Reka（其 context 类型标注为完整 `DateRange`，运行时接受 partial）。
- **验证**：picker 单测 14；契约 6；SSR 2；浏览器 `tests/browser/date-picker.spec.ts` 4 项 × Chromium/WebKit（定位、Escape 回焦、两次点击选范围、禁用）。
- **下一个切片**：ComboBox / Autocomplete。

### T07 切片 D 说明（2026-10-31）

- **交付**：`ComboBox`（Root / InputGroup / Trigger / Value / Popover）与 `Autocomplete`（Root / Trigger / Value / Indicator / ClearButton / Popover / Filter）。二者共用 `ListBox`（combobox 模式）、`EmptyState` 与 `combobox-context`；ComboBox 支持输入过滤、`allowsCustomValue`、受控 `v-model:input-value`、`ignore-filter` 异步结果与 `displayValue` 预解析；Autocomplete 以 trigger + 弹层搜索框呈现，选择值经 `displayValue` / 标签注册回显。
- **contentId 播种**：Reka 在 `ComboboxContent` setup 中非响应式地写入 `rootContext.contentId`，而 trigger/input 往往先渲染。Sail 在最早渲染的 part（AutocompleteTrigger；ComboBox Input 与 Trigger）用 `useId()` 预填 `contentId`，保证关闭态与打开首帧的 `aria-controls` 指向真实 popover id。
- **弹层定位**：Reka `ComboboxContent` 默认 `position="inline"` 时不转发 `asChild`，会包一层持有 role/id/状态的 div；两个 popover 均传 `position="popper"`，让 Sail 的 div 成为内容元素并启用 Floating UI 定位（额外保留 Reka 的 `[data-reka-popper-content-wrapper]` 定位层）。
- **接受的上游差异（parity gaps）**：
  1. Autocomplete 的 trigger 与上游一致渲染为 focus-within `role="group"`，但由 Sail 承担 `tabindex="0"` 与 `aria-expanded` / `aria-haspopup` / `aria-controls`；上游 group 内的 indicator 是无可访问名称的 `<button>`，Sail 将其改为纯装饰元素（图标保留 `data-slot`），避免嵌套交互控件与 button-name 违规。
  2. 关闭态 ComboBox 的输入文本依赖 `displayValue`：item 标签仅在 popover 首次挂载后注册，未提供 `displayValue` 时初始选中值不会回填输入框（上游用常驻 collection）。
  3. Reka 在关闭后延迟 1 tick 重置输入文本；受控拒绝选择时输入框在同一 tick 内仍显示键入值，测试需等待下一 tick。
- **验证**：combo-box 单测 8（含异步 `ignore-filter` + 受控输入）+ autocomplete 单测 7；契约 5；SSR 5；浏览器 `tests/browser/combo-box.spec.ts` 4 项 × Chromium/WebKit（定位、过滤、空状态 + 自由输入、Escape 回焦/清空）。
- **下一个切片**：Color 家族（ColorArea / ColorSlider / ColorField / ColorPicker / ColorSwatch / ColorSwatchPicker）。

### T07 切片 E 说明（2026-10-31）

- **交付**：`ColorArea` / `ColorSlider` / `ColorField` / `ColorPicker` / `ColorSwatch` / `ColorSwatchPicker`，共享 `packages/vue/src/shared/color-context.ts`：`ColorValue = string | Color`，`useColorBinding` 按「显式 model → 外层 ColorPicker context → 内部 ref」解析，`toColor` / `toHex` / `toCssColor` 统一解析与序列化。ColorPicker 组合 area + slide + swatch + field，不导出内部 ColorInputGroup；ColorSwatchPicker 由 Sail 直接组合 `ListboxRoot` + `ListboxContent`，色块沿用 Reka `ColorSwatch`。
- **Reka 集成要点**：
  1. Reka 未公开 `injectColorSwatchPickerItemContext`，SwatchPicker 的 swatch / indicator 通过 Sail 自有的 item context（item 提供 `color`）读取当前颜色。
  2. Reka `ColorSwatchPickerRoot` 会两次触发 `update:modelValue`（内部 v-model + 转发 emits），因此不直接使用该根组件；改为 `ListboxRoot` + `ListboxContent` 组合，保留其 listbox role、roving tabindex 与方向键行为。
  3. 指示器对比度用 `convertToRgb`（`colorToRgb` 返回 rgb() 字符串而非对象）计算亮度，输出 `data-light-color`。
- **接受的上游差异（parity gaps）**：
  1. Reka `ColorAreaRoot` 在 area 外再包一层 `role="group"` / `data-disabled=""` 根节点；area 本身保留 `role="application"`（上游为 slider 语义），拖拽与键盘行为一致。
  2. `ColorSlider` 启用时根节点输出 `aria-disabled="false"`，禁用时 `data-disabled=""`；上游仅在禁用时输出。
  3. `ColorField` 无法表示空颜色，空串输入回退为 `#000000`；上游可能保留空值。
  4. 更新事件按每次 update 触发 `change`，载荷为 hex 字符串而非 RAC `Color`；上游在拖动结束时触发。
  5. SwatchPicker 选项颜色通过 `color` prop 传入（上游 item 以子 `ColorSwatch` 提供）；Reka 在每个选项内额外渲染 `role="img"` 色块；组件无默认可访问名称，需要 `aria-label`。
- **验证**：color 单测 38（6 个测试文件）；契约 3（独立组件 slot 完整性、关闭态无弹层、打开态 popover 属性与嵌套 slot）；SSR 2（关闭态无弹层、id 稳定）；浏览器 `tests/browser/color.spec.ts` 6 项 × Chromium/WebKit（弹层定位 + Escape 回焦、area 拖动、hue 拖动、picker 预设选择、独立色板选择、禁用色板）；axe colors 区块 light/dark 通过。

### T07 收尾说明（2026-10-31）

- **Demo 与文档**：`apps/playground` 与 `apps/reference-react` 新增 5 个 gallery section（`calendar`、`date-fields`、`date-pickers`、`combo-box`、`colors`），覆盖全部 15 个组件；两侧使用相同的 section id、文案与 testid。迁移指南新增 6.10 节（React → Vue 映射、分段复合结构、locale/timezone 规则），并在已知差异表补充日期/颜色的行为差异；文档站 demo 页面顺延到 T09。
- **视觉对照**：新增 5 个 section × light/dark 共 10 项逐像素对比；`pnpm test:visual` 78 项通过，其中 axe color-contrast 对照按区块要求 Vue 与 React 计数完全相等。收尾中修复的差异：
  - DatePicker / DateRangePicker 内部的 Reka `DateFieldRoot` / `DateRangeFieldRoot` 忽略 `as-child` 并额外渲染一个 block 包装层，使 `.date-picker` 行高多 3px；picker field 的包装层改用 `display: contents` 退出布局，截图与 React 完全一致。独立 DateField 不受影响。
  - React 参考应用用 `I18nProvider locale="en-US"` 固定参考语言：`browser.newPage()` 不读取 Playwright 配置的 locale，系统 zh-CN 会让日期文本与 Vue 的 `en` 默认不一致。
  - 参考 ColorArea 显式传入 HSL `color-space` / `x-channel="hue"` / `y-channel="saturation"`；无效态示例改用 hex `ColorField`，因为 RAC 的 channel ColorField 不转发 `isInvalid`。
  - 参考 Due date 字段传 `validationBehavior="aria"`：RAC 默认 `native` 会延迟内置 min/max 校验，而 Reka 初始渲染即标记无效，否则标签/描述可见性会产生 axe 计数差异。
- **门禁**：`pnpm verify` 通过（契约 17 文件 166 测试、单测 67 文件 450 测试、SSR 15 文件 50 测试、构建）；`pnpm test:browser` 292 项（Chromium + WebKit）通过；`pnpm test:visual` 78 项通过。
- **SSR**：calendar 6、date-field 3、date-picker 2、combo-box 5、color 2，均显式传 locale/timezone；关闭的 picker/popover 不输出 DOM，id 由 `useId()` 生成，无 hydration mismatch。
- **仍顺延**：文档站 demo 与迁移页（T09）；ColorArea 默认轴/默认值、hex 字符串大小写、RAC channel `isInvalid` 属行为层差异，已写入迁移指南；日期库适配层（Day.js/date-fns）与时区选择器保持在 Out of scope。

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
