# 组件矩阵

- 上游：HeroUI `3.2.7` / `89cd95ec1`
- 公共组件：**84**（另有 2 个内部组合 `color-input-group`、`date-input-group`，以及内部目录 `rac`、`icons`，不计入公共 API）
- 里程碑：M1 = 展示 + 表单；M2 = 覆盖层 + 集合；M3 = 日期/颜色/高级数据；M4 = 模块/文档/发布
- `MVP` = 核心 40 组件（对外承诺的第一版能力）
- 状态：`Spec` = 仅有设计；`M0` = spike；`WIP`；`M1 done` = 里程碑验收通过。状态记录在各表「备注」列。

## 展示 / 布局 / 反馈（24）

| 组件              | Reka 基础                                       | 里程碑 | MVP | 备注                                                                                 |
| ----------------- | ----------------------------------------------- | ------ | --- | ------------------------------------------------------------------------------------ |
| `alert`           | 自研                                            | M1     | ✅  | `role` 按上游；关闭按钮；T03 M1 done                                                 |
| `avatar`          | `AvatarRoot` / `AvatarImage` / `AvatarFallback` | M1     | ✅  | 图片失败回退、尺寸；T03 M1 done                                                      |
| `avatar-group`    | 自研                                            | M1     | ✅  | 堆叠、溢出计数；`is-grid` 布尔 shorthand 已修复；T03 M1 done                         |
| `badge`           | 自研                                            | M1     | ✅  | 颜色/尺寸/位置；T03 M1 done                                                          |
| `breadcrumbs`     | 自研                                            | M1     |     | `nav` + `aria-current`；RTL 冒烟；T03 M1 done                                        |
| `card`            | 自研                                            | M1     | ✅  | 复合：Header/Title/Description/Content/Footer；T03 M1 done                           |
| `chip`            | 自研                                            | M1     | ✅  | 可关闭、颜色；T03 M1 done                                                            |
| `close-button`    | 自研（`asChild`）                               | M1     |     | 默认 `aria-label`；T03 M1 done                                                       |
| `description`     | `FieldDescription`                              | M1     | ✅  | 与 Field 上下文关联；无 Provider 时可手动传 id；T03 M1 done                          |
| `empty-state`     | 自研                                            | M1     |     | 图标/标题/描述/动作；T03 M1 done                                                     |
| `error-message`   | 自研                                            | M1     |     | 语义与上游一致；T03 M1 done                                                          |
| `field-error`     | `FieldError`                                    | M1     | ✅  | 错误 id、`aria-live`；SSR 下 `aria-describedby` 挂载后注册；T03 M1 done              |
| `fieldset`        | 自研                                            | M1     |     | `role="group"` / legend；Vue 使用 `isDisabled`（React 原生 `disabled`）；T03 M1 done |
| `header`          | 自研                                            | M1     |     | 页面/区块标题；T03 M1 done                                                           |
| `kbd`             | 自研                                            | M1     |     | 组合键渲染；上游无 `data-slot`；T03 M1 done                                          |
| `label`           | `FieldLabel` / `Label`                          | M1     | ✅  | `for`/`id` 关联；T03 M1 done                                                         |
| `link`            | 自研（`asChild`）                               | M1     | ✅  | `href`/禁用/外链；T03 M1 done                                                        |
| `progress-bar`    | `ProgressRoot`                                  | M1     |     | `aria-valuenow`、不确定态；Vue 扩展 `isDisabled`；T03 M1 done                        |
| `progress-circle` | `ProgressRoot` + SVG                            | M1     |     | 几何/描边；Vue 扩展 `isDisabled`；T03 M1 done                                        |
| `separator`       | `Separator`                                     | M1     | ✅  | orientation/decorative；T03 M1 done                                                  |
| `skeleton`        | 自研                                            | M1     | ✅  | 减少动画偏好；上游无 `data-slot`；T03 M1 done                                        |
| `spinner`         | 自研                                            | M1     | ✅  | `role="status"`；T03 M1 done                                                         |
| `surface`         | 自研                                            | M1     |     | 容器/层级；T03 M1 done                                                               |
| `typography`      | 自研                                            | M1     |     | 变体/`as`；Heading/Paragraph/Code/Prose；T03 M1 done                                 |

## 表单 / 操作（19）

