# T01 — M0 架构 spike

- Milestone: M0
- Status: Done
- Blocked by: —
- Unblocks: [T02](./02-contract-tooling.md)
- Related: [Spec §5](../0001-heroui-v3-vue-port.spec.md), [ADR 0002](../../decisions/0002-behavior-layer-reka-ui.md), [ADR 0003](../../decisions/0003-style-fork-and-compat-layer.md), [ADR 0004](../../decisions/0004-compound-component-api.md)

## What to build

用最少代码证明整条链路可行：**Button / Input / Modal / Select** 四个组件在 Vite 与 Nuxt SSR 中运行，视觉与上游 React 对齐，包可打包安装。

交付物：

1. pnpm workspace + turbo scaffold；
2. `@sail-ui/styles` 上游快照 + 最小生成链路（仅处理这 4 个组件用到的属性）；
3. `@sail-ui/primitives` 的 4 个 composable 初版；
4. `@sail-ui/vue` 的 Button / Input / Modal / Select；
5. Vite playground + Nuxt fixture；
6. 契约/SSR/视觉测试的最小闭环；
7. tarball 安装验证。

这不是“只搭骨架”：四个组件必须真实可交互、可截图、可 SSR。

## Scope

| 包                     | 内容                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `packages/styles`      | `upstream/` 快照、`scripts/gen-compat.mjs`、`attributes.json`、`generated/`、入口 `index.css` |
| `packages/primitives`  | `useHover`、`usePress`、`useFocusRing`、`useOverlayState`（含 exit hold）                     |
| `packages/vue`         | `button`、`input`、`modal`、`select`；`cn`/`tv` 工具；子路径 exports                          |
| `packages/testing`     | SSR render helper、契约快照 helper、视觉 helper                                               |
| `apps/playground`      | Vite + Vue fixture；并排 React 参考（或静态基线截图）                                         |
| `apps/playground/nuxt` | Nuxt 4 SSR fixture                                                                            |
| 根                     | `pnpm-workspace.yaml`、`tsconfig`、eslint/prettier、vitest、turbo、changesets stub            |

## Decisions to validate

- [x] **D1** 上游 CSS 能否在 Tailwind v4 下原样编译（`@apply`、layer、主题导入顺序）。
- [x] **D2** `gen-compat.mjs` 的选择器原位扩展是否保持层叠与视觉。
- [x] **D3** Reka 的 Dialog/Select 能否产出上游 `data-slot` 与 `data-*`（含 `data-open`、`data-entering`、`data-exiting`）。
- [x] **D4** 覆盖层 exit hold 在 Chromium / WebKit 下不闪烁、不提前卸载。
- [x] **D5** `<SelectTrigger>`（命名导出）与 `<component :is="Select.Trigger" />` 均可用；静态 `<Select.Trigger>` 按预期失败（文档警告）。
- [x] **D6** SSR 无 hydration mismatch；关闭的 Modal/Select 不产出 DOM。
- [x] **D7** Button 的 `class` / `style` / `$attrs` 透传到正确元素，`tv()` 变体正确。
- [x] **D8** `@sail-ui/vue/button` 子路径与类型在 Vite/Nuxt 中可解析。

## Acceptance

### 基础

- [x] `pnpm install` 在干净环境成功，lockfile 提交。
- [x] `pnpm lint` / `pnpm typecheck` 通过（0 error）。
- [x] `pnpm build` 产出 ESM + `.d.ts`，无循环依赖。
- [x] `pnpm pack:check` 在干净 Vite fixture 中安装 tarball，Button 可渲染。

### 组件

