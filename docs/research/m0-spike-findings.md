# M0 spike 实测结论（T01）

> 测量日期：2026-10-30
> 上游：HeroUI `3.2.7`，commit `89cd95ec17dfbbf952ef0d61af300f287aec223d`
> 环境：Windows 10.0.26200 / Node `24.15.0` / pnpm `10.34.7` / Chrome（系统安装）与 Playwright WebKit `2370`
> 范围：Button、Input、Modal、Select 四个组件与最小测试闭环

本文只记录 T01 的实测结果与遗留问题，不重复 spec/ADR 的决策。所有数字来自仓库内脚本或门禁输出，可按第 6 节复现。

## 1. 结论总览

| 决策 | 结论 | 主要证据 |
|---|---|---|
| D1 上游 CSS 在 Tailwind v4 下原样编译 | 通过 | 96 个上游 CSS 文件未改动；88 个文件含 `@apply`，`@theme inline`/`@utility` 正常；playground 构建 CSS 467.65 kB；视觉对比通过 |
| D2 `gen-compat` 原位扩展不破坏层叠 | 通过 | 86 个生成文件；29 个别名分布在 8 个文件；7 条生成器契约测试；`--check` 确定性通过 |
| D3 Reka 产出上游 `data-slot` / `data-*` | 通过（有归一化） | 5 条 SSR 契约快照；Modal/Select 状态属性由组件 + `useOverlayState` 补齐 |
| D4 退场 hold 在 Chromium / WebKit 不闪烁、不提前卸载 | 通过 | 浏览器测试 9 × 2 引擎全部通过；WebKit `pending` 动画按帧重试 |
| D5 命名导出与 `<component :is="Select.Trigger" />` | 通过 | 浏览器 compound 测试；静态 `<Select.Trigger>` 按 ADR 0004 预期不可用 |
| D6 SSR 无 hydration mismatch；关闭的覆盖层无 DOM | 通过（Select 有已知限制） | 契约/SSR 测试；Nuxt dev 下 hydration 0 warning；预先选中值的 SelectValue 需应用侧规避 |
| D7 Button 透传与 `tv()` 变体 | 通过 | jsdom 透传测试；变体/尺寸/hover/focus 视觉 diff 为 0 |
| D8 子路径与类型在 Vite/Nuxt 可解析 | 通过 | playground、Nuxt fixture、tarball 安装三方验证 |

## 2. 量化结果

### 2.1 样式与生成器

| 指标 | 数值 |
|---|---:|
| 上游快照 CSS 文件 | 96 |
| 生成组件 CSS | 86 |
| `attributes.json` 条目 | 18（compat 9 / component 8 / reka 1） |
| T01 scope 组件 | 15 |
| 生效别名总数 | 29 |
| 含别名的生成文件 | 8 |
| 记录在 manifest 的待归属属性 | 47 |

别名分布：`select` 8、`list-box-item` 7、`input` 5、`button` 3、`close-button` 2、`label` 2、`modal` 1、`textfield` 1。

### 2.2 门禁与测试

| 门禁 | 结果 |
|---|---|
| `pnpm lint` | 7/7 包通过，0 warning |
| `pnpm typecheck` / `typecheck:tests` | 7/7 包通过 / 0 error |
| `pnpm test:contract` | 12/12（生成器 7 + 组件 5） |
| `pnpm test` | 18/18（jsdom 行为） |
| `pnpm test:ssr` | 2/2 |
| `pnpm test:browser` | 18/18（9 用例 × Chromium + WebKit） |
| `pnpm test:visual` | 8/8 用例，30 张对比图，最大 diff ratio `0.00426`（阈值 `0.01`） |
| `pnpm build` | 7/7 包（含 Nuxt Nitro） |
| `pnpm pack:check` | tarball 安装 47 个依赖后 SSR 渲染 Button 通过 |

视觉对比的剩余差异集中在禁用态文字与 loading 图标（`input-disabled-dark` 131 px / `0.00426`，`button-states-*` 38 px / `0.00110`），其余变体、尺寸、hover、focus、Modal、Select trigger 均为 0；判断为字体抗锯齿差异，不是类名或层叠差异。

## 3. 逐项结论

