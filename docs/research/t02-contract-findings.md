# T02 契约工具链实测结论

> 测量日期：2026-10-30
> 上游：HeroUI `3.2.7`，commit `89cd95ec17dfbbf952ef0d61af300f287aec223d`
> 环境：Windows 10.0.26200 / Node `24.15.0` / pnpm `10.34.7` / 系统 Chrome + Playwright WebKit `2370`
> 范围：属性归属、生成器、`data-slot` 快照、同步脚本、契约测试、CI、故障注入

本文记录 T02 的实测数字与偏离 ticket 初稿的地方。T01 的链路结论见 [M0 findings](./m0-spike-findings.md)。

## 1. 结论总览

| 项                | 结果                                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| `attributes.json` | 65 条：compat 12 / component 52 / native 0 / reka 1                       |
| 上游 CSS          | 96 个，逐字节原样；生成 86 个组件文件                                     |
| scope             | 85 个组件，与上游组件 CSS 一一对应（`index.css` 除外）                    |
| 别名              | 263 个选择器，分布在 50 个生成文件                                        |
| `data-slot`       | 334 个唯一值 / 81 个组件（ticket 初稿为 332，已校正）                     |
| 确定性            | 连续两次生成，manifest 与 86 个生成文件哈希完全一致                       |
| 故障注入          | 3 项全部按预期红/绿                                                       |
| `pnpm verify`     | 通过（lint 7/7、typecheck 10/10、contract 45、unit 18、SSR 2、build 7/7） |
| 视觉 / 浏览器     | 8/8 视觉用例、18/18 浏览器用例通过                                        |

## 2. `data-slot`：332 → 334

ticket 初稿的 332 来自只匹配 JSX 字面量（`data-slot="button"`）的提取方式。完整提取还必须包含对象键形式：

```tsx
"data-slot": "select-indicator"
"data-slot": "autocomplete-indicator"
```

这两个值只以对象键出现，因此被初稿漏掉。最终快照为 **334 个唯一值 / 81 个组件**，提取规则：

- 扫描 `packages/react/src/components/**`；
- 匹配 `data-slot` 作为 JSX 属性或对象键的字符串字面量；
- 排除 `rac/`、`icons.tsx`、`*.stories.tsx`、`*.test.tsx`、`*.d.ts`；
- 校验唯一性、排序、总数与 pin。

`gen-data-slots.mjs --check` 在无源码时也能验证快照内部一致性，并在源码 git `HEAD` 可用时比对 pin。差异没有静默改写 ticket，而是保留在验收记录与 [ADR 0003](../decisions/0003-style-fork-and-compat-layer.md) 中。

## 3. 属性归属

| owner       | 数量 | 代表属性                                                                                                                             |
| ----------- | ---: | ------------------------------------------------------------------------------------------------------------------------------------ |
| `compat`    |   12 | `data-hovered`、`data-pressed`、`data-focus-visible`、`data-open`、`data-expanded`、`data-selected`、`data-disabled`、`data-invalid` |
| `component` |   52 | `data-slot`、`data-entering`、`data-exiting`、`data-placement`、`data-focused`、`data-theme`                                         |
| `native`    |    0 | 原生回退全部由 `compat` 追加原生伪类实现，因此没有单列条目                                                                           |
| `reka`      |    1 | `data-orientation`                                                                                                                   |

评审中确认的两个关键点：

1. **`data-focused` 是 component-owned**。React Aria 在聚焦时设置它来抑制原生焦点环；Vue 由 `useFocusRing` / Reka FieldRoot 发射 presence 形式。T01 生成器曾给 `input.css` 追加 `[data-focused]` 自别名，T02 删除，改由组件发射。
2. **`data-expanded` 有 per-component 例外**。`sheet` 与 `toast` 是自绘表面，会自己设置 `data-expanded`，因此 `except: ["sheet", "toast"]`，避免 `[data-state="open"]` 错误命中。

别名总数从 T01 的 29（8 个文件）增加到 263（50 个文件），原因是 scope 从 15 扩到 85 个组件，并补齐了 `data-focus` → `[data-highlighted]`、`data-focus-within` → `:focus-within`、`data-outside-month` → `[data-outside-view]` 等映射。别名仍只在原规则位置追加，不改变层叠顺序。

## 4. 生成器防护

`gen-compat.mjs` 现在会在写盘前失败于：

- 上游出现未登记属性；
- 清单里有未使用属性、重复键、非法 owner/key；
- `compat` 缺少 `map`、`map` 为空/重复/非法选择器；
- 非 `compat` 声明 `map`，或 `except` 引用未知组件；
- `scope.json` 与上游组件 CSS 不一致；
- `data-slots.json` 的 pin 不一致，或 `total` 与分组求和不符。

`--check` 额外验证：

- `manifest.json` 逐字节等于期望输出；
- 每个生成文件内容等于期望输出；
- 没有多余生成文件；
- 上游文件增/删/改会提示 `run pnpm sync:styles`。

## 5. 故障注入记录

