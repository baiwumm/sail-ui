# 组件矩阵

- 上游：HeroUI `3.2.7` / `89cd95ec1`
- 公共组件：**84**（另有 2 个内部组合 `color-input-group`、`date-input-group`，以及内部目录 `rac`、`icons`，不计入公共 API）
- 里程碑：M1 = 展示 + 表单；M2 = 覆盖层 + 集合；M3 = 日期/颜色/高级数据；M4 = 模块/文档/发布
- `MVP` = 核心 40 组件（对外承诺的第一版能力）
- 状态：`Spec` = 仅有设计；`M0` = spike；`WIP`；`Done`。实现后更新此列。

## 展示 / 布局 / 反馈（24）

| 组件 | Reka 基础 | 里程碑 | MVP | 备注 |
|---|---|---|---|---|
| `alert` | 自研 | M1 | ✅ | `role` 按上游；关闭按钮 |
| `avatar` | `AvatarRoot` / `AvatarImage` / `AvatarFallback` | M1 | ✅ | 图片失败回退、尺寸 |
| `avatar-group` | 自研 | M1 | ✅ | 堆叠、溢出计数 |
| `badge` | 自研 | M1 | ✅ | 颜色/尺寸/位置 |
| `breadcrumbs` | 自研 | M1 | | `nav` + `aria-current`；RTL |
| `card` | 自研 | M1 | ✅ | 复合：Header/Title/Description/Content/Footer |
| `chip` | 自研 | M1 | ✅ | 可关闭、颜色 |
| `close-button` | 自研（`asChild`） | M1 | | 默认 `aria-label` |
| `description` | `FieldDescription` | M1 | ✅ | 与 Field 上下文关联 |
| `empty-state` | 自研 | M1 | | 图标/标题/描述/动作 |
| `error-message` | 自研 | M1 | | 语义与上游一致 |
| `field-error` | `FieldError` | M1 | ✅ | 错误 id、`aria-live` |
| `fieldset` | 自研 | M1 | | `role="group"` / legend |
| `header` | 自研 | M1 | | 页面/区块标题 |
| `kbd` | 自研 | M1 | | 组合键渲染 |
| `label` | `FieldLabel` / `Label` | M1 | ✅ | `for`/`id` 关联 |
| `link` | 自研（`asChild`） | M1 | ✅ | `href`/禁用/外链 |
| `progress-bar` | `ProgressRoot` | M1 | | `aria-valuenow`、不确定态 |
| `progress-circle` | `ProgressRoot` + SVG | M1 | | 几何/描边 |
| `separator` | `Separator` | M1 | ✅ | orientation/decorative |
| `skeleton` | 自研 | M1 | ✅ | 减少动画偏好 |
| `spinner` | 自研 | M1 | ✅ | `role="status"` |
| `surface` | 自研 | M1 | | 容器/层级 |
| `typography` | 自研 | M1 | | 变体/`as` |

## 表单 / 操作（19）

| 组件 | Reka 基础 | 里程碑 | MVP | 备注 |
|---|---|---|---|---|
| `button` | 自研（`Toggle` 复用 press） | M1（M0 spike） | ✅ | 变体/尺寸/loading/icon-only；T01 已验证 |
| `button-group` | 自研 | M1 | ✅ | 组合、分隔、方向 |
| `checkbox` | `CheckboxRoot` | M1 | ✅ | indeterminate |
| `checkbox-group` | `CheckboxGroupRoot` | M1 | ✅ | 全选/半选、数组 `v-model` |
| `form` | `FormRoot` / 原生 form | M1 | ✅ | 提交/校验聚合 |
| `input` | 自研 + `FieldControl` | M1（M0 spike） | ✅ | 前后缀、清除、IME；T01 已验证（label/description/error 组合） |
| `input-group` | 自研 | M1 | | 组合输入与按钮 |
| `number-field` | `NumberFieldRoot` | M1 | ✅ | 步进/格式/min-max |
| `radio` | `RadioGroupItem` / `RadioGroupIndicator` | M1 | ✅ | 内部 indicator 需 useHover/usePress |
| `radio-group` | `RadioGroupRoot` | M1 | ✅ | 方向键、roving tabindex |
| `search-field` | 自研 | M1 | ✅ | 清除/提交 |
| `slider` | `SliderRoot` | M1 | ✅ | 单值/范围/RTL |
| `switch` | `SwitchRoot` | M1 | ✅ | 内部 slot 需 3 个 composable |
| `switch-group` | 自研 | M1 | | 分组/方向 |
| `textarea` | 自研 | M1 | ✅ | 自适应高度 |
| `textfield` | `FieldRoot` + 自研 | M1 | | 组合字段 |
| `toggle-button` | `Toggle` | M1 | | `data-pressed` |
| `toggle-button-group` | `ToggleGroupRoot` | M1 | | 单选/多选 |
| `toolbar` | `ToolbarRoot` | M1 | | roving tabindex |

## 覆盖层 / 反馈（7）