### D1 上游 CSS 在 Tailwind v4 下原样编译

`packages/styles/index.css` 先导入 Tailwind 4 与 `tw-animate-css`，再显式分层导入上游资源：

```css
@layer theme, base, components, utilities;
@import "tailwindcss";
@import "./upstream/base/base.css" layer(base);
@import "./generated/components/index.css" layer(components);
@import "./upstream/themes/default/index.css" layer(theme);
@import "./upstream/utilities/index.css";
@import "./upstream/variants/index.css";
```

上游 88 个文件使用 `@apply`，`themes/shared/theme.css` 使用 `@theme inline`，`utilities/index.css` 使用 `@utility focus-ring` 等；在 Tailwind `4.3.3` 下全部编译成功。playground 产物 CSS 为 467.65 kB，四个组件的截图与 React 参照对齐，说明编译结果没有丢失声明或改变层叠。

### D2 `gen-compat` 原位扩展

生成器用 PostCSS AST 在原有选择器列表中追加别名，不重建规则：

- 规则顺序、声明顺序与层叠层保持不变（契约测试逐条断言）；
- `--check` 连续运行输出哈希一致；
- manifest 记录 86 个源文件哈希、生成哈希、别名数量和 scope；
- 不在 `:not()` 内展开别名（避免语义反转）；
- 若同一规则的选择器列表已包含目标别名（如 `:focus-visible`），不再重复追加。

spike 期间别名从 39 降到 29，原因见 4.1；降低后 Select popover 的视觉差异从 1.7% 回落到 0.085%。

### D3 Reka 属性词汇归一化

Reka 原生发射：`data-state`、`data-highlighted`（presence）、`data-disabled`（presence）、`data-placeholder`（presence）、`data-side`、`data-orientation`。

Sail 组件/primitive 补齐上游词汇：

| 上游属性 | 来源 |
|---|---|
| `data-slot` | 每个 part 显式设置，含内置 chevron `select-default-indicator` |
| `data-open` | `useOverlayState` 的 `isOpen` |
| `data-entering` / `data-exiting` | `useOverlayState` 状态机 |
| `data-placement` | 组件（Modal 为 `auto`，Select 由 `data-side` 映射） |
| `data-hovered` | `useHover` |
| `data-pressed` | `usePress` |
| `data-focus-visible` | `useFocusRing`（键盘模态门槛，见 4.1） |
| `data-focused` | `useFocusRing.isFocused`（Select item） |
| `data-selected` | 组件按 Reka model 计算 |
| `aria-modal` | Modal dialog |

覆盖层把 Reka 的受控 `open` 绑定到 `isMounted`，而不是 `isOpen`；这是退场 hold 能保留 DOM 的前提。

契约快照断言了四个组件的 core slots：

- Button：`["button"]` + `button--danger` / `button--lg` / `type="button"`；
- Input 组合：`textfield, label, input, description, field-error` + `data-visible="true"`；
- 关闭 Modal：仅 `modal-trigger`，无 backdrop/dialog；
- 关闭 Select：`select, select-trigger, select-value, select-clear-button, select-clear-button-icon, select-default-indicator`，无 popover/listbox。

### D4 退场 hold

实现位于 `packages/primitives/src/use-overlay-state.ts`：

- 关闭后先置 `isExiting`，下一帧再测量 `getAnimations({subtree: true})`；
- 只统计目标为覆盖层自身或 `data-exiting="true"` 子树的动画；
- WebKit 的 `playState === "pending"` 最多重试 10 帧；
- 同时监听 `animationend`/`animationcancel`、`animation.finished`，并以 `duration + 80ms` 兜底；
- 卸载前一帧把 opacity 固定为 `0`，`nextTick` 后再恢复，避免 WebKit `fill-mode:none` 造成闪回；
- `shouldSkipAnimation` 只跳过测量，不影响状态机。

浏览器测试在 Chromium 与 WebKit 都验证了：Esc 关闭后 dialog 在动画结束后才 detach；点击遮罩关闭；焦点陷阱连续 8 次 Tab 不逃逸；Select 键盘打开、提交、清除。

### D5 复合 API

