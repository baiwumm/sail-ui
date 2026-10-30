# ADR 0001: 品牌与包名

- Status: Accepted
- Date: 2026-10-30
- Deciders: 项目维护者
- Related: [Spec §4.2](../spec/0001-heroui-v3-vue-port.spec.md), [README](../../README.md)

## Context

这是 HeroUI v3 的非官方 Vue 移植。包名必须：

- 不与已有 npm 包冲突；
- 不与 HeroUI 商标产生混淆；
- 能覆盖 `vue`、`styles`、`primitives`、`nuxt`、`testing` 五个包；
- 在中文和英文都易读。

计划稿实测（2026-10-30）：

- `@vela-ui/react` 已占用（2.0.30），且已有同名 React UI 库，直接排除；
- `@vela/ui` 已占用；
- `vela-ui` 2019 年被 unpublish；
- `tide-ui`、`kite-ui` 已占用；
- `sail-ui`、`@sail-ui/*` 八个候选名均未发现。

## Decision

采用 **Sail UI**：

| 包                    | 用途                                                         |
| --------------------- | ------------------------------------------------------------ |
| `@sail-ui/vue`        | 组件库，支持子路径 `@sail-ui/vue/button`                     |
| `@sail-ui/styles`     | 上游 CSS fork + `compat.css`                                 |
| `@sail-ui/primitives` | `useHover` / `usePress` / `useFocusRing` / `useOverlayState` |
| `@sail-ui/nuxt`       | Nuxt module                                                  |
| `@sail-ui/testing`    | 契约、SSR、视觉测试工具                                      |

仓库名：`sail-ui`。GitHub topics：`heroui`、`heroui-vue`、`vue`、`nuxt`、`tailwindcss`。

公开文案统一：**Sail UI — unofficial Vue 3 / Nuxt port of HeroUI v3**。不使用 `@heroui/vue` 作为包名。

## Consequences

- 品牌与上游清晰分离，降低商标与混淆风险。
- `sail-ui` 名字短、可读音译（“赛尔 UI”），但需要持续用 topics/README 获取搜索发现性。
- npm scope 的“未发现”只是 404 推断，**发布前仍需确认 scope 所有权、GitHub org、域名与商标**。
- 若未来与上游达成官方合作，可保留 Sail UI 作为社区发行版，或另行迁移包名；当前决策不依赖合作。

## Alternatives considered

- **Mast UI / Reef UI**：同样实测未发现，备选保留。
- **`heroui-vue` 作为仓库名**：搜索发现性更好，但包名仍不能用 `@heroui/*`，且 README 首行必须声明 Unofficial；当前不采用，避免长期混淆。
- **自建 scope**：成本更高，且没有解决品牌问题。
</content>
