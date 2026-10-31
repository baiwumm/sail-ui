# ADR 0013: Dropdown / Menu 家族——Reka 弹层 + 自渲染菜单表面

- Status: Accepted
- Date: 2026-10-31
- Related: [T06](../spec/tickets/06-collections-and-pickers.md), [ADR 0002](./0002-behavior-layer-reka-ui.md), [ADR 0004](./0004-compound-component-api.md), [ADR 0007](./0007-component-api-conventions.md), [ADR 0011](./0011-list-box-behavior.md), 上游 HeroUI `89cd95ec1`

## Context

上游 HeroUI 的 Dropdown 由 RAC `MenuTrigger` / `Popover` / `Menu` 组成：

- `Dropdown`（`MenuTrigger`）不渲染 DOM，克隆第一个子元素作为 trigger；
- `Dropdown.Trigger` 是 HeroUI Button；
- `Dropdown.Popover` 是 RAC Popover，根菜单与每个子菜单共享同一个组件；
- `Dropdown.Menu` 是 RAC Menu（`data-slot="dropdown-menu"`、`data-selection-mode`），`Dropdown.Item` 是 RAC MenuItem（`data-slot="menu-item"`）；
- 选择模式、`selectedKeys`、`disabledKeys`、`shouldCloseOnSelect` 由 Menu/RAC 集合状态承担；`MenuSection` 可覆盖选择模式与选择值；
- `Menu` / `MenuItem` / `MenuSection` 是独立导出的底层 parts，`Dropdown` 只是它们的 trigger/popover 组合。

Sail UI 使用 Reka 2.11.0：

- `DropdownMenuRoot` 提供开关状态，`DropdownMenuTrigger` 只负责 trigger ARIA 与 toggle，`DropdownMenuContent` 是**带 `role="menu"`、`id`、`data-state` 的定位元素**；子菜单使用 `DropdownMenuSub` / `DropdownMenuSubTrigger` / `DropdownMenuSubContent`；
- Reka 没有可独立使用的 `MenuRoot`。菜单表面、item 的选择语义都必须依附于 Reka 的 content/collection context；
- Reka item 的选中状态由 `DropdownMenuItem`、`CheckboxItem`、`RadioItem` 分别承担，而选择模式在上游属于 Menu 根/分区，与 Reka 的组件拆分不一致；
- Reka 注入的词汇与上游不同：item 上有 `role="menuitem"`、`data-highlighted=""`、`data-state="open|closed"`（子菜单 trigger）；content 上有 `role="menu"`、`aria-orientation`、`data-state`；trigger 上有 `data-state`、`data-disabled=""`、空的 `aria-controls`（`contentId` 非响应式赋值）。

## Decision

1. **分层**：`Dropdown` 管开关与 trigger/popover；`DropdownMenu`（或 `Menu`）是自渲染的 `role="menu"` 表面；`MenuItem` / `MenuSection` 是共享 parts。`Dropdown.Item` / `ItemIndicator` / `SubmenuIndicator` / `Section` 分别复用 `MenuItem` / `MenuItemIndicator` / `MenuItemSubmenuIndicator` / `MenuSection`，不复制实现。
2. **弹层结构**：`DropdownMenuPortal`（仅挂载时渲染）> `DropdownMenuContent as-child` > 自渲染 `.dropdown__popover` div。该 div 清空 Reka 的 `id`、`role`、`aria-labelledby`、`aria-orientation`、`data-state`，保留 `data-side` 并镜像为 `data-placement`；真正带 `role="menu"` 的是内部的 `[data-slot="dropdown-menu"]`。子菜单用 `DropdownMenuSubContent as-child` > 同样的 `.dropdown__popover` div。菜单位于 popover 内，item 仍注册到 Reka 的 content collection，键盘、typeahead、悬停 grace 区由 Reka 承担。
3. **开关状态**：根菜单与每个子菜单都用 `useOverlayState`。Reka 的受控 `open` 绑定 `isMounted`（退出动画期间保持挂载），`update:open` 转发到 `open()` / `close()`；子菜单的 contentRef 由 `DropdownPopover` 注册，因此子菜单也有进入/退出标记与真实退场等待。子菜单关闭时若父菜单同时关闭，两者各自完成退场。
4. **trigger 词汇**：`DropdownTrigger` 渲染原生 `<button class="dropdown__trigger" data-slot="dropdown-trigger">`，与上游 `Dropdown.Trigger`（RAC Button + 同一 `.dropdown__trigger` 类）一致，**不叠加** HeroUI `.button` 变体（否则高度 36px / 主色背景，与上游 24px trigger 不符）；`aria-controls` 指向真实菜单元素 id（根菜单 id 由 `Dropdown` 生成并提供，子菜单 id 由 `DropdownSubmenuTrigger` 生成），仅在打开时输出；移除 Reka 的 `data-state`，`data-disabled` 只在禁用时为 `"true"`；`aria-haspopup="menu"`、`aria-expanded` 保留。上游「trigger 是 Dropdown 的第一个子元素」在 Vue 中改为显式 `DropdownTrigger`（RAC 的子元素克隆无法在 Vue 中可靠复刻）。
5. **选择模型**：与 ListBox 一致，`v-model` 在 `single` 时为标量、`multiple` 时为数组；`MenuSection` 可声明自己的 `selectionMode` / `defaultValue` / `v-model` 覆盖根菜单，未声明的值继承根；`disabledKeys` 逐层合并；`shouldCloseOnSelect` 默认 `selectionMode !== "multiple"`，分区可覆盖；`disallowEmptySelection` 支持。item 激活时先发 `@action`，再更新选择，再按需关闭根菜单。
6. **item 词汇**：`MenuItem` 以 Reka `DropdownMenuItem`（子菜单 trigger 用 `DropdownMenuSubTrigger`）`as-child` 包住自渲染 div：
   - `role` 为 `menuitem`，可选中模式下为 `menuitemradio` / `menuitemcheckbox`，子菜单 trigger 恒为 `menuitem`；
   - 输出 `aria-checked`（非子菜单、非 none 模式）、`data-selected`、`data-selection-mode`、`data-has-submenu`、`data-open`、`data-disabled`、`data-hovered`、`data-pressed`、`data-focused`、`data-focus-visible`；
   - 清除 Reka 的 `data-highlighted`、`data-state`；
   - `Label` / `Description` 通过 context 自动写入 `aria-labelledby` / `aria-describedby`；无 `Label` 时用 `textValue` 作为 `aria-label` 回退。