命名导出是文档与模板的主 API；复合对象通过 `<component :is="Select.Root">` 等动态组件使用。浏览器测试以 `?compound=1` 验证了 Root/Trigger/Value/Popover/ListBox/Item 全部解析，并能打开与提交。

静态 `<Select.Trigger>` 依赖模板编译器把对象属性识别为标签，在 `<script setup>` 的导入对象上不可用；ADR 0004 已把它标记为预期失败，文档不得使用。

### D6 SSR 与 hydration

- 契约测试：关闭的 Modal/Select 不渲染 portal DOM；打开状态的 Modal 在服务端只输出 trigger 的 `aria-expanded="true"` 与 `aria-controls`，overlay 仍由 Reka `Teleport` 在客户端挂载。
- Nuxt fixture 生产构建的 SSR HTML 含预期 slots：`button, textfield, label, input, modal-trigger, select, label, select-trigger, select-value, select-default-indicator`；不含 `modal-backdrop`、`modal-dialog`、`select-popover`。
- Nuxt dev（`http://localhost:3101/`）用系统 Chrome hydrate：服务端与客户端 select 文本一致，输入值保留，Modal 可打开且焦点陷阱生效，Select 可选择并提交，console 0 warning。
- 已知限制：Reka 的 `SelectValue` 从客户端挂载的 options 集合读取选中文本。若 `modelValue` 预先赋值，服务端输出 placeholder、客户端输出标签，形成文本 hydration 差异。fixture 以“初始不选中”保持确定性；SSR 安全的选中文本 API 留待后续 Select ticket（见第 5 节）。

### D7 Button 透传与变体

jsdom 测试覆盖 `class`、`style`、`$attrs` 合并到原生按钮、指针/键盘 press 回调、`isDisabled`/`isLoading` 阻断交互、hover 与 focus-visible 属性。视觉对比中变体、尺寸、hover、focus 的 diff 为 0；loading 与禁用态仅有抗锯齿级差异。

### D8 打包与子路径

- playground 与 Nuxt fixture 均通过 `@sail-ui/vue/button` 等子路径导入；
- `pack:check` 把 `styles`、`primitives`、`vue` 打成 tarball，在临时目录用 npm 安装，SSR 渲染 Button，断言 `data-slot="button"`、`button--danger`、样式入口 `@sail-ui/styles/css` 可解析；
- 构建过程无循环依赖告警，`.d.ts` 随每个入口产出。

## 4. Spike 中发现并处理的问题

### 4.1 focus-visible 与 `data-focused`

上游 `list-box-item.css` 的选择器是：

```css
&:focus-visible:not([data-focused]),
&[data-focus-visible="true"] { ... }
```

Reka 在弹层打开时会以程序方式聚焦选项，Chromium 对程序化焦点也返回 `:focus-visible`。最初把 `data-focus-visible` 直接别名到 `:focus-visible`，并让生成器追加裸 `:focus-visible`，导致鼠标打开 Select 时所有选项出现焦点环，popover 视觉差异约 1.7%。

处理：

1. `useFocusRing` 记录最近一次输入模态，只有键盘模态才置 `isFocusVisible`；
2. Select item 在聚焦时发射 presence 形式的 `data-focused`，复刻 React Aria 抑制原生焦点环的行为；
3. 生成器在 `:not()` 内不展开别名，且跳过已在同组选择器中出现的别名。

处理后别名 29 个，popover diff 降到 `0.00085`（light）/`0.00083`（dark）。

### 4.2 Modal 的 `aria-describedby`

Reka 的 `DialogContent` 总是把 `aria-describedby` 指向内部生成的 description id，即使没有 `DialogDescription`。上游 Modal 没有 description part，因此会产生指向缺失元素的引用，并在 dev 下打印 warning。

处理：`ModalDialog` 只转发消费者显式提供的 `aria-describedby`，默认不输出该属性。Nuxt dev hydration 检查的 console warning 随之清零。若未来新增 description part，需要恢复条件关联。

### 4.3 Select trigger 的 ARIA 差异（未解决）

| | 上游 React | Sail（Reka） |
|---|---|---|
| 元素 | `<button>`（RAC Button） | `<button>` |
| role | 原生 button role | `role="combobox"` |
| 弹出提示 | `aria-haspopup="listbox"` | 无 `aria-haspopup` |

