# ADR 0012: Select 组合层——专用 ListBox parts + Reka 集合状态

- Status: Accepted
- Date: 2026-10-31
- Related: [T06](../spec/tickets/06-collections-and-pickers.md), [ADR 0002](./0002-behavior-layer-reka-ui.md), [ADR 0004](./0004-compound-component-api.md), [ADR 0007](./0007-component-api-conventions.md), [ADR 0011](./0011-list-box-behavior.md), 上游 HeroUI `89cd95ec1`

## Context

上游 HeroUI 的 Select 基于 React Aria Components：`Select` 提供集合与选择状态，`Select.Popover` 内的 `ListBox` 直接消费同一个 `SelectStateContext`。因此上游文档的组合是：

```tsx
<Select>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Popover>
    <ListBox>
      <ListBox.Item id="a">A</ListBox.Item>
    </ListBox>
  </Select.Popover>
</Select>
```

Sail UI 的 Select 使用 Reka 2.11.0 `SelectRoot`。Reka 的集合、typeahead、选中状态与 `role="option"` 语义绑定在 **Reka `SelectItem`** 上；独立 `ListBox`（ADR 0011）使用 `ListboxRoot`，两套状态不互通。若把独立 `ListBox` 放进 `SelectPopover`，它不会读取 Select 的模型，trigger/value 也不会更新。

同时 Reka 输出的结构与词汇和上游不同：

- `SelectContent` 自身是带 `id`、`role="listbox"`、`data-state` 的定位元素；上游 `.select__popover` 是无 role 的包裹层，真正的 listbox 是内部的 `[data-slot="list-box"]`；
- trigger 注入 `data-state`、空值 `data-disabled=""`、`data-placeholder=""`、`aria-autocomplete="none"`，缺少上游的 `aria-haspopup="listbox"`；
- item 注入 `data-highlighted`、`data-state="checked|unchecked"`；
- Reka 只在客户端挂载隐藏内容后才注册 option 文本，服务端没有可用的选中标签。

## Decision

1. **专用 parts**：Select 公开 `SelectListBox`、`SelectItem`、`SelectItemIndicator`，分别渲染 `data-slot="list-box"`、`list-box-item`、`list-box-item-indicator`。独立 `ListBox` 家族保持独立，不作为 Select 的内部实现。复合对象同时挂载这些 parts。
2. **单 role 的 popover**：`SelectPortal` > `SelectContent as-child` > 自渲染 `.select__popover` div。该 div 显式清空 Reka 的 `id`、`role`、`data-state`，只输出 `data-slot`、`data-entering`、`data-exiting`、`data-placement`；`SelectListBox` 的 div 才输出 `role="listbox"`，其 `id` 使用 Reka 的 `contentId`，使 trigger 的 `aria-controls` 指向真实 listbox。`data-side` 被镜像为上游的 `data-placement`（`data-side` 由 Reka 保留并用于观察）。
3. **trigger 词汇归一**：`aria-haspopup="listbox"`；移除 `aria-autocomplete`、`data-state`、空值 `data-placeholder`；`data-disabled` 只在禁用时输出 `"true"`；保留 `data-open`、`data-focus-visible`、`data-hovered`。
4. **选择模型**：`v-model` 在 `selectionMode="single"` 时为标量，在 `"multiple"` 时为数组；`clear()` 分别写入 `undefined` 与 `[]`。`disabledKeys` 与 item 的 `isDisabled` 合并，比较使用 `by`（字符串键或比较函数），默认对对象做 JSON 比较。空字符串 `value` 被 Reka 保留给“无选择”，组件不额外处理。
5. **item 自渲染**：Reka `SelectItem as-child` > 自渲染 `role="option"` div，`SelectItemText` 仅包裹文本与插槽内容。输出 `aria-selected`、`data-selected`、`data-selection-mode`、`data-focused`、`data-focus-visible`、`data-hovered`、`data-pressed`、`data-disabled`；`data-highlighted` 与 `data-state` 置空。嵌套 `Label` 自动渲染为 `span` 并写入 `aria-labelledby`，`Description` 写入 `aria-describedby`。
6. **SSR 回退**：关闭的 Select 不输出 popover/listbox DOM；`SelectValue` 的文本和 `data-placeholder` 都基于“已注册的可见 label”。服务端（以及客户端首帧）还没有 option 文本，因此显示 placeholder，挂载后补上选中文本。服务端与客户端首帧一致，不产生 hydration mismatch。
7. **overlay 状态**：继续使用 T05 的 `useOverlayState`；Reka 的受控 `open` 绑定 `isMounted`，关闭动画结束前不卸载 popover。

## Consequences

正面：

- DOM 与上游一致：popover 包裹层无 role，内部单一 `role="listbox"`，trigger 与 listbox 的 ARIA 关系正确；
- 多选、禁用键、单选/多选词汇、Label/Description 关联与 indicator 均由组件补齐；
- 复用 Reka 的集合、typeahead 与键盘逻辑，升级面小；
- 服务端输出确定、无 hydration mismatch，关闭的 popover 不泄漏 DOM。

负面：

- 公开组合与上游不同：`SelectPopover > SelectListBox > SelectItem`，迁移时 `ListBox` / `ListBoxItem` / `ListBoxItemIndicator` 分别替换为 Select 专用 parts；独立 `ListBox` 不能放进 Select；
- SSR 不输出选中文本：带 `defaultValue`/受控值的 Select 在服务端显示 placeholder，挂载后才显示标签；依赖 SSR 文本做断言或 SEO 的场景需注意；
- typeahead 使用 item 渲染文本；Reka 的 `data-reka-collection-item`、`reka-select-*` id 仍会保留；
- `SelectItem` 的 `value` 不能是空字符串；
- `data-side` 作为 Reka 的定位状态保留在 popover 上，属于上游之外的多余属性。

## Alternatives considered

- **把独立 `ListBox` 作为 Select 内部列表**：两套选择状态不互通，trigger/value 不会更新；除非 fork Reka Select 或自研整套集合，违背 ADR 0002，排除。
- **保留 Reka `SelectContent` 默认 DOM，靠透传属性修正**：`role`、`id`、`data-state` 的默认绑定会与包裹层冲突，且无法把 `contentId` 移到内层 listbox，排除。
- **服务端 `forceMount` 内容以渲染选中文本**：会在关闭状态输出 popover DOM，违反 SSR“关闭覆盖层无 DOM”的规则，排除。
- **自建 option 文本注册表以补齐 SSR 选中文本**：重复 Reka 的集合实现；若 T09 的 SEO 需求证明必要，再单独评估。
