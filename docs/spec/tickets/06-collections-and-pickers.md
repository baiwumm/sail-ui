# T06 — 集合 / 选择器（15）

- Milestone: M2
- Status: Done
- Blocked by: [T02](./02-contract-tooling.md), [T05](./05-overlays.md)
- Unblocks: [T09](./09-nuxt-docs-release.md)
- Related: [ADR 0002](../../decisions/0002-behavior-layer-reka-ui.md), [ADR 0004](../../decisions/0004-compound-component-api.md), [验收矩阵](../../acceptance-matrix.md)

## What to build

交付集合与选择器家族：

`accordion`、`disclosure`、`disclosure-group`、`dropdown`、`list-box`、`list-box-item`、`list-box-section`、`menu`、`menu-item`、`menu-section`、`pagination`、`select`、`tabs`、`tag`、`tag-group`。

Select 复用 T05 的 popover 状态机；ListBox 同时作为 Select/Combobox/Dropdown 的内部基础，但必须可独立使用。

## Scope

| 组件                                     | 基础                         | 关键行为                                                                                                    |
| ---------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Accordion / Disclosure / DisclosureGroup | Reka Accordion / Collapsible | 展开/收起、`data-expanded`、`data-pressed`、多开/单开、禁用、键盘                                           |
| Select                                   | Reka Select                  | trigger/value/popover/listbox/option、`v-model`、单选/多选、禁用键、typeahead、`data-open`、`data-selected` |
| ListBox / ListBoxItem / ListBoxSection   | Reka Listbox                 | 单选/多选、分组、禁用、键盘、`data-selected`、虚拟化接口                                                    |
| Dropdown / Menu / MenuItem / MenuSection | Reka DropdownMenu            | 触发器、定位、键盘、typeahead、选择/命令、分组、危险项                                                      |
| Tabs                                     | Reka Tabs                    | 方向键、自动/手动激活、orientation、`data-selected`、`data-disabled`                                        |
| Tag / TagGroup                           | Reka TagGroup                | 可选择、可删除、键盘删除、`data-selected`、`data-disabled`                                                  |
| Pagination                               | 自研                         | `nav` + `aria-current`、页码/省略、上一页/下一页、禁用、RTL                                                 |

## 关键实现点

- **Compound API**：所有家族同时提供命名导出与复合对象；文档只用命名导出（`SelectTrigger`）。
- **折叠面板**：Reka 的 `AccordionContent` / `CollapsibleContent` 会卸载内容且属性词汇不同；Accordion 只用 Reka 的集合状态与方向键，面板由 `useDisclosurePanel` 自渲染，见 [ADR 0008](../../decisions/0008-disclosure-panel-behavior.md)。
- **Tabs**：Reka `TabsTrigger` 注入按钮属性与自己的 id，`TabsIndicator` 是单元素 CSS 变量方案；tab/panel 自渲染并覆盖 id，indicator 按上游 per-tab FLIP 实现，滚动容器内联 ScrollShadow，见 [ADR 0009](../../decisions/0009-tabs-behavior-layer.md)。已知差距：面板无进入/退出动画。
- **Select/Combobox 共用 listbox**：Select 的 popover 由 T05 的 `useOverlayState` 驱动；不要另起一套开关状态。
- **data-selected**：Reka 在 SelectItem 上可能是 `data-state="checked"`，需要组件补 `data-selected` 或由 compat 别名覆盖；契约测试逐项确认。
- **typeahead**：使用 Reka 的 collection 键盘逻辑；中文/日文输入法组合期间不触发。
- **虚拟化**：ListBox 预留 `isVirtualized` 接口，M3 在 Table/大列表接入；M2 不做。
- **Menu 子菜单**：上游有 `SubmenuTrigger`，按 Reka `DropdownMenuSub` 实现；子菜单 trigger 输出 `data-slot="dropdown-submenu-trigger"`，见 [ADR 0013](../../decisions/0013-dropdown-menu-behavior.md)。
- **Pagination**：不依赖 Reka；`aria-current="page"`；省略号保留可聚焦的页码入口。

## Acceptance