- [x] Button：primary/secondary/tertiary/outline/ghost/danger 变体，sm/md/lg，`isDisabled`/`isLoading`/`isIconOnly`，hover/press/focus-visible 状态属性。
- [x] Input：label/description/error 组合，`isInvalid`/`isRequired`/`isDisabled`，受控与非受控。
- [x] Modal：`v-model:open`，trigger/overlay/container/dialog/header/body/footer/close 的 `data-slot`，焦点陷阱、Esc、点击遮罩关闭、退场动画。
- [x] Select：`v-model`，trigger/value/popover/listbox/option 的 `data-slot`，键盘（Arrow/Enter/Esc/typeahead），`data-selected`、`data-open`。
- [x] 四个组件的 `data-slot` 与上游 React 逐项一致（T01 以契约列表核对四组件 DOM parts；全量快照由 T02 生成，完整提取为 334 值，见 [T02 findings](../../research/t02-contract-findings.md#2-data-slot332--334)）。
- [x] CSS 依赖的 `data-*` 在正确状态下出现/移除。

### 测试

- [x] jsdom 行为测试：角色/名称/事件/焦点/受控/非受控。
- [x] SSR 快照：四个组件的 server HTML 可断言；关闭的覆盖层无 DOM。
- [x] 浏览器测试：Modal 焦点陷阱与 Esc；Select 键盘与定位；Button 指针状态。
- [x] 视觉：Button/Input/Modal/Select 的 light/dark × 默认/hover/focus/disabled 截图，与参考对比通过。
- [x] Nuxt fixture：`pnpm --filter nuxt-fixture build` 通过，SSR HTML 含预期 `data-slot`，hydration 无 warning。

### 文档

- [x] `apps/playground` 有四个组件的并排 demo。
- [x] `docs/research/` 补充 M0 实测结论（尤其 D3–D6）。
- [x] 在 [Ticket 02](./02-contract-tooling.md) 中记录生成器需要补的 owner/alias。

## Outcome

- 实测结论与遗留项：[docs/research/m0-spike-findings.md](../../research/m0-spike-findings.md)。
- 门禁：lint/typecheck 7/7，contract 12/12，unit 18/18，SSR 2/2，browser 18/18（Chromium + WebKit），visual 8 用例 / 30 张对比（最大 ratio 0.00426），build 7/7，pack:check 通过。
- Nuxt fixture：生产 SSR 含预期 slots 且无关闭覆盖层 DOM；dev hydration 0 warning。
- 已知欠账：Select trigger 的 `role="combobox"`/缺失 `aria-haspopup`、预先选中值的 SSR 文本、`ModalTrigger` 标签差异；均记录在 findings 第 5 节，交给 T02/T05。

## Demo

```bash
pnpm install
pnpm dev                # Vite fixture，四个组件
pnpm dev:nuxt           # Nuxt SSR fixture
pnpm test:contract      # 四个组件契约
pnpm test:visual        # 截图对比
pnpm pack:check         # tarball 安装
```

演示时展示：

1. Button 的变体/状态；
2. Modal 的开关与退场动画（慢速 0.5x 查看）；
3. Select 的键盘选择与 `data-open`；
4. Nuxt SSR 页面源码中关闭状态的 Modal 不存在，打开后 hydrate 正常。

## Out of scope

- 其余 80 个组件；
- 文档站、Storybook 全量故事；
- Table / Meter / ScrollShadow / 日期 / 颜色；
- 发布到 npm、CI 矩阵、完整属性归属清单；
- 性能预算与 a11y 全量审计。

## Risks

| 风险                                               | 处理                                                 |
| -------------------------------------------------- | ---------------------------------------------------- |
| Tailwind v4 对上游 `@apply`/layer 的兼容问题       | 先只编译 Button/Input 的 CSS，逐步扩大；记录失败规则 |
| Reka 的 `data-state` 与上游 `data-open` 时序不一致 | 在组件层归一化；契约测试锁定                         |
| WebKit 退场动画 pending                            | 复刻 exit hold；浏览器测试留 WebKit 项目             |
| 子路径导出类型解析                                 | `pack:check` + `moduleResolution: bundler` fixture   |
| scope 未确认                                       | 不阻塞 T01；在 T09 前完成                            |

</content>
