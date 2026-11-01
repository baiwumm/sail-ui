# M3 收尾质量审查报告

- 日期：2026-11-01
- 范围：全部 84 个公共组件（T03–T08 已交付部分）+ `useOverlayState` 等 primitives
- 方法：6 组并行对照审查（上游 `heroui@3.2.7` / commit `89cd95ec1` 的 React 源码 + CSS + RAC/react-aria 发行源码），逐组件 diff DOM 契约、状态属性、键盘行为、ARIA；对可疑项用 Vue 运行时/构建产物实证。
- 结果：**发现 P0×1、P1×13、P2×18、P3×40+；P0/P1/P2 全部修复或有明确处置**；误报 2 条已核实排除。

## 门禁结果（修复后）

| 门禁                                                           | 结果    |
| -------------------------------------------------------------- | ------- |
| `pnpm verify`（format+lint+typecheck+contract+unit+ssr+build） | ✅ 全绿 |
| `pnpm test`（unit/jsdom）                                      | 506/506 |
| `pnpm test:ssr`                                                | 57/57   |
| `pnpm test:contract`                                           | 173/173 |
| `pnpm test:visual`                                             | 86/86   |
| `pnpm test:browser`（Chromium+WebKit）                         | 348/348 |

基线（修复前）：unit 504、contract 173 全绿；本次新增 5 条回归测试。

## 已修复（按严重级）

### P0（1 项）

| 组件     | 问题                                                                                                                                                   | 修复                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| textarea | 在 `<TextField>` 内经 Reka `FieldControl` 渲染成 `<input>`（缺 `as="textarea"`），多行输入完全失效且 `rows` 落空；单测只覆盖 standalone 分支所以未暴露 | 补 `as="textarea"`；新增回归测试（TextField 内渲染 `<textarea>` + rows + 继承 variant） |

### P1（13 项）

| 组件/模块                                                            | 问题                                                                                                                                                                                                  | 修复                                                                                                                                                                   |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 74 个部件（跨 24 展示 + 19 表单 + 7 覆盖层 + select + button-group） | **消费者 class 双次渲染**：`cx(..., attrs.class)` 已合并 class，模板又 `v-bind="$attrs"`，Vue `mergeProps` 拼接导致 `class="consumer base consumer"`（用项目内 Vue 3.5.44 实证）。违反 AGENTS.md §8.3 | 全部收口为 `useForwardedAttrs()`（`forwarded` 转发、`className.value` 进 cx 合并一次）；含 typography 包装部件（经 `:class="className"` 下传）与 avatar 手写剥离的统一 |
| primitives `useOverlayState`                                         | 退场/入场动画收集按"根包含目标"过滤，任意子孙动画都会延长 hold——Modal 内的 Spinner/Skeleton shimmer（无限动画）使卸载被推迟到最长子动画 + 80ms，且 `animationend` 永不满足                            | 排除 `iterations === Infinity` 的动画（永不 finish、等待无意义，且不属于退场编排）；Drawer/Sheet 依赖的祖先选择器触发的有限子动画保持计数。新增回归测试                |
| textarea                                                             | `withDefaults` 强制 `variant: "primary"` 遮蔽 `TextField` 上下文回退（同根因见 checkbox/input-group）                                                                                                 | 去掉 variant 默认值，恢复 `?? textField` 链                                                                                                                            |
| checkbox / checkbox-group                                            | 组的 variant 传播链断裂：context 未提供 variant，成员强制 primary → `<CheckboxGroup variant="secondary">` 视觉 parity 破坏                                                                            | group context 增加 `variant`，成员回退继承；新增回归测试                                                                                                               |
| input-group                                                          | 不注入 TextField 上下文，variant 强制 primary → `.input-group--secondary` 分支全部失效                                                                                                                | 注入 `textFieldContextKey` 回退 + 去默认值                                                                                                                             |
| toggle-button-group                                                  | single 模式复用 Reka RadioGroupItem，点击已选中项无法反选；上游 RAC 允许反选                                                                                                                          | 在 item 上拦截已选中项的 click（`preventDefault` 中断 Reka 的重选中，经组上下文 toggle 置空）；补测试断言                                                              |
| list-box                                                             | 条目清除 Reka 的 `data-state`（上游 DOM 契约正确决定）后，Reka `highlightSelected()` 依赖该属性定位 roving-tabindex 锚点 → 永远回退第一项，Tab 进入列表落在首项而非选中项                             | root 模板引用 Reka 实例，selection 变化/挂载后经 `highlightItem(value)`（值比较）重设锚点（setTimeout 0 让 Reka 的首项回退先落地）                                     |
| table                                                                | 虚拟化分支 `#cell-<key>`/`#cell` 插槽把 TanStack `Row` 包装对象当 `row` 传入（非虚拟化传 `.original`，类型契约也是原始数据行）                                                                        | 两处改为 `item.row.original`                                                                                                                                           |
| input-otp                                                            | `inputMode` prop（默认 numeric）是死代码，槽位 input 永远渲染 `inputmode="text"`，移动端数字键盘与 `pattern="[0-9]*"` 丢失                                                                            | context 透传 `inputMode`，槽位绑定 `:inputmode`（fallthrough 覆盖 Reka 显式值；`type` 保持 text 以维持字符串模型）                                                     |
| close-button                                                         | 禁用（非 pending）时缺 `aria-disabled="true"`（上游 react-aria useButton 语义）                                                                                                                       | `(isPending                                                                                                                                                            |     | isDisabled) ? 'true' : undefined` |
| fieldset（级联）                                                     | 禁用不级联：无任何组件消费 fieldset 上下文；原生 `<fieldset disabled>` 只能拦原生表单元素，Link/Button/开关组等不受影响（上游经 RAC Context 注入 7 类组件）                                           | 新增 `shared/disabled-cascade.ts`；fieldset 提供，Button/Link/CheckboxGroup/RadioGroup/Slider/ToggleButton/ToggleButtonGroup 消费（与上游注入清单一致）                |
| date-range-picker                                                    | `valueInvalid` 只校验 `end ?? start` 一端；start 越界或反向区间不判 invalid → `aria-invalid`/`data-invalid` 缺失                                                                                      | start/end 分别校验 + `end < start` 反向检查（对齐 react-stately）                                                                                                      |
| dropdown-trigger                                                     | `triggerId` 仅在 setup 赋值一次，消费方动态改 `id` 后 `aria-controls` 不跟随                                                                                                                          | watch attrs.id 同步                                                                                                                                                    |