- [x] 15 个组件的 `data-slot` 与上游一致。
- [x] Select：`v-model`、受控/非受控、键盘（Arrow/Home/End/Enter/Esc/typeahead）、`data-open`、`data-selected`（组合与 SSR 限制见 [ADR 0012](../../decisions/0012-select-composition.md)）。
- [x] ListBox：单选/多选、分组、禁用、键盘、`data-selected`（行为层见 [ADR 0011](../../decisions/0011-list-box-behavior.md)）。
- [x] Dropdown/Menu：定位、翻转、键盘、typeahead、危险项、分组（弹层结构与选择模型见 [ADR 0013](../../decisions/0013-dropdown-menu-behavior.md)）。
- [x] Accordion/Disclosure：`data-expanded`、`data-pressed`、多开/单开、禁用、键盘（面板行为见 [ADR 0008](../../decisions/0008-disclosure-panel-behavior.md)）。
- [x] Tabs：方向键、自动/手动激活、orientation（dom 与 indicator 决策见 [ADR 0009](../../decisions/0009-tabs-behavior-layer.md)）。
- [x] TagGroup：删除、选择、键盘删除、焦点回退（行为层见 [ADR 0010](../../decisions/0010-tag-and-tag-group-behavior.md)）。
- [x] Pagination：`aria-current`、省略、禁用、RTL。
- [x] Select 的 popover 与 T05 的模态/层级/滚动锁不冲突（复用 `useOverlayState`）。
- [x] SSR：全部可服务端渲染；关闭的 Select popover 无 DOM；无 hydration mismatch。
- [x] 视觉：light/dark × 打开/关闭/选中/禁用 × sm/md/lg。
- [x] 浏览器测试：Select 定位 + 键盘；Dropdown 翻转；Tabs 方向键。
- [x] 文档：15 个 demo + 键盘说明 + 命名导出示例。
- [x] 组件矩阵状态更新。

### T06 收尾说明（2026-10-31）

- **Demo 与文档**：`/collections` 页面覆盖 15 个组件（Select 5 种形态、独立/分组/多选 ListBox、Dropdown 命令/危险项/分组、Accordion 单开/多开/禁用 + DisclosureGroup、Tabs 水平/垂直手动激活、TagGroup 删除/选择/尺寸、Pagination 长页码/省略/RTL），每个分组带键盘说明；全部使用命名导出。迁移指南补充 Dropdown trigger 外观差异。
- **视觉对照**：`apps/reference-react` 新增 `Collections` 镜像（与 Vue demo 相同的 section id、文案与 testid）；`tests/visual` 增加 7 个 gallery 对比与 Select/Dropdown 打开态对比，light/dark 共 68 项通过。收尾中修复的 DOM 合约差异：
  - `DropdownTrigger` 回归上游 RAC Button 合约：原生 `<button class="dropdown__trigger">`，不再叠加 `.button` 变体（触发尺寸从 126×36 恢复为 104×24）；props 收窄为 `isDisabled` / `type`，需要按钮外观时自行加类（ADR 0013）。
  - `TabsPanel` 清空 Reka 注入的 `data-orientation` / `data-state`；上游面板没有这两个属性，且 `.tabs__panel[data-orientation="horizontal"]` 会误触 `margin-top`（ADR 0009）。
  - Dropdown popover 的百分比 `min-width` 在 Reka 固定定位包装器内按内容宽度解析；组件改用 viewport 单位重述下限/上限，恢复上游 220px 宽度。
- **Playground 组合**：Modal trigger 补 `inline-flex items-center justify-center`，抵消上游 `.modal__trigger{display:inline-block}` 对 `.button` 居中的覆盖；这是 demo 组合差异，组件 DOM 与 React `Modal.Trigger` 一致。
- **门禁**：`pnpm verify` 通过（契约 12 文件 137 测试、单测 54 文件 358 测试、SSR 10 文件 32 测试、构建）；`pnpm test:browser` 208 项（Chromium + WebKit）通过；`pnpm test:visual` 68 项通过。
- **SSR**：Select/ListBox/Dropdown/Tabs/Tag/Pagination 均有 SSR fixture；关闭的 Select popover 不在 server HTML，id 由 `useId()` 生成，无 hydration mismatch。
- **仍顺延**：文档站 demo 与迁移页（T09）；ListBox 虚拟化（T08/M3）；Tabs 面板无进入/退出动画（ADR 0009）；Menu 子菜单按上游裁剪（ADR 0013）。

## Demo

`/collections` 页面：

1. Select（基础/分组/多选/禁用/自定义 render）；
2. ListBox（独立 + 分组 + 多选）；
3. Dropdown（命令/危险项/分组）；
4. Accordion（单开/多开/禁用）；
5. Tabs（水平/垂直/手动激活）；
6. TagGroup（可删除/可选择）；
7. Pagination（长页码/省略/RTL）。

## Out of scope

- Combobox / Autocomplete（T07，依赖日期/颜色同批的 collection 逻辑）；
- Table（T08）；
- 虚拟化实现（T08）；
- 异步搜索/远程数据（由用户组合，不内置）。

## Risks

| 风险                                               | 处理                                |
| -------------------------------------------------- | ----------------------------------- |
| Select 的 `data-selected` 在 Reka 不同版本行为不同 | 固定 2.11.0；契约逐项；组件层补属性 |
| Popover 定位与 T05 的冲突                          | 复用同一状态机与层级；嵌套测试      |
| typeahead 与 IME 冲突                              | `isComposing` 检查；多语言 fixture  |
| Menu 子菜单/滚动                                   | 按上游能力裁剪；不在 MVP 硬做       |
| Pagination 的省略号可访问性                        | 提供可聚焦入口；键盘测试            |
