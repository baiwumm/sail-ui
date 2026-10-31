# ADR 0011: ListBox 家族行为层——Reka 双 as-child 单节点 + Sail 选择模型

- Status: Accepted
- Date: 2026-10-31
- Related: [T06](../spec/tickets/06-collections-and-pickers.md), [ADR 0002](./0002-behavior-layer-reka-ui.md), [ADR 0007](./0007-component-api-conventions.md), [ADR 0010](./0010-tag-and-tag-group-behavior.md), 上游 HeroUI `89cd95ec1`

## Context

上游 HeroUI 的 ListBox 家族基于 React Aria Components：

- `ListBox` 渲染**单个** `role="listbox"` 元素（`data-slot="list-box"`、`class="list-box"`），焦点在列表内时输出 `data-focused`，仅在多选时输出 `aria-multiselectable`；键盘导航、Home/End、Enter 与字符 typeahead 由列表统一处理；
- `ListBoxItem` 渲染 `role="option"`，按状态输出 `aria-selected`、`data-selected`、`data-focused`、`data-focus-visible`、`data-hovered`、`data-pressed`、`data-disabled="true"`、`data-selection-mode`；`none` 模式不输出选中相关属性；
- `ListBoxItemIndicator` 是 `aria-hidden` 的 `span`，选中时输出 `data-visible`，内部 checkmark SVG 通过 `stroke-dashoffset` 做勾选动画；
- `ListBoxSection` 渲染 `role="group"`，`aria-labelledby` 指向 `Header` 的 id；`Label` 渲染为 `span`，`Description` 由 TextContext 自动关联到 item 的 `aria-describedby`；
- 激活（点击 / Enter / Space）总是触发 `onAction`；选择模式为 `none` 时激活不改变选择。

Reka UI 2.11.0 的 `ListboxRoot` / `ListboxContent` / `ListboxItem` 提供状态、键盘与 typeahead，但词汇与结构不同：

- 状态在 `ListboxRoot`，`role="listbox"` 元素由 `ListboxContent` 渲染；两者默认各产出一个 DOM 节点；
- `ListboxContent` 总是绑定 `aria-multiselectable`（单选时为 `"false"`），item 注入 `data-highlighted`、`data-state="checked|unchecked"`、原生 `disabled` 与 `data-reka-collection-item`；
- item 的 `select` 自定义事件在内部禁用/选择判断**之前**发出；
- 不提供 `data-hovered` / `data-pressed` / `data-focus-visible` 词汇、indicator、Section 的 label 关联，也没有 RAC TextContext 等价层。

## Decision

1. **单 DOM 节点**：`ListBoxRoot` 用 Reka `ListboxRoot as-child` 包 `ListboxContent as-child`，再包 Sail 自渲染的 `div`（`data-slot="list-box"`）。子元素显式绑定覆盖 Reka 注入的属性：`data-state`、`data-highlighted`、原生 `disabled` 置为 `undefined`，`aria-multiselectable` 仅在多选时输出。不使用 `ListboxContent` 的默认 DOM，因为其绑定会赢过透传属性。
2. **选择模型**：公开 `v-model` 类型为 `ListBoxSelection`（单选为标量、多选为数组、`none` 恒为 `undefined`）；`selectionMode` 默认 `"single"`，`defaultValue` 供非受控使用。消费者是否绑定 `modelValue`（而非其值）决定受控与否；变化时总是发出 `selection-change` 与 `update:modelValue`。内部把标量/数组规范化为 Reka 需要的形状，`none` 模式忽略 Reka 的更新。
3. **禁用**：`disabledKeys`（集合）与 item 的 `isDisabled` 合并判断；禁用 item 不激活、不发出 `action`，在可选中模式下仍输出 `aria-selected="false"`，与上游一致。
4. **action**：任何模式下的激活都发出 `action`（payload 为 key）；`none` 模式下先 `preventDefault` 再发出，使 Reka 不写入选择，同时不输出 `data-selected` / `data-selection-mode` / `aria-selected`。
5. **item 自渲染**：`ListBoxItem` 用 Reka `ListboxItem as-child` 包自渲染的 `role="option"` div，状态由 `useHover` / `usePress` / `useFocusRing` 提供；`aria-label` 仅在未提供 `Label` 时回退到 `textValue`。嵌套的 `Label` / `Description` 通过新增的 `descriptionContextKey` 与 item 级 id 自动关联，`ListBoxSection` 通过 `headerContextKey` 关联 `Header`，无需消费者手写 id。
6. **indicator**：自渲染 `span[aria-hidden]`，选中时输出 `data-visible`，默认插槽渲染上游同款 checkmark SVG（`stroke-dasharray="22"`，`stroke-dashoffset` 44/66），并提供 `isSelected` 作用域插槽供自定义。
7. **根状态**：根只输出上游的 `data-focused`（焦点进入/离开列表时切换），不输出 `data-focus-visible`；`data-focus-visible` 属于 item。
8. **虚拟化**：接受 `isVirtualized` 但不实现，作为 T08 的接口占位；M2 不做虚拟滚动。
9. **key 类型**：选择键限定为 `string | number`，因此 `data-selected` 使用严格 key 相等；`by` 仍转发给 Reka 用于其内部集合比较。

## Consequences

正面：

- DOM 与上游一致：单个 `role="listbox"` 节点、item 状态词汇、indicator 结构与 Section 关联；不会有 Reka 的 `data-state` / `data-highlighted` 泄漏；
- 键盘、typeahead、roving focus 复用 Reka，升级面小；
- `Label` / `Description` / `Header` 自动关联补齐了 ADR 0010 中 TagGroup 的已知差距；
- SSR 稳定：id 由 Vue `useId` 派生，同一输入多次渲染结果一致。

负面：

- typeahead 使用 item 的渲染文本（Reka `useTypeahead` 读 `textContent`），`textValue` 只作为无 `Label` 时的 `aria-label` 回退，不能改变 typeahead 匹配文本；图标按钮类 item 需要显式提供 `aria-label`；
- Reka 仍会保留 `data-reka-collection-item` 与 `reka-listbox-item-*` id：前者是集合排序与方向键的锚点，后者不属于 CSS 契约；
- `ListBoxItem` 必须在 `ListBox` 内、`ListBoxItemIndicator` 必须在 `ListBoxItem` 内，缺失上下文会抛错；
- hover / pressed / focus-visible 是 Sail 侧状态，真实 DOM 焦点落在 item 上（highlight 即焦点）；需要与 Reka 的 `data-highlighted` 同时存在，但后者已从 DOM 中移除，行为调试需看 `data-focused`；
- 虚拟化仅保留接口，`isVirtualized` 当前无效果。

## Alternatives considered

- **直接使用 Reka 的 `ListboxRoot` + `ListboxContent` 默认 DOM**：会产出两层节点且 `role="listbox"` 落在内层，与上游单节点结构和 CSS 选择器不符，排除。
- **用 `ListboxContent` 默认元素并靠透传属性修正**：Reka 自身的 `aria-multiselectable` 绑定优先于透传属性，无法移除单选时的 `"false"`，排除。
- **完全自研 listbox（选择 / typeahead / roving focus）**：重复 Reka 已稳定的行为，违背 ADR 0002，排除。
