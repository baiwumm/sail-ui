# 维护样式契约

本目录把 HeroUI 上游 CSS 逐字节保存为快照，并在构建期生成兼容选择器。任何“视觉对不上”的修复都必须落在**契约**（`contracts/`、组件）或**生成器**（`scripts/`）上，不能直接改 `upstream/**` 或手改 `generated/**`。

## 文件地图

| 路径                         | 角色                                                       | 能否手改                                     |
| ---------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| `upstream/**`                | 上游 `@heroui/styles` 快照（96 个 CSS + LICENSE + README） | **永不**                                     |
| `contracts/upstream.json`    | 上游包名、版本、commit                                     | 仅通过 `sync:styles --allow-upstream-change` |
| `contracts/scope.json`       | 需要生成兼容层的组件清单                                   | 是；上游新增组件时同步追加                   |
| `contracts/attributes.json`  | 65 个 `data-*` 属性的唯一 owner                            | 是                                           |
| `contracts/data-slots.json`  | 上游 React 源码的 `data-slot` 快照（334 值 / 81 组件）     | 仅通过 `gen:slots`                           |
| `generated/**`               | 生成后的组件 CSS                                           | 仅通过 `gen:compat`                          |
| `manifest.json`              | 版本、哈希、别名与 owner 统计                              | 仅通过 `gen:compat`                          |
| `scripts/gen-compat.mjs`     | 属性扫描 + 原位别名扩展 + `--check`                        | 是                                           |
| `scripts/gen-data-slots.mjs` | `data-slot` 提取 + `--check`                               | 是                                           |
| `scripts/sync-styles.mjs`    | 上游快照同步 + 版本/哈希拒绝                               | 是                                           |

## 新增一个上游 `data-*` 属性

同步新版本后，`pnpm check:compat` 会失败并指出未登记属性：

```
Unknown data attribute: data-foo (components/button.css)
Choose an owner in packages/styles/contracts/attributes.json
```

在 `contracts/attributes.json` 中为它选择**唯一** owner：

| owner       | 含义                                                | 生成器行为     |
| ----------- | --------------------------------------------------- | -------------- |
| `compat`    | 需要把上游选择器扩展为 Reka/原生词汇                | 必须提供 `map` |
| `component` | Vue 组件显式发射（如 `data-slot`、`data-entering`） | 不生成别名     |
| `reka`      | Reka 原样发射                                       | 不生成别名     |
| `native`    | 上游已有 `:hover` / `:focus-visible` 等原生回退     | 不生成别名     |

`native` 与 `component` 在生成阶段等价，区别只在评审时的理由。不要为了“看起来完整”随便选。

```json
"data-foo": {
  "owner": "compat",
  "map": [":hover", "[data-state=\"open\"]"],
  "except": ["sheet"],
  "notes": "为什么这样映射；哪些组件自己发射属性"
}
```

约束（生成器会校验）：

- `map` 只属于 `compat`，必须非空、无重复，且每一项都是合法的 CSS 选择器片段；
- `map` 里只放**替换后的节点**，不要写整条规则（`[data-hovered="true"]` → `:hover`，不是 `button:hover`）；
- `except` 只属于 `compat`，列出的组件跳过该属性的别名扩展；
- 所有别名都在**原规则位置**追加为选择器列表项，不会移动到文件末尾，也不会改变已有选择器的优先级；
- 别名不会进入 `:not()` / `:is()` 等伪类函数内部——那会反转语义；这类场景由组件发射上游值；
- 原生伪类别名（`:focus-visible` 等）若同一选择器列表已包含，则跳过，避免扩大命中范围；
- 已声明但上游从未使用的属性也会报错，防止拼写错误长期潜伏。

改完执行：

```bash
pnpm gen:compat
pnpm test:contract
```

`pnpm gen:compat` 输出 `manifest.json` 与 `generated/components/**`。提交时两者必须一起更新。

## 上游新增/删除组件 CSS

`scope.json` 与 `upstream/components/**` 必须一一对应（`index.css` 除外）。新增文件会报：

```
components/foo.css is not listed in contracts/scope.json.
```

确认该组件要移植后，把名字加入 `scope.json`，再运行 `pnpm gen:compat`。后端组件（如内部 composite）也要加入 scope；scope 表示“需要生成兼容层”，不等于“已公开导出”。

