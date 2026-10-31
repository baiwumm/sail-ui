# ADR 0010: Tag / TagGroup 行为层——Reka 集合状态 + 自渲染 tag 行

- Status: Accepted
- Date: 2026-10-31
- Related: [T06](../spec/tickets/06-collections-and-pickers.md), [ADR 0002](./0002-behavior-layer-reka-ui.md), [ADR 0007](./0007-component-api-conventions.md), 上游 HeroUI `89cd95ec1`

## Context

上游 HeroUI TagGroup 基于 React Aria Components：

- `TagGroup` 渲染普通 `<div class="tag-group">`；`Label` 通过 TextContext 渲染为 `span`，`Description` / `ErrorMessage` 的 id 由 `useField` 注入 grid 的 `aria-describedby`；
- `TagGroup.List` 渲染 `role="grid"`（空集合时为 `role="group"`），带 `aria-multiselectable`、`aria-atomic="false"`、`aria-relevant="additions"`；
- `Tag` 渲染 `role="row"`，`aria-label` 取文本内容，按状态输出 `aria-selected`、`data-selected`、`data-disabled`、`data-hovered`、`data-focused`、`data-focus-visible`、`data-pressed`、`data-selection-mode`、`data-allows-removing`；行内是一个 `role="gridcell" aria-colindex="1" style="display: contents"` 的包裹层；
- `Tag.RemoveButton` 是对 `CloseButton` 的包装：`slot="remove"`、`data-slot="tag-remove-button"`、`aria-label="Remove tag"`；只有 `renderProps.allowsRemoving`（即 group 收到 `onRemove`）时才渲染，默认按钮与自定义按钮都如此；
- 键盘：Delete / Backspace 删除，Enter / Space 切换选择，字符键 typeahead；删除焦点中的 tag 后焦点回退到下一个、上一个或 group 本身。

Reka UI 2.11.0 的 `TagGroupRoot` / `TagGroupItem` 已提供选择、删除、typeahead 与 roving focus，但 DOM 词汇不同：

- `TagGroupItem` 自带 `role="row"` 与内部 `gridcell`，并注入 `data-state="checked|unchecked"`、`data-orientation`、`data-reka-collection-item`，id 为 `reka-tag-group-item-*`；
- 删除可用性由 `allowsRemoving()` 读取 `instance.vnode.props.onRemove` 决定；
- 不提供 remove 按钮、hover / pressed / focus-visible 状态或 `data-*` 上游词汇。

Sail UI 只有 `labelContextKey`，没有 RAC 的 TextContext / `useField` 等价层。

## Decision

1. **TagGroupRoot** 自渲染普通 `div`（`data-slot="tag-group"`），持有选择、禁用、size/variant、`canRemove` 与 label id；通过 `labelContextKey` 让 `Label` 渲染为 `span`。不使用 Reka 的根组件，因为上游根节点没有集合语义。
2. **TagGroupList** 用 Reka `TagGroupRoot asChild` 包裹消费者可见的 `div`（`data-slot="tag-group-list"`）：ARIA 标签/描述从 Sail 根转发，`model-value` 取 Sail 的解析后的选择值，`remove` 监听通过 camelCase 的 `v-bind` 对象传入（hyphenated 的 `:on-remove` 在 `vnode.props` 中仍是 `on-remove`，Reka 的 `allowsRemoving()` 看不到）。
3. **Tag** 用 Reka `TagGroupItem asChild` 包裹自渲染的 `role="row"` div：在 div 上显式输出上游状态属性，并把 Reka 注入的 `data-state` / `data-orientation` 置为 `undefined`；保留 `data-reka-collection-item`，它是 Reka 集合排序与方向键的锚点。内部 `gridcell` 由 Tag 自渲染（`display: contents`）。
4. **选择状态**：当消费者提供 `modelValue` prop 时为受控（即使值为 `undefined`），否则使用 `defaultValue` 初始化的内部状态；两种情况都发出 `selection-change`，`update:modelValue` 由 `defineModel` 决定（受控，或值发生变化）。`selectionMode` 默认 `"none"`，此时不输出选择属性、点击不切换。
5. **删除**：`canRemove` 由根组件的 `onRemove` 监听是否存在决定；默认 `Tag.RemoveButton` 仅在 `canRemove` 时渲染，自定义 remove 按钮同样在无监听时隐藏，与上游 `allowsRemoving` 一致。按钮点击阻止冒泡后请求删除；Delete / Backspace 交由 Reka 项处理，焦点回退使用 Reka 的“下一项 / 上一项 / group”逻辑。
6. **文本值**：`aria-label` 与 typeahead 文本取 `textValue` prop，其次取首个非空文本子节点。

## Consequences

正面：

- DOM 与上游一致：根/列表/行/gridcell 结构、`data-*` 词汇、remove 按钮的 `slot` 与 `aria-label`；
- 选择、删除、typeahead、roving focus 与焦点回退复用 Reka，升级面小；
- SSR 稳定：id 由 Vue `useId` 派生，`renderSSR` 多次渲染结果一致。

负面：

- `Description` / `ErrorMessage` 不会自动写入 grid 的 `aria-describedby`（Sail 尚无 RAC TextContext 等价层）；消费者需显式传 `aria-describedby` 并给描述元素设置 id。补齐应作为独立的 a11y ticket；
- Reka 会保留 `data-reka-collection-item` 与 `reka-tag-group-item-*` id；前者是行为需要，后者不属于 CSS 契约；
- Tag 必须在 TagGroup 内使用，缺失上下文会抛错；
- 删除后的标签列表由消费者自行维护（`remove` 只报告值），与上游相同。

## Alternatives considered

- **直接使用 Reka `TagGroupItem` 的默认 DOM**：无法输出上游状态词汇与 remove 按钮结构，且 `role="row"` 的兄弟包装层无法精确控制，排除。
- **完全自研集合（选择、typeahead、roving focus）**：重复 Reka 已稳定的行为，违背 ADR 0002，排除。
- **始终绑定 `onRemove` 让 Delete 始终可用**：会导致无监听时也清空选择并发出删除事件，与上游 `allowsRemoving` 语义冲突，排除。