| 组件 | Reka 基础 | 里程碑 | MVP | 备注 |
|---|---|---|---|---|
| `alert-dialog` | `AlertDialogRoot` | M2 | ✅ | `alertdialog`、不可遮罩关闭 |
| `drawer` | `DrawerRoot` | M2 | ✅ | swipe/把手/方向 |
| `modal` | `DialogRoot` | M2（M0 spike） | ✅ | placement/退场/滚动锁；T01 已验证；Trigger 标签差异待 T05 |
| `popover` | `PopoverRoot` | M2 | ✅ | Floating UI、碰撞、`data-placement` |
| `sheet` | `DrawerRoot`（最接近） | M2 | | 侧边面板、方向/尺寸 |
| `toast` | `ToastProvider` / `ToastRoot` | M2 | ✅ | 队列/暂停/Promise/每请求实例 |
| `tooltip` | `TooltipRoot` | M2 | ✅ | 延迟、`aria-describedby` |

## 集合 / 选择（15）

| 组件 | Reka 基础 | 里程碑 | MVP | 备注 |
|---|---|---|---|---|
| `accordion` | `AccordionRoot` | M2 | ✅ | 单开/多开、`data-expanded`、`data-pressed` |
| `disclosure` | `CollapsibleRoot` | M2 | | 单个展开 |
| `disclosure-group` | `AccordionRoot` | M2 | | 分组展开 |
| `dropdown` | `DropdownMenuRoot` | M2 | ✅ | 触发/定位/键盘 |
| `list-box` | `ListboxRoot` | M2 | ✅ | 单选/多选/分组 |
| `list-box-item` | `ListboxItem` | M2 | | 独立 part |
| `list-box-section` | `ListboxGroup` | M2 | | 分组 |
| `menu` | `DropdownMenu` content（无独立 MenuRoot） | M2 | ✅ | **Gap**：独立 Menu 需组合 DropdownMenu |
| `menu-item` | `DropdownMenuItem` | M2 | | 选择/命令 |
| `menu-section` | `DropdownMenuGroup` | M2 | | 分组/标签 |
| `pagination` | `PaginationRoot` | M2 | ✅ | 页码/省略/RTL |
| `select` | `SelectRoot` | M2（M0 spike） | ✅ | `data-open`/`data-selected`/typeahead；T01 已验证；trigger ARIA 与 SSR 选中文本待 T05 |
| `tabs` | `TabsRoot` | M2 | ✅ | 方向/手动激活 |
| `tag` | `TagGroupItem` | M2 | ✅ | 可选择/可删除 |
| `tag-group` | `TagGroupRoot` | M2 | | 键盘删除/焦点回退 |

## 日期 / 颜色 / 自动完成（15）

| 组件 | Reka 基础 | 里程碑 | MVP | 备注 |
|---|---|---|---|---|
| `autocomplete` | `AutocompleteRoot` | M3 | | 过滤/异步/自由输入 |
| `calendar` | `CalendarRoot` | M3 | | 键盘网格/跨月 |
| `calendar-year-picker` | `CalendarRoot` + 自定义年视图 | M3 | | **Preview**：上游仍在开发 |
| `combo-box` | `ComboboxRoot` | M3 | | 输入过滤/空状态 |
| `date-field` | `DateFieldRoot` | M3 | | 分段输入/locale/timezone |
| `date-picker` | `DatePickerRoot` | M3 | | 弹层/焦点回退 |
| `date-range-picker` | `DateRangePickerRoot` | M3 | | 起止/反向选择 |
| `range-calendar` | `RangeCalendarRoot` | M3 | | 范围高亮 |
| `time-field` | `TimeFieldRoot` | M3 | | 12/24 小时 |
| `color-area` | `ColorAreaRoot` | M3 | | 拖动/键盘 |
| `color-field` | `ColorFieldRoot` | M3 | | 格式/无效输入 |
| `color-picker` | 组合（Area + Slider + Field + Swatch） | M3 | | 无 Reka ColorPickerRoot |
| `color-slider` | `ColorSliderRoot` | M3 | | 透明度/色相 |
| `color-swatch` | `ColorSwatch` | M3 | | 色块 |
| `color-swatch-picker` | `ColorSwatchPickerRoot` | M3 | | 色板选择/键盘 |

## 高级数据（4）

| 组件 | Reka 基础 | 里程碑 | MVP | 备注 |
|---|---|---|---|---|
| `table` | `@tanstack/vue-table` + 自研 DOM/ARIA | M3 | | 最大自研块；见 ADR 0005 |
| `meter` | 自研 | M3 | | `role="meter"`，不复用 Progress |
| `scroll-shadow` | `ScrollAreaRoot` + 自研侦测 | M3 | | 四方向阴影 |
| `input-otp` | `PinInputRoot` | M3 | | 粘贴/分组/完成态 |

## 内部组合（不计入 84）

| 名称 | 说明 |
|---|---|
| `color-input-group` | `ColorPicker` 内部组合；不导出 |
| `date-input-group` | `DatePicker` 内部组合；不导出 |
| `rac` | 上游 React Aria 兼容目录；**不移植** |
| `icons` | 上游内部图标；Sail UI 使用 Iconify，不移植 |

## 统计

| 里程碑 | 组件数 | 说明 |
|---|---:|---|
| M0 spike | 4 | button、input、modal、select |
| M1 | 43 | 24 展示 + 19 表单 |
| M2 | 65 | M1 + 7 覆盖层 + 15 集合 |
| M3 | 84 | M2 + 15 日期/颜色 + 4 高级数据 |
| MVP | 40 | 上表 ✅ 行 |

> 组件计数以 `packages/react/src/components/index.ts` 的公共导出为准；`color-input-group` / `date-input-group` 在 styles 中存在但不导出，因此不计入 84。
</content>