### P2（18 项，全部处置）

| 组件                            | 问题                                                                                                                                                        | 处置                                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| date-picker / date-range-picker | `:dir` 只透传显式 prop；RTL 文档下 picker 弹层内 calendar 与分段不跟随（独立 Calendar 有 MutationObserver 已覆盖）                                          | 改为 `props.dir ?? useDocumentDirection()`（与 date-field/time-field 一致）                                     |
| date-picker                     | 弹层内重复点击已选中日期会清空值（Reka `preventDeselect` 默认 false；上游 RAC 不反选）→ 数据丢失风险                                                        | picker 固定传 `:prevent-deselect="true"`                                                                        |
| calendar / range-calendar       | `initialFocus` 声明未绑定的哑 prop                                                                                                                          | 绑定到 Reka primitive                                                                                           |
| range-calendar-cell             | 高亮区间含无效值时缺 `data-invalid`/`aria-invalid`（react-aria useCalendarCell 语义）                                                                       | 依 Reka range state 的 `isInvalid` + highlightedRange 计算，td 与 trigger 双输出                                |
| autocomplete / combo-box        | `name` prop 死代码（未传给 Reka ComboboxRoot，不渲染隐藏表单控件）                                                                                          | 绑定 `:name`                                                                                                    |
| combo-box-value                 | 不输出 `data-placeholder`（上游有 CSS 选择器依赖，与 autocomplete-value 不一致）                                                                            | 补 presence 输出                                                                                                |
| autocomplete-indicator          | 自定义 slot indicator 的 cloneVNode 丢失其余 forwarded attrs                                                                                                | 合并 `forwarded.value`                                                                                          |
| color-field                     | 根节点缺 RAC 的 `data-channel`                                                                                                                              | 补 `:data-channel="channel ?? 'hex'"`                                                                           |
| table                           | 虚拟化表头行缺 `aria-rowindex="1"`（显式索引 grid 下读屏无法定位表头）                                                                                      | 补                                                                                                              |
| table                           | `aria-colcount` 空列时输出 0（非法值）                                                                                                                      | `Math.max(columns.length, 1)`                                                                                   |
| table                           | `aria-rowcount` 未计 sentinel 行（读屏总行数偏差）                                                                                                          | `hasMore` 时 +1（SSR/contract 测试同步更新为 32）                                                               |
| table                           | 空状态单元格无 `table__cell`/`data-slot`（与加载行不一致）                                                                                                  | 对齐（upstream 无空状态 part，内部一致性）                                                                      |
| table                           | 加载行条件两种模式不一致（非虚拟化有数据也追加）                                                                                                            | 统一 `isLoading && rows.length === 0`（`isLoadingMore` 已覆盖追加加载）；新增"有数据时不追加"测试               |
| textarea                        | autoResize 挂载时不计算初始内容高度                                                                                                                         | `onMounted(resize)`                                                                                             |
| checkbox                        | 初始 indeterminate 不落 native input（watch immediate 在 setup 期 ref 为 null）                                                                             | `{immediate: true, flush: "post"}`                                                                              |
| button                          | loading 期间保持 `type="submit"` → `<Form>` 内 Enter 仍隐式提交（上游 pending 强制 button）                                                                 | pending 时输出 `type="button"`                                                                                  |
| form                            | IME 守卫死代码（`isComposingSubmit` 只写不读；`stopPropagation` 不能取消隐式提交；浏览器组合期本就不触发）                                                  | 删除（对齐上游：RAC 无守卫）                                                                                    |
| toolbar                         | Tab 行为与上游不一致（RAC 是单一 tab stop + 焦点记忆恢复）；分隔线不翻转（horizontal 工具栏应出 `separator--vertical`）；嵌套 toolbar 未降级 `role="group"` | 实现 Tab 捕获（focusLast/focusFirst + lastFocused 恢复）、`separatorToolbarContextKey` 翻转、onMounted 嵌套检测 |