CSS 不依赖这两个属性，视觉无差异；属于可访问性/语义 parity 欠账，留给 Select 正式实现（T05）决定是保留 Reka combobox 模式还是归一化到上游。

另外，上游 `Modal.Trigger` 渲染 `<div role="button" data-slot="modal-trigger">`，Sail 的 `ModalTrigger` 是原生 `<button>`。上游文档的默认写法是普通 `Button`，视觉与键盘行为不受影响；作为 API parity 项记录。

### 4.4 Tooling / 环境

- Playwright 自带 Chromium（build 1248）从官方 CDN 下载被限速，spike 使用系统 Chrome：`PLAYWRIGHT_CHANNEL=chrome`。CI 仍应使用固定 Playwright 浏览器。
- WebKit `2370` 通过 npmmirror 安装成功：

  ```bash
  PLAYWRIGHT_DOWNLOAD_HOST=https://cdn.npmmirror.com/binaries/playwright pnpm exec playwright install webkit
  ```

- Windows 上 Vite preview 默认绑定 IPv6，Playwright 访问 `127.0.0.1` 会超时；两个 Playwright 配置的 preview 命令均加了 `--host 127.0.0.1`。
- Nuxt dev 只监听 `[::1]`，hydration 检查使用 `http://localhost:3101/`。
- Nuxt 4 dev 首次发现 `reka-ui`、`tailwind-variants` 时会触发页面 reload；fixture 已在 `vite.optimizeDeps.include` 预置。
- Nuxt 构建产物不在 `dist/**`，`turbo.json` 为 `nuxt-fixture#build` 单独声明 `.nuxt/**` 与 `.output/**`，消除 turbo 缓存告警。

## 5. 遗留项与后续 ticket

| 项 | 交给 |
|---|---|
| `attributes.json` 从 18 扩到 65，47 个 pending 属性逐个归属 | T02 |
| 从上游 React 源码生成 `data-slot` 快照；故障注入 CI | T02（已完成，完整提取为 334 值，见 [T02 findings](./t02-contract-findings.md#2-data-slot332--334)） |
| `sync-styles`、维护文档、owner 分布写回 ADR 0003 | T02 |
| Select trigger `role`/`aria-haspopup` 决策与实现 | T05 |
| 预先选中值的 SSR 安全文本 API（如 `SelectValue` 的显式 label 或 root item map） | T05 |
| `ModalTrigger` 与上游 `div role="button"` 的标签差异 | T05 |
| WebKit 视觉回归（当前视觉仅 Chromium；跨引擎基线需分别维护） | visual ticket |
| 本地固定 Chromium 下载；CI 浏览器矩阵 | CI ticket |

T02 已完成前三条工具链欠账（属性扩到 65、快照与故障注入、同步脚本与维护文档），实测见 [T02 findings](./t02-contract-findings.md)。

## 6. 复现命令

```bash
pnpm install
pnpm verify

pnpm test:contract   # 12
pnpm test            # 18
pnpm test:ssr        # 2

# 本地未安装 Playwright Chromium 时
PLAYWRIGHT_CHANNEL=chrome pnpm test:browser   # 18（Chromium + WebKit）
PLAYWRIGHT_CHANNEL=chrome pnpm test:visual    # 8 用例 / 30 张对比

pnpm pack:check

# Nuxt SSR 与 hydration
pnpm --filter nuxt-fixture build
PORT=3100 node apps/playground/nuxt/.output/server/index.mjs
curl -s http://127.0.0.1:3100/ # 检查 data-slot 与关闭覆盖层
pnpm dev:nuxt                # http://localhost:3000，浏览器 console 应无 warning
```

## 7. 结论

T01 证明“上游 CSS fork + Reka 行为 + Vue SFC + 属性归一化”的链路成立：四个组件在 Vite 与 Nuxt SSR 中可用，视觉与 React 参照在阈值内一致，包可打包安装，退场 hold 在 Chromium 与 WebKit 均通过。主要欠账集中在完整属性归属/快照工具链（T02）以及 Select 的 ARIA 与 SSR 选中文本（T05），不影响 M0 继续推进。
