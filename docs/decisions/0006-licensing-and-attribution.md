# ADR 0006: 许可证与上游归属

- Status: Accepted
- Date: 2026-10-30
- Related: [NOTICE](../../NOTICE), [LICENSE](../../LICENSE), [上游审计 §6](../research/heroui-v3-audit.md)

## Context

Sail UI 复用 HeroUI 的 CSS，并参考其 React 源码与文档。上游元数据存在不一致：

- 根 `LICENSE`：Apache-2.0；
- `packages/styles/package.json`：`"license": "Apache-2.0"`；
- `packages/styles/README.md` 末尾：写成 MIT。

此外，HeroUI 名称与 Logo 属于上游商标。非官方移植必须避免暗示官方背书。

## Decision

1. **仓库整体使用 Apache-2.0**（`LICENSE` 为 Apache-2.0 全文）。
2. **保留上游版权与来源**：
   - 根 `NOTICE` 记录 HeroUI、版权方、版本、commit、复用范围；
   - `packages/styles/upstream/LICENSE` 与 `packages/styles/upstream/NOTICE`（若上游提供）随快照保留；
   - 生成文件不删除上游注释；如生成过程会丢失注释，则在 `generated/` 目录放置 `NOTICE` 指针。
3. **README 首屏三行声明**（顺序固定）：
   - unofficial port；
   - styles reused from `@heroui/styles` (Apache-2.0, Copyright HeroUI), see NOTICE；
   - not affiliated with or endorsed by HeroUI。
4. **不使用 HeroUI 商标作为产品名**：包名、Logo、域名均使用 Sail UI；文档可以写 “HeroUI-compatible”。
5. **贡献者许可**：CONTRIBUTING 明确“提交即按 Apache-2.0 授权”。
6. **依赖许可证审计**：发布前对 `reka-ui`、`tailwind-variants`、`@tanstack/*`、`@internationalized/date` 做一次 license 清单；不允许引入 GPL/AGPL 依赖。
7. **发布包元数据**：每个 `package.json` 写 `"license": "Apache-2.0"`，包含 `NOTICE` 与 `LICENSE`（或指向根文件的说明）。

## Consequences

- 与上游 Apache-2.0 兼容，允许商用与再分发。
- 需要长期维护 NOTICE；每次同步上游都要更新版本/commit。
- Apache-2.0 不是 copyleft，但要求保留声明、标注修改。`compat.css` 的生成属于“修改”，NOTICE 已说明。
- 若上游最终确认其意图为 MIT（与 README 一致），我们仍可按 Apache-2.0 分发（MIT 兼容 Apache-2.0），但归属声明保持不变；不做追溯性变更。

## Alternatives considered

- **MIT**：与上游实际元数据不一致，且不能覆盖上游 Apache-2.0 CSS 的声明义务，排除。
- **CC BY / MPL**：与生态不匹配，排除。
- **不写 NOTICE，仅链接上游**：不满足 Apache-2.0 的保留声明要求，排除。