| 组件                  | Reka 基础                            | 里程碑         | MVP | 备注                                                              |
| --------------------- | ------------------------------------ | -------------- | --- | ----------------------------------------------------------------- |
| `button`              | 自研（`Toggle` 复用 press）          | M1（M0 spike） | ✅  | 变体/尺寸/loading/icon-only/`as`/`asChild`/表单 type；T04 M1 done |
| `button-group`        | 自研                                 | M1             | ✅  | 组合、分隔、方向；向子按钮传播 size/variant；T04 M1 done          |
| `checkbox`            | 自研（隐藏原生 input）               | M1             | ✅  | indeterminate/全选半选/数组 `v-model`；T04 M1 done                |
| `checkbox-group`      | 自研（隐藏原生 input）               | M1             | ✅  | 全选/半选、数组 `v-model`；T04 M1 done                            |
| `form`                | 原生 `form`                          | M1             | ✅  | 提交/`invalid`/原生约束/IME 守卫；T04 M1 done                     |
| `input`               | 自研 + `FieldControl`                | M1（M0 spike） | ✅  | 受控/非受控、hover/focus 状态、IME；T04 M1 done                   |
| `input-group`         | 自研                                 | M1             |     | 前后缀、点击聚焦、hover/focus-within；T04 M1 done                 |
| `number-field`        | `NumberFieldRoot`                    | M1             | ✅  | 步进/长按/格式/min-max/spinbutton；T04 M1 done                    |
| `radio`               | 自研（隐藏原生 input）               | M1             | ✅  | 内部 indicator 需要 useHover/usePress；T04 M1 done                |
| `radio-group`         | 自研（原生 radio 组）                | M1             | ✅  | 方向键、roving tabindex；T04 M1 done                              |
| `search-field`        | 自研                                 | M1             | ✅  | 清除/提交/IME 守卫；T04 M1 done                                   |
| `slider`              | `SliderRoot` + 自研 thumb/fill       | M1             | ✅  | 单值/范围/拖拽/RTL/`data-dragging`；T04 M1 done                   |
| `switch`              | 自研（隐藏原生 input）               | M1             | ✅  | 内部 slot 需要 3 个 composable；T04 M1 done                       |
| `switch-group`        | 自研                                 | M1             |     | 分组/方向；T04 M1 done                                            |
| `textarea`            | 自研 + `FieldControl`                | M1             | ✅  | 受控/非受控、可选自适应高度；T04 M1 done                          |
| `textfield`           | `FieldRoot` + 自研                   | M1             |     | 组合字段；T04 M1 done                                             |
| `toggle-button`       | `Toggle` / `ToggleGroupItem`         | M1             |     | `data-pressed`/`data-selected`；T04 M1 done                       |
| `toggle-button-group` | `ToggleGroupRoot` / `RadioGroupRoot` | M1             |     | 单选（radio 语义）/多选；T04 M1 done                              |
| `toolbar`             | 自研（方向键 roving）                | M1             |     | 方向键/RTL；T04 M1 done                                           |

## 覆盖层 / 反馈（7）

| 组件           | Reka 基础                       | 里程碑         | MVP | 备注                                                        |
| -------------- | ------------------------------- | -------------- | --- | ----------------------------------------------------------- |
| `alert-dialog` | `AlertDialogRoot`               | M2             | ✅  | `alertdialog`、不可遮罩关闭；T05 done                       |
| `drawer`       | `DialogRoot` + 自研 motion/拖拽 | M2             | ✅  | swipe/把手/方向；T05 done                                   |
| `modal`        | `DialogRoot`                    | M2（M0 spike） | ✅  | placement/退场/滚动锁；T01 已验证；T05 对齐 div trigger     |
| `popover`      | `PopoverRoot`                   | M2             | ✅  | Floating UI/箭头/`data-placement` 镜像；T05 done            |
| `sheet`        | `DialogRoot` + 自研 motion/拖拽 | M2             | ✅  | 方向/尺寸、WAAPI 进出场；snap/detached/嵌套未实现；T05 done |
| `toast`        | `ToastProvider` / `ToastRoot`   | M2             | ✅  | 队列/暂停/Promise/每请求实例；T05 done                      |
| `tooltip`      | `TooltipRoot`                   | M2             | ✅  | 延迟/关闭延迟、`aria-describedby`、hoverable 内容；T05 done |

## 集合 / 选择（15）

