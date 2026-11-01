# Roadmap

> 估算基于“1 名有经验的 Vue 维护者 + AI 辅助”的假设，不是承诺。每个里程碑以验收门禁为准，而不是日期。

## 原则

- 先纵向打通（M0），再横向铺量。
- MVP 只承诺 40 个核心组件；其余按里程碑逐步交付。
- 每个里程碑结束必须做 retro，把结论写回 [AGENTS.md](../AGENTS.md)、ADR 或测试。
- 上游同步/依赖升级独立 PR，不混入功能开发。

## 里程碑总览

| 里程碑 | 主题                 |        组件数 | 估算   | 关键出口                       |
| ------ | -------------------- | ------------: | ------ | ------------------------------ |
| M0     | 架构 spike           |             4 | 1–2 周 | 视觉/SSR/打包三条链路跑通      |
| M1     | 展示 + 表单          |            43 | 3–4 周 | 契约/视觉/主题矩阵；playground |
| M2     | 覆盖层 + 集合（MVP） | 65（核心 40） | 3–4 周 | MVP API 稳定；迁移指南初稿     |
| M3     | 日期/颜色/高级数据   |            84 | 4–6 周 | 全量组件；Table/Calendar/Color |
| M4     | Nuxt + 文档 + 发布   |            84 | 2–3 周 | canary；文档站；发布门禁       |

累计：MVP 约 7–10 周；全量约 3–4 个月。高风险项（Table、覆盖层动画、SSR Toast）已在 ticket 中单独标注。

## M0 — 架构 spike（1–2 周）

- [x] Monorepo / 构建 / 类型 / lint / vitest / changesets
- [x] `@sail-ui/styles` 上游快照 + 最小生成链路
- [x] 4 个 composable + overlay exit hold
- [x] Button / Input / Modal / Select
- [x] Vite + Nuxt SSR fixtures
- [x] 契约 / SSR / 视觉 / tarball 四条最小门禁
- [x] 验证 Vue 复合 API、Reka 属性、Tailwind v4、子路径导出

演示：四个组件在两种 SSR 环境可运行、可截图、可安装。

## M1 — 展示 + 表单（3–4 周）

- [x] 24 个展示/布局/反馈组件（[T03](./spec/tickets/03-display-and-feedback.md)）
- [x] 19 个表单/操作组件（[T04](./spec/tickets/04-form-controls.md)）
- [x] 契约清单完整（65 个属性）
- [ ] 主题（light/dark/system）+ 尺寸矩阵（light/dark 已覆盖，system 待做）
- [x] playground 画廊
- [x] 视觉基线首批

风险：`asChild`/`$attrs` 透传、IME、Switch/Radio 的 composable。

## M2 — 覆盖层 + 集合（MVP，3–4 周）

- [x] 7 个覆盖层/Toast（[T05](./spec/tickets/05-overlays.md)）
- [x] 15 个集合/选择器（[T06](./spec/tickets/06-collections-and-pickers.md)）
- [x] 覆盖层动画/焦点/SSR/层级
- [x] Select 与 popover 状态机打通
- [x] 迁移指南初稿（覆盖层/集合/日期颜色差异已记录；文档站页面顺延 T09）
- [x] MVP 40 的 API 冻结（允许修 bug，不再大改命名）

风险：退场动画、Toast 每请求隔离、Select 选中属性。

## MVP 40 components

这 40 个组件是对外承诺的第一版能力；其余 44 个在 M3/M4 交付。与 [组件矩阵](./component-matrix.md) 的 ✅ 行完全一致。

| 类别      | 数量 | 组件                                                                                                                                                            |
| --------- | ---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 展示/反馈 |   13 | `alert`、`avatar`、`avatar-group`、`badge`、`card`、`chip`、`link`、`separator`、`skeleton`、`spinner`、`label`、`description`、`field-error`                   |
| 表单/操作 |   13 | `button`、`button-group`、`input`、`textarea`、`search-field`、`checkbox`、`checkbox-group`、`radio`、`radio-group`、`switch`、`form`、`number-field`、`slider` |
| 覆盖层    |    6 | `modal`、`alert-dialog`、`popover`、`tooltip`、`toast`、`drawer`                                                                                                |
| 集合      |    8 | `accordion`、`dropdown`、`list-box`、`menu`、`pagination`、`select`、`tabs`、`tag`                                                                              |

合计：13 + 13 + 6 + 8 = **40**。分类与 [T05](./spec/tickets/05-overlays.md) / [T06](./spec/tickets/06-collections-and-pickers.md) 及组件矩阵一致；若本表与组件矩阵冲突，以矩阵为准。

## M3 — 日期/颜色/高级数据（4–6 周）

- [x] 15 个日期/颜色/自动完成（[T07](./spec/tickets/07-date-and-color.md)）
- [x] 4 个高级数据（[T08](./spec/tickets/08-advanced-data.md)）
- [x] Table：键盘/ARIA/排序/选择/列宽/虚拟化/LoadMore
- [x] Meter / ScrollShadow / OTP
- [ ] RTL 冒烟（Calendar/ColorSlider/Popover/Tooltip/Pagination 已覆盖；Drawer/Table 待补，随 T09 收尾）
- [ ] 视觉基线全量（T03–T08 gallery 基线已入库；覆盖层截图矩阵顺延 T09）

风险：Table 是最大不确定项；如果超出预算，先交付基础网格，列宽/虚拟化延后到 M4，但不得静默降级。

## M4 — Nuxt + 文档 + 发布（2–3 周）

- [ ] `@sail-ui/nuxt`（[T09](./spec/tickets/09-nuxt-docs-release.md)）
- [ ] 文档站（84 组件页 / Getting Started / Theming / Migration）
- [ ] 发布门禁：pack/类型/许可证/axe/视觉/体积
- [ ] changesets + canary + 安装验证
- [ ] 迁移指南完成
- [ ] 发布 retro

## 发布策略

- 版本：MVP 前 `0.x`；MVP 后按 changesets 发 `0.minor`，稳定后 `1.0`。
- dist-tag：`canary` 每次合并 main；`latest` 只在 M4 门禁全绿后。
- 包：`@sail-ui/vue`、`@sail-ui/styles`、`@sail-ui/primitives`、`@sail-ui/nuxt`、`@sail-ui/testing`。
- 发布前阻断项：npm scope/商标确认、LICENSE/NOTICE、依赖许可证清单、tarball 安装、文档安装命令一致。

## 不承诺

- 具体发布日期；
- 84 个组件之外的 HeroUI 新组件；
- WCAG 认证；
- 旧浏览器；
- 主题市场；
- 1.0 之前 API 完全冻结（MVP 后仅允许破坏性变更走 ADR + major/minor 说明）。

## 跟踪

- ticket 状态：[tickets/README.md](./spec/tickets/README.md)
- 组件状态：[component-matrix.md](./component-matrix.md)
- 每周更新一次；里程碑结束做 retro。
