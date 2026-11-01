---
title: Components
description: All 84 Sail UI components with their maturity.
---

# Components

6 groups, listed straight from the [component matrix](https://github.com/baiwumm/sail-ui/blob/main/docs/component-matrix.md). Components with a link have a full documentation page; the others follow the same API conventions and are documented ticket by ticket in the repository.

## Display, layout & feedback (24)

| Component         | Docs | Notes                                                                   |
| ----------------- | ---- | ----------------------------------------------------------------------- |
| `alert`           | —    | `role` 按上游；关闭按钮；T03 M1 done                                    |
| `avatar`          | —    | 图片失败回退、尺寸；T03 M1 done                                         |
| `avatar-group`    | —    | 堆叠、溢出计数；`is-grid` 布尔 shorthand 已修复；T03 M1 done            |
| `badge`           | —    | 颜色/尺寸/位置；T03 M1 done                                             |
| `breadcrumbs`     | —    |                                                                         |
| `card`            | —    | 复合：Header/Title/Description/Content/Footer；T03 M1 done              |
| `chip`            | —    | 可关闭、颜色；T03 M1 done                                               |
| `close-button`    | —    |                                                                         |
| `description`     | —    | 与 Field 上下文关联；无 Provider 时可手动传 id；T03 M1 done             |
| `empty-state`     | —    |                                                                         |
| `error-message`   | —    |                                                                         |
| `field-error`     | —    | 错误 id、`aria-live`；SSR 下 `aria-describedby` 挂载后注册；T03 M1 done |
| `fieldset`        | —    |                                                                         |
| `header`          | —    |                                                                         |
| `kbd`             | —    |                                                                         |
| `label`           | —    | `for`/`id` 关联；T03 M1 done                                            |
| `link`            | —    | `href`/禁用/外链；T03 M1 done                                           |
| `progress-bar`    | —    |                                                                         |
| `progress-circle` | —    |                                                                         |
| `separator`       | —    | orientation/decorative；T03 M1 done                                     |
| `skeleton`        | —    | 减少动画偏好；上游无 `data-slot`；T03 M1 done                           |
| `spinner`         | —    | `role="status"`；T03 M1 done                                            |
| `surface`         | —    |                                                                         |
| `typography`      | —    |                                                                         |

## Forms & actions (19)

| Component             | Docs                                  | Notes                                                             |
| --------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| `button`              | [button](/docs/components/button)     | 变体/尺寸/loading/icon-only/`as`/`asChild`/表单 type；T04 M1 done |
| `button-group`        | —                                     | 组合、分隔、方向；向子按钮传播 size/variant；T04 M1 done          |
| `checkbox`            | [checkbox](/docs/components/checkbox) | indeterminate/全选半选/数组 `v-model`；T04 M1 done                |
| `checkbox-group`      | —                                     | 全选/半选、数组 `v-model`；T04 M1 done                            |
| `form`                | —                                     | 提交/`invalid`/原生约束/IME 守卫；T04 M1 done                     |
| `input`               | [input](/docs/components/input)       | 受控/非受控、hover/focus 状态、IME；T04 M1 done                   |
| `input-group`         | —                                     |                                                                   |
| `number-field`        | —                                     | 步进/长按/格式/min-max/spinbutton；T04 M1 done                    |
| `radio`               | —                                     | 内部 indicator 需要 useHover/usePress；T04 M1 done                |
| `radio-group`         | —                                     | 方向键、roving tabindex；T04 M1 done                              |
| `search-field`        | —                                     | 清除/提交/IME 守卫；T04 M1 done                                   |
| `slider`              | —                                     | 单值/范围/拖拽/RTL/`data-dragging`；T04 M1 done                   |
| `switch`              | —                                     | 内部 slot 需要 3 个 composable；T04 M1 done                       |
| `switch-group`        | —                                     |                                                                   |
| `textarea`            | —                                     | 受控/非受控、可选自适应高度；T04 M1 done                          |
| `textfield`           | —                                     |                                                                   |
| `toggle-button`       | —                                     |                                                                   |
| `toggle-button-group` | —                                     |                                                                   |
| `toolbar`             | —                                     |                                                                   |

## Overlays & feedback (7)

| Component      | Docs                            | Notes                                                       |
| -------------- | ------------------------------- | ----------------------------------------------------------- |
| `alert-dialog` | —                               | `alertdialog`、不可遮罩关闭；T05 done                       |
| `drawer`       | —                               | swipe/把手/方向；T05 done                                   |
| `modal`        | [modal](/docs/components/modal) | placement/退场/滚动锁；T01 已验证；T05 对齐 div trigger     |
| `popover`      | —                               | Floating UI/箭头/`data-placement` 镜像；T05 done            |
| `sheet`        | —                               | 方向/尺寸、WAAPI 进出场；snap/detached/嵌套未实现；T05 done |
| `toast`        | [toast](/docs/components/toast) | 队列/暂停/Promise/每请求实例；T05 done                      |
| `tooltip`      | —                               | 延迟/关闭延迟、`aria-describedby`、hoverable 内容；T05 done |

## Collections & pickers (15)

| Component          | Docs                                    | Notes                                                                                                 |
| ------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `accordion`        | [accordion](/docs/components/accordion) | 单开/多开、`data-expanded`、`data-pressed`；面板自渲染（ADR 0008）；T06 切片 A done                   |
| `disclosure`       | —                                       | 单个展开；`useDisclosurePanel` 复刻 RAC；T06 切片 A done                                              |
| `disclosure-group` | —                                       | 分组展开、单开/多开；T06 切片 A done                                                                  |
| `dropdown`         | —                                       | 触发/定位/键盘/子菜单；选择模型与弹层策略见 ADR 0013；T06 切片 F done                                 |
| `list-box`         | —                                       | 单选/多选/分组/键盘；单节点 + Reka 状态（ADR 0011）；T06 切片 D done                                  |
| `list-box-item`    | —                                       | 独立 part；状态词汇与 Label/Description 关联（ADR 0011）；T06 切片 D done                             |
| `list-box-section` | —                                       | 分组；Header 自动关联（ADR 0011）；T06 切片 D done                                                    |
| `menu`             | —                                       | **Gap**：独立 Menu 需组合 DropdownPopover；ADR 0013；T06 切片 F done                                  |
| `menu-item`        | —                                       | 选择/命令/危险项/指示器；子菜单 trigger 输出 `dropdown-submenu-trigger`；T06 切片 F done              |
| `menu-section`     | —                                       | 分组/标签/选择模式覆盖；T06 切片 F done                                                               |
| `pagination`       | —                                       | 页码/省略/禁用/RTL、`aria-current`；命名导出；T06 切片 G done                                         |
| `select`           | [select](/docs/components/select)       | trigger ARIA、popover/listbox 单 role、多选/禁用键；ADR 0012；T06 切片 E done；SSR 选中文本限制见 ADR |
| `tabs`             | —                                       | 方向/手动激活；tab 自渲染、per-tab indicator（ADR 0009）；T06 切片 B done，浏览器/视觉测试已收尾      |
| `tag`              | —                                       | 可选择/可删除；remove 按钮仅在监听 remove 时渲染；T06 切片 C done                                     |
| `tag-group`        | —                                       | 键盘删除/焦点回退；自渲染行 + Reka 列表（ADR 0010）；T06 切片 C done                                  |

## Dates, colors & autocomplete (15)

| Component              | Docs                                  | Notes                                       |
| ---------------------- | ------------------------------------- | ------------------------------------------- |
| `autocomplete`         | —                                     | 弹层搜索/清空/`displayValue`；T07 done      |
| `calendar`             | [calendar](/docs/components/calendar) | 键盘网格/跨月/多可见月/不可用日期；T07 done |
| `calendar-year-picker` | —                                     | **Preview**：上游仍在开发；T07 done         |
| `combo-box`            | —                                     | 输入过滤/空状态/自由输入/异步受控；T07 done |
| `date-field`           | —                                     | 分段输入/locale/范围校验；T07 done          |
| `date-picker`          | —                                     | 弹层/焦点回退/受控 open；T07 done           |
| `date-range-picker`    | —                                     | 起止/反向选择/partial 输入；T07 done        |
| `range-calendar`       | —                                     | 范围高亮/悬停预览；T07 done                 |
| `time-field`           | —                                     | 12/24 小时/秒级粒度；T07 done               |
| `color-area`           | —                                     | 拖动/键盘；外层 group 差异；T07 done        |
| `color-field`          | —                                     | 格式/无效输入；空值回退 #000000；T07 done   |
| `color-picker`         | —                                     | 无 Reka ColorPickerRoot；T07 done           |
| `color-slider`         | —                                     | 透明度/色相；`aria-disabled` 差异；T07 done |
| `color-swatch`         | —                                     | 色块；T07 done                              |
| `color-swatch-picker`  | —                                     | 色板选择/键盘；Listbox 直组合；T07 done     |

## Advanced data (4)

| Component       | Docs                            | Notes                                                                         |
| --------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `table`         | [table](/docs/components/table) | 数据驱动；2D 键盘/排序/选择/列宽/虚拟化/LoadMore/粘性表头；ADR 0005；T08 done |
| `meter`         | —                               | `role="meter"`，不复用 Progress；T08 done                                     |
| `scroll-shadow` | —                               | 四方向阴影/可见性事件/隐藏滚动条；T08 done                                    |
| `input-otp`     | —                               | 粘贴/分组/完成态/pattern；T08 done                                            |