| 组件               | Reka 基础                                 | 里程碑         | MVP | 备注                                                                                                  |
| ------------------ | ----------------------------------------- | -------------- | --- | ----------------------------------------------------------------------------------------------------- |
| `accordion`        | `AccordionRoot`（集合状态 / 方向键）      | M2             | ✅  | 单开/多开、`data-expanded`、`data-pressed`；面板自渲染（ADR 0008）；T06 切片 A done                   |
| `disclosure`       | 自研（App 上下文 + 面板）                 | M2             | ✅  | 单个展开；`useDisclosurePanel` 复刻 RAC；T06 切片 A done                                              |
| `disclosure-group` | 自研分组上下文                            | M2             | ✅  | 分组展开、单开/多开；T06 切片 A done                                                                  |
| `dropdown`         | `DropdownMenuRoot`                        | M2             | ✅  | 触发/定位/键盘/子菜单；选择模型与弹层策略见 ADR 0013；T06 切片 F done                                 |
| `list-box`         | `ListboxRoot`                             | M2             | ✅  | 单选/多选/分组/键盘；单节点 + Reka 状态（ADR 0011）；T06 切片 D done                                  |
| `list-box-item`    | `ListboxItem`                             | M2             | ✅  | 独立 part；状态词汇与 Label/Description 关联（ADR 0011）；T06 切片 D done                             |
| `list-box-section` | `ListboxGroup`                            | M2             | ✅  | 分组；Header 自动关联（ADR 0011）；T06 切片 D done                                                    |
| `menu`             | `DropdownMenu` content（无独立 MenuRoot） | M2             | ✅  | **Gap**：独立 Menu 需组合 DropdownPopover；ADR 0013；T06 切片 F done                                  |
| `menu-item`        | `DropdownMenuItem`                        | M2             | ✅  | 选择/命令/危险项/指示器；子菜单 trigger 输出 `dropdown-submenu-trigger`；T06 切片 F done              |
| `menu-section`     | `DropdownMenuGroup`                       | M2             | ✅  | 分组/标签/选择模式覆盖；T06 切片 F done                                                               |
| `pagination`       | 自研（对齐上游 10 个复合 part）           | M2             | ✅  | 页码/省略/禁用/RTL、`aria-current`；命名导出；T06 切片 G done                                         |
| `select`           | `SelectRoot`                              | M2（M0 spike） | ✅  | trigger ARIA、popover/listbox 单 role、多选/禁用键；ADR 0012；T06 切片 E done；SSR 选中文本限制见 ADR |
| `tabs`             | `TabsRoot`（集合状态 / 方向键）           | M2             | ✅  | 方向/手动激活；tab 自渲染、per-tab indicator（ADR 0009）；T06 切片 B done，浏览器/视觉测试已收尾      |
| `tag`              | `TagGroupItem`                            | M2             | ✅  | 可选择/可删除；remove 按钮仅在监听 remove 时渲染；T06 切片 C done                                     |
| `tag-group`        | `TagGroupRoot`                            | M2             | ✅  | 键盘删除/焦点回退；自渲染行 + Reka 列表（ADR 0010）；T06 切片 C done                                  |

## 日期 / 颜色 / 自动完成（15）

| 组件                   | Reka 基础                              | 里程碑 | MVP | 备注                      |
| ---------------------- | -------------------------------------- | ------ | --- | ------------------------- |
| `autocomplete`         | `AutocompleteRoot`                     | M3     |     | 过滤/异步/自由输入        |
| `calendar`             | `CalendarRoot`                         | M3     |     | 键盘网格/跨月             |
| `calendar-year-picker` | `CalendarRoot` + 自定义年视图          | M3     |     | **Preview**：上游仍在开发 |
| `combo-box`            | `ComboboxRoot`                         | M3     |     | 输入过滤/空状态           |
| `date-field`           | `DateFieldRoot`                        | M3     |     | 分段输入/locale/timezone  |
| `date-picker`          | `DatePickerRoot`                       | M3     |     | 弹层/焦点回退             |
| `date-range-picker`    | `DateRangePickerRoot`                  | M3     |     | 起止/反向选择             |
| `range-calendar`       | `RangeCalendarRoot`                    | M3     |     | 范围高亮                  |
| `time-field`           | `TimeFieldRoot`                        | M3     |     | 12/24 小时                |
| `color-area`           | `ColorAreaRoot`                        | M3     |     | 拖动/键盘                 |
| `color-field`          | `ColorFieldRoot`                       | M3     |     | 格式/无效输入             |
| `color-picker`         | 组合（Area + Slider + Field + Swatch） | M3     |     | 无 Reka ColorPickerRoot   |
| `color-slider`         | `ColorSliderRoot`                      | M3     |     | 透明度/色相               |
| `color-swatch`         | `ColorSwatch`                          | M3     |     | 色块                      |
| `color-swatch-picker`  | `ColorSwatchPickerRoot`                | M3     |     | 色板选择/键盘             |

## 高级数据（4）

| 组件            | Reka 基础                             | 里程碑 | MVP | 备注                            |
| --------------- | ------------------------------------- | ------ | --- | ------------------------------- |
| `table`         | `@tanstack/vue-table` + 自研 DOM/ARIA | M3     |     | 最大自研块；见 ADR 0005         |
| `meter`         | 自研                                  | M3     |     | `role="meter"`，不复用 Progress |
| `scroll-shadow` | `ScrollAreaRoot` + 自研侦测           | M3     |     | 四方向阴影                      |
| `input-otp`     | `PinInputRoot`                        | M3     |     | 粘贴/分组/完成态                |

## 内部组合（不计入 84）

| 名称                | 说明                                       |
| ------------------- | ------------------------------------------ |
| `color-input-group` | `ColorPicker` 内部组合；不导出             |
| `date-input-group`  | `DatePicker` 内部组合；不导出              |
| `rac`               | 上游 React Aria 兼容目录；**不移植**       |
| `icons`             | 上游内部图标；Sail UI 使用 Iconify，不移植 |

## 统计

| 里程碑   | 组件数 | 说明                           |
| -------- | -----: | ------------------------------ |
| M0 spike |      4 | button、input、modal、select   |
| M1       |     43 | 24 展示 + 19 表单              |
| M2       |     65 | M1 + 7 覆盖层 + 15 集合        |
| M3       |     84 | M2 + 15 日期/颜色 + 4 高级数据 |
| MVP      |     40 | 上表 ✅ 行                     |

> 组件计数以 `packages/react/src/components/index.ts` 的公共导出为准；`color-input-group` / `date-input-group` 在 styles 中存在但不导出，因此不计入 84。
