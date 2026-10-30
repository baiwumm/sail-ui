# 上游审计：HeroUI v3 → Vue 可行性证据

> 测量日期：2026-10-30
> 上游快照：`E:\personal-project\heroui`，`@heroui/react` / `@heroui/styles` 版本 `3.2.7`，commit `89cd95ec1`
> 参考：`E:\personal-project\nuxtui`（本地 clone 不完整，HEAD 为 `.invalid`，未用于结论）

本文只记录可复现的测量结果，不重复 spec 的决策。所有计数是对文本的原始扫描，用于估算工作量，不构成契约。

## 1. 为什么“换行为层”可行

HeroUI v3 的组件是薄封装，行为在 React Aria Components（RAC）；样式只依赖 DOM 契约。

| 证据 | 数值 |
|---|---|
| `packages/styles` CSS 文件 | 96 |
| CSS 总行数 | 9,959 |
| `packages/styles/components` 组件 CSS | 86 |
| `packages/styles/src/components` 变体模块 | 85 |
| `packages/react/src/components` 目录 | 87（含 `rac`、`icons` 等内部目录） |
| React 源码中唯一 `data-slot` 值 | 334（T02 完整提取；早期 JSX-only 统计为 332，漏掉 2 个对象键形式） |
| 上游 CSS 中出现的 `data-*` 选择器种类 | 65 |

关键点：CSS 选中的是 `[data-hovered="true"]`、`[data-selected="true"]`、`[data-open="true"]` 这类属性，没有任何 React 运行时痕迹。只要 Vue 侧产出同样的 DOM/ARIA，视觉即可一致。

### 1.1 上游 CSS 高频状态属性

| 属性 | CSS 中出现次数 | 备注 |
|---|---:|---|
| `data-slot` | 253 | 组件硬编码 |
| `data-placement` | 98 | HeroUI 自己的 modal/drawer placement，不是 Floating UI `data-side` |
| `data-focus-visible` | 76 | 多数有 `:focus-visible` 原生回退 |
| `data-selected` | 76 | 关键差异项，Reka 部分用 `data-state="checked/on"` |
| `data-hovered` | 70 | Reka 不发射，需要 `:hover` 别名或 `useHover` |
| `data-focused` | 52 | Reka 有 `data-focused` |
| `data-pressed` | 50 | Reka 部分组件有，需要 `:active`/`usePress` 补齐 |
| `data-exiting` | 48 | 覆盖层退场，必须自研状态机 |
| `data-disabled` | 47 | Reka 以 presence 形式发射 |
| `data-invalid` | 39 | Reka 原生有 |
| `data-entering` | 31 | 覆盖层进场，必须自研状态机 |
| `data-expanded` | 14 | Reka 多为 `data-state="open"` |
| `data-indeterminate` | 14 | Reka 为 `data-state="indeterminate"` |
| `data-outside-month` | 17 | Reka 为 `data-outside-view` |
| `data-open` | 10 | Reka 为 `data-state="open"` |

### 1.2 上游交互态写法

`packages/styles/components/button.css`：

```css
&:focus-visible:not([data-focused]),
&[data-focus-visible="true"] { @apply status-focused; }

&:active,
&[data-pressed="true"] { ... }

@media (hover: hover) {
  &:hover,
  &[data-hovered="true"] { ... }
}
```

`AGENTS.md` 明确要求“交互态必须同时支持伪类与 data 属性”。这为“用 Vue 无头原语 + 属性适配”留下了后门，但也意味着少数只依赖 data 属性的组件必须由我们补状态（如 `switch`、`radio-group` 的内部 slot）。

## 2. Reka UI 2.11.0 实测

安装 `reka-ui@2.11.0` 后核对：

| 项 | 结果 |
|---|---|
| peer dependency | `vue >= 3.4.0` |
| 导出总数 | 521 |
| `ConfigProvider` | 存在（locale / dir） |
| `FieldRoot / FieldLabel / FieldDescription / FieldError / FieldControl / FieldValidity` | 存在 |
| `ToastProvider / ToastPositioner / ToastViewport / useToastManager / createToastManager` | 存在 |
| `DrawerRoot / DrawerPopup / DrawerSwipeArea / DrawerHandle` | 存在 |
| `SelectRoot / CalendarRoot / PinInputRoot` | 存在 |
| `TableRoot` | **不存在** |

### 2.1 Reka 实际发射的属性（节选）

`data-state`、`data-disabled`、`data-orientation`、`data-readonly`、`data-invalid`、`data-selected`、`data-highlighted`、`data-focused`、`data-focus`、`data-pressed`、`data-expanded`、`data-today`、`data-unavailable`、`data-outside-view`、`data-side`、`data-align`、`data-placeholder`、`data-complete`、`data-dirty`、`data-touched`。

**不发射**：`data-hovered`、`data-focus-visible`、`data-open`、`data-entering`、`data-exiting`、`data-outside-month`、`data-placement`。

结论：

