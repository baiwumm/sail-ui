# T06 — 集合 / 选择器（15）

- Milestone: M2
- Status: Pending
- Blocked by: [T02](./02-contract-tooling.md), [T05](./05-overlays.md)
- Unblocks: [T09](./09-nuxt-docs-release.md)
- Related: [ADR 0002](../../decisions/0002-behavior-layer-reka-ui.md), [ADR 0004](../../decisions/0004-compound-component-api.md), [验收矩阵](../../acceptance-matrix.md)

## What to build

交付集合与选择器家族：

`accordion`、`disclosure`、`disclosure-group`、`dropdown`、`list-box`、`list-box-item`、`list-box-section`、`menu`、`menu-item`、`menu-section`、`pagination`、`select`、`tabs`、`tag`、`tag-group`。

Select 复用 T05 的 popover 状态机；ListBox 同时作为 Select/Combobox/Dropdown 的内部基础，但必须可独立使用。

## Scope

| 组件 | 基础 | 关键行为 |
|---|---|---|
| Accordion / Disclosure / DisclosureGroup | Reka Accordion / Collapsible | 展开/收起、`data-expanded`、`data-pressed`、多开/单开、禁用、键盘 |
| Select | Reka Select | trigger/value/popover/listbox/option、`v-model`、typeahead、`data-open`、`data-selected` |
| ListBox / ListBoxItem / ListBoxSection | Reka Listbox | 单选/多选、分组、禁用、键盘、`data-selected`、虚拟化接口 |
| Dropdown / Menu / MenuItem / MenuSection | Reka DropdownMenu | 触发器、定位、键盘、typeahead、选择/命令、分组、危险项 |
| Tabs | Reka Tabs | 方向键、自动/手动激活、orientation、`data-selected`、`data-disabled` |
| Tag / TagGroup | Reka TagGroup | 可选择、可删除、键盘删除、`data-selected`、`data-disabled` |
| Pagination | 自研 | `nav` + `aria-current`、页码/省略、上一页/下一页、禁用、RTL |

## 关键实现点

- **Compound API**：所有家族同时提供命名导出与复合对象；文档只用命名导出（`SelectTrigger`）。
- **Select/Combobox 共用 listbox**：Select 的 popover 由 T05 的 `useOverlayState` 驱动；不要另起一套开关状态。
- **data-selected**：Reka 在 SelectItem 上可能是 `data-state="checked"`，需要组件补 `data-selected` 或由 compat 别名覆盖；契约测试逐项确认。
- **typeahead**：使用 Reka 的 collection 键盘逻辑；中文/日文输入法组合期间不触发。
- **虚拟化**：ListBox 预留 `isVirtualized` 接口，M3 在 Table/大列表接入；M2 不做。
- **Menu 子菜单**：若上游存在 submenu，按 Reka 的 Sub 组件实现；若上游没有，列为 out of scope。
- **Pagination**：不依赖 Reka；`aria-current="page"`；省略号保留可聚焦的页码入口。

## Acceptance

- [ ] 15 个组件的 `data-slot` 与上游一致。
- [ ] Select：`v-model`、受控/非受控、键盘（Arrow/Home/End/Enter/Esc/typeahead）、`data-open`、`data-selected`。
- [ ] ListBox：单选/多选、分组、禁用、键盘、`data-selected`。
- [ ] Dropdown/Menu：定位、翻转、键盘、typeahead、危险项、分组。
- [ ] Accordion/Disclosure：`data-expanded`、`data-pressed`、多开/单开、禁用、键盘。
- [ ] Tabs：方向键、自动/手动激活、orientation。
- [ ] TagGroup：删除、选择、键盘删除、焦点回退。
- [ ] Pagination：`aria-current`、省略、禁用、RTL。
- [ ] Select 的 popover 与 T05 的模态/层级/滚动锁不冲突。
- [ ] SSR：全部可服务端渲染；关闭的 Select popover 无 DOM；无 hydration mismatch。
- [ ] 视觉：light/dark × 打开/关闭/选中/禁用 × sm/md/lg。
- [ ] 浏览器测试：Select 定位 + 键盘；Dropdown 翻转；Tabs 方向键。
- [ ] 文档：15 个 demo + 键盘说明 + 命名导出示例。
- [ ] 组件矩阵状态更新。

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
- 子菜单（若上游无此能力）；
- 异步搜索/远程数据（由用户组合，不内置）。

## Risks

| 风险 | 处理 |
|---|---|
| Select 的 `data-selected` 在 Reka 不同版本行为不同 | 固定 2.11.0；契约逐项；组件层补属性 |
| Popover 定位与 T05 的冲突 | 复用同一状态机与层级；嵌套测试 |
| typeahead 与 IME 冲突 | `isComposing` 检查；多语言 fixture |
| Menu 子菜单/滚动 | 按上游能力裁剪；不在 MVP 硬做 |
| Pagination 的省略号可访问性 | 提供可聚焦入口；键盘测试 |
</content>
