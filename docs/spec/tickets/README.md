# Tickets — 垂直切片

> 状态：T01–T04 已完成；T05 进行中；其余 `Pending`。按 `Blocked by` 顺序推进；完成一张再开下一张。
> 每张 ticket 都是跨样式/组件/测试/文档的垂直切片，完成后可独立演示。

## 依赖图

```
T01 M0 spike
 └─> T02 契约工具链
      ├─> T03 展示 / 布局 / 反馈
      ├─> T04 表单控件
      ├─> T05 覆盖层与 Toast
      │    └─> T06 集合 / 选择器
      └─> T07 日期 / 颜色

T03 + T04 ──> T08 高级数据（Table / Meter / ScrollShadow / OTP）
T03..T08 ──> T09 Nuxt module + 文档站 + 发布门禁
```

共 14 条阻塞边。T03/T04/T05/T07 在 T02 之后可并行；T06 依赖 T05；T08 依赖 T03/T04；T09 依赖全部。

## 一览

| ID                                     | 标题                         | 里程碑 | Blocked by | Unblocks           | 演示物                                                  | 状态        |
| -------------------------------------- | ---------------------------- | ------ | ---------- | ------------------ | ------------------------------------------------------- | ----------- |
| [T01](./01-m0-foundation-spike.md)     | M0 架构 spike                | M0     | —          | T02                | Button/Input/Modal/Select 在 Vite + Nuxt SSR 中视觉对齐 | Done        |
| [T02](./02-contract-tooling.md)        | 契约工具链与属性归属         | M0/M1  | T01        | T03, T04, T05, T07 | 删除任一属性 → 契约测试红；恢复 → 绿                    | Done        |
| [T03](./03-display-and-feedback.md)    | 展示 / 布局 / 反馈（24）     | M1     | T02        | T09                | 展示画廊 + 主题/尺寸截图                                | Done        |
| [T04](./04-form-controls.md)           | 表单控件（19）               | M1     | T02        | T08, T09           | 完整表单：校验/受控/键盘                                | Done        |
| [T05](./05-overlays.md)                | 覆盖层与 Toast（7）          | M2     | T02        | T06, T09           | 覆盖层状态矩阵 + SSR + 动画                             | In Progress |
| [T06](./06-collections-and-pickers.md) | 集合 / 选择器（15）          | M2     | T02, T05   | T09                | Select/ListBox/Menu/Tabs/Accordion/Pagination           | Pending     |
| [T07](./07-date-and-color.md)          | 日期 / 颜色 / 自动完成（15） | M3     | T02        | T09                | 日期/颜色表单 + 时区/RTL 冒烟                           | Pending     |
| [T08](./08-advanced-data.md)           | 高级数据（4）                | M3     | T03, T04   | T09                | 可排序/可选择/虚拟化 Table + Meter + ScrollShadow + OTP | Pending     |
| [T09](./09-nuxt-docs-release.md)       | Nuxt module + 文档站 + 发布  | M4     | T03–T08    | —                  | Nuxt 自动导入 SSR 应用 + canary 安装                    | Pending     |

## 为什么这样切

- **T01 是唯一允许“横向”搭骨架的 ticket**，因为 M0 的目的就是证明整条链路可行；它仍然以 4 个可演示组件收尾。
- T02 不是“纯工具” ticket：它必须能让一个真实组件（Button）从“有 bug”变“红”，再修复变绿，才算垂直。
- 展示/表单/覆盖层/集合/日期颜色按**用户可见能力**分组，而不是按 `styles → primitives → components → tests` 分层。
- Table 单独放 T08，因为它风险最高，且依赖展示与表单的通用基础。

## 完成定义

每张 ticket 的 `Acceptance` 全勾，且满足 [Spec §6.3](../0001-heroui-v3-vue-port.spec.md#63-definition-of-done) 的 DoD。更新本表与 [组件矩阵](../../component-matrix.md) 的状态。