- 能用别名解决的：`data-open`、`data-expanded`、`data-indeterminate`、`data-outside-month`、`data-disabled`、`data-selected`（按组件核对）。
- 必须写 composable/状态机的：`data-hovered`、`data-focus-visible`、`data-entering` / `data-exiting`。
- 必须由组件自己写的：`data-slot`、`data-placement`，以及上游特有的 `data-frontmost`、`data-stack-index`、`data-snap-points` 等。

### 2.2 缺口

| 缺口 | 方案 |
|---|---|
| `Table` | `@tanstack/vue-table` + 自建 DOM/ARIA；Reka 无 TableRoot |
| `Meter` | 自研 `role="meter"`，Reka `Progress` 只覆盖 progressbar |
| `ScrollShadow` | Reka `ScrollArea` + 自建滚动阴影侦测 |
| `ColorInputGroup` / `DateInputGroup` | 上游内部组合组件，自研组合 |
| 覆盖层退场保持 | 自研 `useOverlayState` / exit hold，复刻上游行为 |

## 3. 覆盖层退场的真实复杂度

上游 `use-overlay-exit-hold.ts` 不是简单的 `setTimeout`：

- 关闭时先设置 `data-exiting`，等 CSS 动画真正运行；
- 处理 WebKit 在 layout effect 里 `playState` 仍为 `pending` 的情况；
- 用 `animationend` / `animationcancel` + `getAnimations()` + 最长动画时长兜底；
- 退场结束前把 opacity 钉为 0，再在下一帧前卸载，避免 fill-mode `none` 把 opacity 恢复为 1；
- `shouldSkipAnimation` 时立即卸载。

Vue 侧必须复刻这些语义，否则会出现“关闭闪烁”或“退场动画被跳过”。详见 [Spec §5.4](../spec/0001-heroui-v3-vue-port.spec.md) 与 [Ticket 05](../spec/tickets/05-overlays.md)。

## 4. Vue 复合组件 API 的真实行为

计划稿曾假设 `Object.assign(Component, {...})` 后可以在模板里写 `<Select.Trigger>`。实测（`@vue/compiler-sfc` 3.x）：

```html
<Select.Root><Select.Trigger /></Select.Root>
```

编译结果：

```js
const _component_Select46Trigger = _resolveComponent("Select.Trigger")
const _component_Select46Root = _resolveComponent("Select.Root")
```

即：模板把 `Select.Trigger` 当作**字符串组件名**去解析，而不是把 `Select` 当作 setup 绑定再取属性。`<script setup>` 里的 `import { Select }` 不会让 `<Select.Trigger>` 自动可用。

结论（见 [ADR 0004](../decisions/0004-compound-component-api.md)）：

- 模板主 API 用命名导出：`CardHeader`、`SelectTrigger`；
- 同时导出复合对象 `Card` / `Select`，用于 `<component :is="Select.Trigger" />` 和程序化访问；
- 不承诺静态 `<Select.Trigger>`，除非用户/插件显式全局注册该名字。

## 5. npm 与生态（计划稿实测，发布前需复核）

来自 `VUE_PORT_PLAN.md` 的 npm 探测（2026-10-30）：

| 候选 | 结果 |
|---|---|
| `@vela-ui/react` | 已占用（2.0.30） |
| `@vela/ui` | 已占用（0.6.34） |
| `sail-ui` / `@sail-ui/*` | 未发现（8 个子包名均 404） |
| `mast-ui` / `reef-ui` / `zephyr-ui` | 未发现 |

`@nuxt/ui@4.12.0` 依赖：`reka-ui 2.11.0`、`tailwind-variants ^3.2.2`、`tailwindcss ^4.3.3`、`@internationalized/date ^3.12.4`，与 HeroUI v3 的底座同构。

发布前必须重新确认：npm scope 归属、GitHub org、域名、商标检索。文档中的“未发现”只代表当时 404，不代表所有权。

## 6. 许可证观察

上游元数据存在不一致：

- 根 `LICENSE`：Apache-2.0；
- `packages/styles/package.json`：`"license": "Apache-2.0"`；
- `packages/styles/README.md` 末尾却写 “MIT”。

Sail UI 采取保守策略：按 Apache-2.0 处理上游 CSS，并在 [NOTICE](../../NOTICE) 中保留版权与来源。发布前如需进一步确认，应联系上游或做一次法律审阅。

## 7. 参考仓库状态

| 仓库 | 状态 | 影响 |
|---|---|---|
| `../heroui` | 可用，已固定 commit | 契约来源 |
| `../nuxtui` | clone 不完整（`.git/HEAD` 指向 `refs/heads/.invalid`，工作区为空） | 不能作为实现依据；如需参考，重新 clone |

## 8. 复现命令（PowerShell）

```powershell
# CSS / 行数 / 属性计数
Get-ChildItem packages\styles -Recurse -File -Filter *.css

# 唯一 data-slot
Select-String -Path packages\react\src\components\*\*.tsx -Pattern 'data-slot="([^"]+)"' -AllMatches

# Reka 属性
Select-String -Path node_modules\reka-ui\dist\**\*.js -Pattern '"data-[a-z-]+"' -AllMatches
```

> 计数会随上游提交变化。每次同步上游后重跑，并把差异写进同步 PR。
</content>
