# 验收矩阵

> 目标不是“测试很多”，而是**每个承诺的能力都有证据**。任何组件在进入 `Done` 前，必须通过本矩阵对应的门禁。
> 命令是 T01 之后的目标命令面，见 [AGENTS.md §6](../AGENTS.md#6-target-command-surface)。

## 1. 全局门禁

| ID  | 门禁            | 工具                                  | 通过标准                                                           | 失败时           |
| --- | --------------- | ------------------------------------- | ------------------------------------------------------------------ | ---------------- |
| A0  | Build & exports | turbo + tsup/rollup                   | ESM、`.d.ts`、子路径可解析；`pack:check` 干净安装                  | 阻断             |
| A1  | 契约            | PostCSS 扫描 + SSR render             | `data-slot` 完全一致；CSS 需要的 `data-*` 存在且值正确；无未知属性 | 阻断             |
| A2  | 单元/行为       | Vitest + VTU (jsdom)                  | role/可访问名/事件/焦点/受控/非受控/状态属性                       | 阻断             |
| A3  | SSR             | `@vue/server-renderer` + Nuxt fixture | 无 hydration mismatch；关闭覆盖层无 DOM；id 稳定；Toast 每请求隔离 | 阻断             |
| A4  | 浏览器          | Vitest browser / Playwright           | 几何、指针、焦点陷阱、动画、虚拟化                                 | 阻断（风险组件） |
| A5  | 视觉            | Playwright + pixelmatch               | 关键区域 0 像素差；整体 ≤ 0.1%                                     | 阻断             |
| A6  | A11y            | axe-core + 键盘清单                   | 0 critical/serious；键盘逐项                                       | 阻断             |
| A7  | 文档            | 构建 docs + 链接检查                  | demo/API 表/迁移差异齐全；无死链                                   | 阻断             |
| A8  | API             | 类型测试 + review                     | 符合 ADR 0007；无 Reka 类型泄漏                                    | 阻断             |
| A9  | 同步            | `gen:compat` + manifest               | 确定性；哈希/属性清单一致                                          | 阻断             |

### 1.1 视觉阈值

| 项                                             | 阈值                                                |
| ---------------------------------------------- | --------------------------------------------------- |
| 关键区域（文字、边框、焦点环、图标、阴影边缘） | 0 像素差（1x/2x）                                   |
| 整体截图                                       | ≤ 0.1% 像素差（仅允许抗锯齿）                       |
| 计算样式                                       | 颜色/背景/边框/圆角/阴影/字体/间距逐项一致          |
| 动画关键帧                                     | 在 0%、50%、100% 三个时间点截图；允许时间抖动 ±1 帧 |
| 主题                                           | light / dark                                        |
| 尺寸                                           | sm / md / lg（上游有则测）                          |
| 方向                                           | LTR；关键组件 RTL                                   |
| 浏览器                                         | Chromium + WebKit                                   |

### 1.2 SSR 验收

- server HTML 中的 `data-slot` 与客户端一致；
- 关闭的 Modal/Drawer/Popover/Tooltip/Select 不输出覆盖层 DOM；
- `useId()` 生成的 id 在 server/client 一致；
- locale/timezone 显式传入时，日期文本一致；
- 并发两个 SSR 请求，Toast 队列/注册表不共享；
- Nuxt `ssr: true` 构建产物可运行。

### 1.3 键盘验收

按组件能力逐项：

| 键                     | 期望                                                 |
| ---------------------- | ---------------------------------------------------- |
| `Tab` / `Shift+Tab`    | 焦点顺序符合 DOM/roving tabindex；不跳入关闭的覆盖层 |
| `Arrow`                | 集合/网格/滑块移动；RTL 方向正确                     |
| `Home` / `End`         | 首/尾项；表格首/尾列行                               |
| `PageUp` / `PageDown`  | 日历/表格分页                                        |
| `Enter` / `Space`      | 激活/选择；不重复触发                                |
| `Esc`                  | 关闭覆盖层；焦点回到 trigger                         |
| 字符键                 | typeahead；IME 组合期间不触发                        |
| `Backspace` / `Delete` | Tag 删除、OTP 退格、可编辑集合                       |

### 1.4 A11y 清单

- 每个交互元素有可访问名（label/aria-label/aria-labelledby）；
- 覆盖层：`aria-modal`、焦点陷阱、关闭后回焦；
- 表单：错误与字段关联（`aria-describedby`、`aria-invalid`）；
- 集合/网格：role、索引、`aria-selected`、`aria-sort`；
- Toast：`aria-live` / `role`，不抢焦点；
- 颜色/日期：分段输入的标签；
- 减少动画偏好：不播放非必要动画。

## 2. 组件级门禁

### 2.1 默认要求（按类别）

| 类别      | Unit | SSR | Browser  | Visual | A11y | 契约 |
| --------- | ---- | --- | -------- | ------ | ---- | ---- |
| 展示/布局 | ✅   | ✅  | 仅风险件 | ✅     | ✅   | ✅   |
| 表单/操作 | ✅   | ✅  | ✅       | ✅     | ✅   | ✅   |
| 覆盖层    | ✅   | ✅  | ✅       | ✅     | ✅   | ✅   |
| 集合/选择 | ✅   | ✅  | ✅       | ✅     | ✅   | ✅   |
| 日期/颜色 | ✅   | ✅  | ✅       | ✅     | ✅   | ✅   |
| 高级数据  | ✅   | ✅  | ✅       | ✅     | ✅   | ✅   |

### 2.2 风险组件与额外要求

| 组件                                  | 额外要求                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------- |
| `button`                              | press/focus-visible/disabled/loading；`asChild`；表单提交类型              |
| `input` / `textarea` / `number-field` | IME、受控/非受控、错误关联、清除/步进                                      |
| `checkbox` / `checkbox-group`         | indeterminate、全选/半选、数组值                                           |
| `radio-group` / `switch`              | 方向键、roving tabindex；`useHover`/`usePress`/`useFocusRing` 在触屏与键盘 |
| `slider`                              | 单值/范围、pointer drag、键盘、RTL                                         |
| `modal` / `alert-dialog`              | 焦点陷阱、Esc、遮罩、退场动画、滚动锁、回焦                                |
| `drawer` / `sheet`                    | 四方向、swipe、嵌套滚动、把手                                              |
| `popover` / `tooltip`                 | 定位/翻转/碰撞、箭头、嵌套、触摸策略                                       |
| `toast`                               | 队列/上限/暂停/Promise/关闭/每请求隔离/`aria-live`                         |
| `select` / `list-box`                 | typeahead、选中属性、键盘、关闭回焦、`data-open`                           |
| `accordion` / `tabs`                  | 单开/多开、方向键、手动激活、`data-expanded`/`data-selected`               |
| `dropdown` / `menu`                   | 定位、键盘、typeahead、危险项、子菜单（若上游有）                          |
| `pagination`                          | `aria-current`、省略、RTL                                                  |
| `calendar` / `date-picker`            | 键盘网格、跨月、不可用日期、locale/timezone、DST                           |
| `color-*`                             | 格式、无效输入、拖动、键盘、透明度                                         |
| `table`                               | grid 角色/索引、2D 键盘、排序/选择、列宽、虚拟化、LoadMore、粘性表头       |
| `meter`                               | `role="meter"`、值文本、极端值                                             |
| `scroll-shadow`                       | 四方向、阈值、resize、无 JS 退化                                           |
| `input-otp`                           | 粘贴、键盘、完成态、分组                                                   |

### 2.3 状态矩阵（视觉）

| 类别               | 默认     | hover      | focus-visible | pressed    | disabled | invalid | selected | open | loading |
| ------------------ | -------- | ---------- | ------------- | ---------- | -------- | ------- | -------- | ---- | ------- |
| Button 类          | ✅       | ✅         | ✅            | ✅         | ✅       | —       | —        | —    | ✅      |
| Input 类           | ✅       | ✅         | ✅            | —          | ✅       | ✅      | —        | —    | —       |
| Check/Radio/Switch | ✅       | ✅         | ✅            | ✅         | ✅       | ✅      | ✅       | —    | —       |
| Select/ListBox     | ✅       | ✅         | ✅            | ✅         | ✅       | ✅      | ✅       | ✅   | —       |
| Modal/Drawer/Sheet | ✅（关） | —          | ✅（开）      | —          | —        | —       | —        | ✅   | —       |
| Toast              | ✅       | ✅（暂停） | —             | —          | —        | —       | —        | —    | ✅      |
| Calendar           | ✅       | ✅         | ✅            | —          | ✅       | —       | ✅       | —    | —       |
| Color              | ✅       | ✅         | ✅            | ✅（拖动） | ✅       | ✅      | ✅       | —    | —       |
| Table              | ✅       | ✅         | ✅            | —          | —        | —       | ✅       | —    | ✅      |

> 上游没有的状态不强行造；以上为目标集合，实施时按上游 demo/样式裁剪并在 ticket 中记录。

## 3. 单组件 DoD 模板

```md
## <Component>

- [ ] `data-slot` 快照一致
- [ ] 契约：CSS 需要的 data-* 正确
- [ ] Unit：role / 可访问名 / 事件 / 焦点 / 受控 / 非受控
- [ ] SSR：server HTML + 无 hydration mismatch（如适用）
- [ ] Browser：<具体风险>
- [ ] Visual：light/dark × <状态> × <尺寸>
- [ ] A11y：axe 无 critical/serious；键盘清单
- [ ] Docs：demo + props/events/slots + 迁移差异
- [ ] 导出：命名 + 复合对象 + 子路径 + 类型
- [ ] 组件矩阵状态 → Done
```

## 4. 证据与记录

- 视觉截图存 `test-results/visual/<component>/<theme>/<state>.png`，CI artifact 保留 30 天。
- 契约失败输出：组件、缺失属性、对应 CSS 文件与选择器。
- 浏览器失败保留 trace/video（Playwright）。
- 每个 ticket 的 PR 描述必须写：跑了哪些门禁、哪些没跑、为什么。
- 不允许用 `test.skip` / 降低阈值 / 删除断言来“修复”失败；先记录，再修复根因。