### P3（择要处置）

已修复：overlay 各 family 的 close-trigger/headings 补 `slot="close"/"title"` 字面属性（与 toast-close/popover-heading 一致）；sheet-backdrop 退场期补 `aria-hidden`/`inert` 并转发消费方 attrs（原本静默丢弃）；radio standalone 不再以 value 充当 name；number-field label 改真实 `<label :for>`（经 labelContext 新增 `htmlFor`）；slider thumb 补 `aria-valuetext`（格式化）；input-group context 移除死 `isInvalid`；disclosure-body variants 提为常量。

## 误报核实（未改，防止"修复"上游契约）

1. **tabs-list-container 的 `data-left-scroll="false"` 等写法**——与上游 `use-scroll-shadow.ts` 逐字一致（`String(hasScrollBefore)`），上游契约就是 true/false 字符串而非 presence，CSS 以 `="true"` 精确匹配。该"违规"报告不成立，scroll-shadow 组件同理不改。
2. **alert-dialog 系列 class 双渲染**——grep 证实本就使用 useForwardedAttrs，报告与实际不符。

## 保留的现状（有意不改）

- `table` 行上的 `data-selection-mode`：不在上游词汇表，但有单测锁定，属 ADR 0005 自研扩展的内部钩子；如需移除应走契约变更流程。
- sheet 的 overlay 层 `z-index: var(--z-index-overlay)`（内联）与上游 sheet.css 字面 `z-50` 不同：遵循 AGENTS.md 层级规则，属既定决策。
- slider 的 Label 渲染为 span + `aria-labelledby`：Sail 的 thumb 无原生隐藏 input，`<label for>` 无处指向（RAC 靠每 thumb 隐藏 input）；AT 关联已由 aria-labelledby 保证，仅"点击 label 聚焦"不可用。
- checkbox/radio/switch 受控翻转边缘（React 有 restoreControlledState）：浏览器已翻转而父级拒绝的极端场景，影响极小，暂不引入强制回写复杂度。
- avatar 组上下文按注入继承不限嵌套深度（上游仅直子级）；Typo 上的纯边角场景。
- 上游 CloseButton pending 态的 live-region announce、RAC pending 进度 id：a11y 增强差异，未实现。

## 待决策（进入 T09 前建议过目）

1. **toggle-button-group single 模式方向键自动选中**（Radix radio 语义）与上游"仅移动焦点"不一致——本次已修复反选；方向键行为如需对齐需脱离 Reka RadioGroup（结构变更），建议单独 ticket 或记录为迁移差异。
2. **tooltip 缺 warmup/shouldSkipAnimation**：上游连续扫过触发器时跳过 delay/退场；Sail 每次等满 `--tooltip-delay`。实现需要跨 tooltip 的全局 warmup 状态（AGENTS 禁模块级可变状态，需通过 app 级 provider），现有测试锁定当前行为；建议 T09 迁移指南记录，或单独 ticket。
3. **ComboBox variant 上下文**：input 已留回退位，但 combo-box 未暴露 `variant`（上游有）——补 prop 属公共 API 变更，建议 T09 一并定。
4. **日期家族 timezone 注入口**：格式化/比较用 `getLocalTimeZone()`，上游经 I18nProvider 可传 timeZone；跨时区 SSR 的 min/max 校验可能 hydration 不一致（低概率）。建议经 ConfigProvider 透传，T09 规格。
5. **calendar `visibleDuration` 仅支持 months**（上游还有 weeks/days 视图）；**input-otp 缺 mask/autoComplete/textAlign/pasteTransformer**；**color-picker 缺 name**（隐藏 input 提交）——均为上游功能缺口，建议记录到迁移指南差异表，按需排期。
6. **dir 暴露面**：集合/日期根组件多数未暴露 `dir` prop（Reka 读 ConfigProvider）——T09 Nuxt module 统一配 ConfigProvider 时一并解决。

## 与本次范围外但顺带完成

- `docs/tickets/README.md`（T01–T08 状态）与 `docs/roadmap.md`（M1/M2/M3 完成项）同步更新。
- 新增回归测试 5 条：overlay 无限动画、TextField×textarea、checkbox 组 variant、toggle single 反选、table 有数据不追加 loading 行。