## 更新 `data-slots.json`

快照从上游 React 源码提取，来源 commit 必须与 `contracts/upstream.json` 一致：

```bash
pnpm gen:slots -- --source ../heroui
pnpm check:slots
```

- `--source` 可指向 HeroUI 仓库、`packages/styles` 或 `packages/react/src/components`；
- 脚本会读取源码所在 git 仓库的 `HEAD` 并与 pin 比对（无 git 信息时跳过）；
- 来源为 334 个唯一值 / 81 个组件；334 与 ticket 初稿的 332 不一致，原因是初稿只匹配 JSX 字面量，漏掉了对象键形式（`"data-slot": "select-indicator"`、`"data-slot": "autocomplete-indicator"`）。以 334 为准，详见 [T02 findings](../../docs/research/t02-contract-findings.md#2-data-slot332--334)；
- 不要把 `total` 改成一个与分组求和不符的值；`gen:compat` 会交叉校验。

## 同步上游快照

```bash
pnpm check:styles                     # 只校验本地快照，不读源码；CI 用这个
pnpm sync:styles --source ../heroui   # 用本地 checkout 覆盖快照
```

`sync:styles` 的拒绝条件：

1. 源仓库 `packages/styles` 工作区不干净（`git status`）；
2. 源 CSS 哈希与本地快照不一致，且没有显式 `--allow-upstream-change`；
3. 源版本/commit 与 `contracts/upstream.json` 不一致，且没有显式升级意图；
4. `--allow-upstream-change` 未提供 `--commit <sha>`，或提供的 commit 与源 `HEAD` 不符；
5. `--check` 与 `--source` 同时使用（check 不读源码）。

快照哈希按 **LF 规范化**计算：Windows 的 CRLF checkout 与 Linux CI 的 LF checkout 会得到同一结果。`.gitattributes` 同时把 `upstream/**`、`generated/**`、`contracts/**` 和 `manifest.json` 固定为 `eol=lf`，避免换行符造成快照漂移。

正常同步会先比对哈希再比对版本，错误信息会列出第一个不匹配的文件：

```
Refusing to overwrite the snapshot: source CSS differs from the pin.
- components/button.css does not match the pinned hash
```

确属上游升级时：

```bash
pnpm sync:styles --source ../heroui --allow-upstream-change --commit <new-sha>
pnpm gen:compat
pnpm gen:slots -- --source ../heroui
pnpm test:contract
```

同步 PR 必须单独提交，附上游 commit、CSS 变更摘要、新增/移除的 `data-*` 和视觉差异截图；不要与功能开发混在一起。

## 契约测试

`packages/vue/src/__tests__/contract.contract.test.ts` 对每个 spike 组件维护一张 `STATE_COVERAGE` 表：

- 从该组件的上游 CSS 提取所有 `data-*`；
- 每个属性要么在 jsdom 测试中被断言（`asserted`），要么登记为已知缺口（`gaps`，注明原因与替代测试层）；
- 新增组件或新增属性时，这张表必须同步更新，否则测试失败。

`packages/styles/__tests__/*.contract.test.ts` 负责生成器、快照与同步脚本本身，使用 `.fixtures/case-*` 临时目录做故障注入，不会修改真实上游快照。

## 故障注入（验收方式）

```bash
# 1. 删除 Button 的 :data-hovered → 契约红
#    packages/vue/src/components/button/button.vue 去掉 data-hovered 绑定
pnpm test:contract
# 恢复 → 绿

# 2. 上游出现未登记属性 → 生成红
#    在临时 upstream 副本的 button.css 加 [data-foo]
node packages/styles/scripts/gen-compat.mjs --check --upstream-root <fixture>
# 输出 Unknown data attribute: data-foo (components/button.css)

# 3. 手改生成物或 manifest → 漂移红
pnpm check:compat
# 重新 pnpm gen:compat → 绿
```

## CI

`.github/workflows/contract.yml` 依次运行 `check:styles`、`check:slots`、`check:compat`、`test:contract`、`test:ssr`。任一快照漂移、未知属性、生成物不同步都会使流水线失败。CI 不读取 `../heroui`，因此同步能力只在本地维护者机器上使用。