### 5.1 删除 Button 的 `data-hovered`

从 `packages/vue/src/components/button/button.vue` 移除绑定后：

```
FAIL  packages/vue/src/__tests__/contract.contract.test.ts > ... > Button exposes hover, press, focus, and pending
AssertionError: expected undefined to be 'true'
 ❯ contract.contract.test.ts:296  expect(button.attributes("data-hovered")).toBe("true");

Test Files  1 failed | 3 passed (4)
Tests       1 failed | 44 passed (45)
```

恢复后 45/45 通过。

### 5.2 上游出现未知属性

在临时 upstream 副本的 `components/button.css` 追加 `[data-foo="true"]`：

```
Unknown data attribute: data-foo (components/button.css)
Choose an owner in packages/styles/contracts/attributes.json
```

退出码 1；真实快照未被修改。

### 5.3 手改生成物

向 `generated/components/button.css` 追加一条规则：

```
gen-compat check failed:
- generated/components/button.css is stale
```

重新 `pnpm gen:compat` 后 `--check` 通过。

### 5.4 同步拒绝

`sync-styles.contract.test.ts` 的 9 个用例使用临时 git 源覆盖：哈希不符、版本不符、`--allow-upstream-change` 缺少 `--commit`、commit 与 `HEAD` 不符、`--check` 携带 `--source`、显式升级复制 98 文件并更新 pin。拒绝信息会先指出内容哈希差异，再指出版本/commit 差异。

## 6. 门禁结果

| 门禁                   | 结果                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `pnpm lint`            | 7/7 包，0 warning                                            |
| `pnpm typecheck`       | 7 个包 + Nuxt fixture，0 error                               |
| `pnpm typecheck:tests` | 0 error                                                      |
| `pnpm check:styles`    | 96 CSS + LICENSE + README 与 pin 一致                        |
| `pnpm check:slots`     | 334 唯一值 / 81 组件                                         |
| `pnpm check:compat`    | 96 upstream / 85 scoped / 65 attrs / 263 aliases / 334 slots |
| `pnpm test:contract`   | 45/45（styles 30 + Vue 15）                                  |
| `pnpm test`            | 18/18                                                        |
| `pnpm test:ssr`        | 2/2                                                          |
| `pnpm test:browser`    | 18/18（Chromium + WebKit）                                   |
| `pnpm test:visual`     | 8/8，light/dark 四组件                                       |
| `pnpm build`           | 7/7                                                          |

`pnpm verify` 首次在冷环境运行时暴露了一个流水线问题：Nuxt fixture 的 `typecheck` 依赖工作区包的 `dist/*.d.ts`，而 `typecheck` 早于 `build`。在 `turbo.json` 为 `nuxt-fixture#typecheck` 增加 `dependsOn: ["^build"]` 后，冷环境门禁可通过。

## 7. 契约测试的已知缺口

`packages/vue/src/__tests__/contract.contract.test.ts` 的 `STATE_COVERAGE` 表要求每个 CSS 使用的属性要么被断言，要么登记为缺口。当前记录：

- Modal 的 `data-exiting` 由浏览器视觉/动画套件覆盖，jsdom 无法可靠测量退场；
- Modal close button 与 role=option 的 `data-focus-visible` 受焦点陷阱与 jsdom 伪类限制，交给浏览器套件；
- `data-required` 由 `label--required` 类表达，未单独发射属性；
- Select 的 `data-disabled` 走原生 `:disabled` 回退；
- 其余缺口均标注了原因，不允许无说明的“CSS 需要但 DOM 没有”。

这些是风险接受，不是静默通过；新增组件时必须补自己的表项。

## 8. 遗留风险

| 风险                                                    | 状态                                                              |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| 视觉基线仅 Chromium                                     | WebKit 视觉仍待独立 ticket                                        |
| CI 只跑契约/SSR，不跑浏览器/视觉                        | `.github/workflows/contract.yml` 的职责边界；完整矩阵留给发布门禁 |
| `sync:styles` 依赖本地 git checkout，不下载 npm tarball | 已在 ADR 0003 记录为当前实现；tarball 同步如需要另开 ticket       |
| Select trigger 的 ARIA、SSR 选中文本、ModalTrigger 标签 | 仍归 T05，本次未改组件行为                                        |
| 其余 80 个组件的契约表                                  | 随各自 ticket 增加，T02 只覆盖 4 个 spike 组件及其 parts          |

## 9. 复现命令

```bash
pnpm install
pnpm verify
pnpm test:contract   # 45
pnpm test:ssr        # 2
pnpm test            # 18

pnpm check:styles
pnpm check:slots
pnpm check:compat

# 维护者本地同步（需要 ../heroui）
pnpm sync:styles --source ../heroui

# 视觉与浏览器（需要系统 Chrome 或 Playwright 浏览器）
PLAYWRIGHT_CHANNEL=chrome pnpm test:browser  # 18
PLAYWRIGHT_CHANNEL=chrome pnpm test:visual   # 8
```