7. **子菜单组合**：`DropdownSubmenuTrigger` 提供子菜单上下文（overlay、菜单 id、trigger id），并转发给 Reka `DropdownMenuSub`。直接位于其下的 `DropdownItem` 渲染为 Reka 子菜单 trigger；`DropdownPopover` 检测到该上下文时渲染 `DropdownMenuSubContent`，并向下**重置**子菜单标记，避免子菜单里的普通 item 被误判为 trigger。上游要求每个 `SubmenuTrigger` 内恰好一个 item + 一个 popover。
8. **独立 Menu**：Reka 没有独立菜单根，`Menu` 提供上游 `.menu` 类与 `data-slot="menu"` 的菜单表面，但必须放在 `DropdownPopover` 内使用。`Menu` 与 `DropdownMenu` 的差别仅是类名、`data-slot` 与 `data-selection-mode`；两者共享选择模型。组件矩阵保留「独立 Menu 需组合 DropdownMenu」的差距说明。
9. **SSR**：关闭的菜单与子菜单不渲染任何 popover DOM；根 id、trigger id、菜单 id 均用 `useId()` 生成，服务端与客户端一致。侧边镜像使用 MutationObserver 仅在客户端运行。

## Consequences

正面：

- DOM 与上游一致：popover 无 role，内部单一 `role="menu"`；`data-slot`、`dropdown__*` / `menu*` 类名与 `data-selection-mode` 词汇一致；
- 选择模式、分区覆盖、禁用键、危险项与关闭策略均由组件补齐，且与 ListBox 的 `v-model` 语义一致；
- 复用 Reka 的定位、翻转、typeahead、悬停子菜单与 typeahead；
- 根菜单和子菜单共享 `useOverlayState`，退场动画与 T05 行为一致。

负面：

- 公开组合与上游不同：必须使用 `DropdownTrigger`，不能直接把 Button 作为 Dropdown 的子元素；`DropdownTrigger` 只接受 `isDisabled` / `type`，需要按钮外观时自行叠加 `button button--*` 类；`SelectedKeys` 集合换为 `v-model` 标量/数组；item 标识用 `value` 而非 `id`；
- 独立 `Menu` 不能脱离 Dropdown 组合使用（Reka 无独立 MenuRoot）；
- 根 trigger 的 ARIA 由组件覆盖 Reka 的空 `aria-controls`；Reka 的 `data-reka-menu-content`、`data-side` 等多余属性保留；
- 选择激活的关闭规则做了简化：任意激活键（Enter/Space/点击）在非多选时都关闭，而上游 Space 在可选中模式下不关闭；子菜单退场动画在极快切换时可能被父菜单退场截断；
- Reka 的 item 高亮用真实 DOM 焦点，菜单表面本身不是 `tabindex="0"` 的第二个焦点目标（RAC 菜单根是）；视觉与键盘行为一致，DOM 上少一个 tabindex。

## Alternatives considered

- **使用 Reka `CheckboxItem` / `RadioItem` 承担选择**：选择模式在 Menu 根/分区，Reka 的状态在 item，且 `Role` 与 `selectedKeys` 无法与分区覆盖对齐；改为 Sail 统一选择模型，排除。
- **保留 Reka content 默认 DOM（role=menu 在 popover 上）**：缺少 `.dropdown__menu` 内层元素，CSS 选择器 `[data-slot="dropdown-menu"]` 与上游结构不匹配，排除。
- **用 RAC MenuTrigger 式的子元素克隆**：Vue 无法可靠克隆任意插槽组件并注入 Reka trigger props；显式 `DropdownTrigger` 更可预测，排除。
- **为独立 Menu 自研集合逻辑**：重复 Reka 的键盘/typeahead/悬停实现，违背 ADR 0002；保留组合差距，排除。
- **子菜单不做出场等待**：会让 CSS 退场动画被 Presence 立即卸载截断；复用 `useOverlayState` 成本低，采用。
