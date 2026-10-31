# 从 HeroUI React 迁移到 Sail UI Vue

> 目标：让 HeroUI v3 的 React 示例可以**机械地**映射到 Vue。除了复合组件标签与受控写法，尽量保持 props 名称。
> 本文与 [ADR 0007](./decisions/0007-component-api-conventions.md)、[ADR 0004](./decisions/0004-compound-component-api.md) 保持一致。

## 1. 包与入口

| React                                         | Vue                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `@heroui/react`                               | `@sail-ui/vue`                                                       |
| `@heroui/react/button`                        | `@sail-ui/vue/button`                                                |
| `@heroui/styles/css`                          | `@sail-ui/styles`                                                    |
| `@heroui/react` 的 `HeroUIProvider`（若使用） | 不需要；locale/dir 用 `ConfigProvider`，Toast 用 `<ToastProvider />` |

```ts
// React
import {Button, Card} from "@heroui/react";

// Vue
import {Button, Card, CardHeader, CardTitle} from "@sail-ui/vue";
```

```css
@import "tailwindcss";
@import "@sail-ui/styles";
```

## 2. 复合组件标签

Vue 编译器不会把 `<Card.Header>` 解析成 `Card` 对象的属性；必须使用命名导出。也可以使用 `<component :is="Card.Header" />`。

| HeroUI React       | Sail UI Vue（推荐） | 动态写法                             |
| ------------------ | ------------------- | ------------------------------------ |
| `<Card.Header>`    | `<CardHeader>`      | `<component :is="Card.Header" />`    |
| `<Modal.Backdrop>` | `<ModalBackdrop>`   | `<component :is="Modal.Backdrop" />` |
| `<Select.Trigger>` | `<SelectTrigger>`   | `<component :is="Select.Trigger" />` |
| `<Table.Header>`   | `<TableHeader>`     | `<component :is="Table.Header" />`   |
| `<Toast.Provider>` | `<ToastProvider>`   | —                                    |

完整映射：

| 家族      | React parts                                                                                                                                                                                | Vue named exports                                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card      | `Card`, `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`                                                                                                     | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`                                                                                      |
| Modal     | `Modal`, `Modal.Trigger`, `Modal.Backdrop`, `Modal.Container`, `Modal.Dialog`, `Modal.Header`, `Modal.Icon`, `Modal.Heading`, `Modal.Body`, `Modal.Footer`, `Modal.CloseTrigger`           | `Modal`, `ModalTrigger`, `ModalBackdrop`, `ModalContainer`, `ModalDialog`, `ModalHeader`, `ModalIcon`, `ModalHeading`, `ModalBody`, `ModalFooter`, `ModalCloseTrigger` |
| Select    | `Select`, `Select.Trigger`, `Select.Value`, `Select.Popover`, `ListBox`, `ListBox.Item`, `ListBox.ItemIndicator`                                                                           | `Select`, `SelectTrigger`, `SelectValue`, `SelectIndicator`, `SelectClearButton`, `SelectPopover`, `SelectListBox`, `SelectItem`, `SelectItemIndicator`                |
| Table     | `Table`, `Table.Root/ScrollContainer/Content/Header/Column/Body/Row/Cell/Footer/…`                                                                                                         | `Table`, `TableRoot`, `TableScrollContainer`, `TableContent`, `TableHeader`, `TableColumn`, `TableBody`, `TableRow`, `TableCell`, `TableFooter`, …                     |
| Tabs      | `Tabs`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`                                                                                                                                              | `Tabs`, `TabsList`, `TabsTab`, `TabsPanel`                                                                                                                             |
| Accordion | `Accordion`, `Accordion.Item`, `Accordion.Trigger`, `Accordion.Panel`                                                                                                                      | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`                                                                                                     |
| TagGroup  | `TagGroup`, `TagGroup.List`, `Tag`, `Tag.RemoveButton`                                                                                                                                     | `TagGroup`, `TagGroupList`, `Tag`, `TagRemoveButton`                                                                                                                   |
| ListBox   | `ListBox`, `ListBox.Item`, `ListBox.ItemIndicator`, `ListBox.Section`                                                                                                                      | `ListBox`, `ListBoxItem`, `ListBoxItemIndicator`, `ListBoxSection`                                                                                                     |
| Dropdown  | `Dropdown`, `Dropdown.Trigger`, `Dropdown.Popover`, `Dropdown.Menu`, `Dropdown.Item`, `Dropdown.ItemIndicator`, `Dropdown.SubmenuIndicator`, `Dropdown.SubmenuTrigger`, `Dropdown.Section` | `Dropdown`, `DropdownTrigger`, `DropdownPopover`, `DropdownMenu`, `MenuItem`, `MenuItemIndicator`, `MenuItemSubmenuIndicator`, `DropdownSubmenuTrigger`, `MenuSection` |

> 命名以最终实现为准；每个组件的 `index.ts` 同时导出命名 part 与复合对象。文档不写静态点号标签。

## 3. Props

| React                                | Vue                       | 说明                                                    |
| ------------------------------------ | ------------------------- | ------------------------------------------------------- |
| `className`                          | `class`                   | 字符串；不接受函数                                      |
| `style`                              | `style`                   | 同                                                      |
| `isDisabled`                         | `isDisabled`              | 保留                                                    |
| `isRequired`                         | `isRequired`              | 保留                                                    |
| `isInvalid`                          | `isInvalid`               | 保留                                                    |
| `isReadOnly`                         | `isReadOnly`              | 保留                                                    |
| `isLoading`                          | `isLoading`               | 保留                                                    |
| `isOpen`                             | `v-model:open`            | 不再单独传 `isOpen`（仍可传 `open` 做只读绑定）         |
| `defaultOpen`                        | `defaultOpen`             | 非受控                                                  |
| `onOpenChange`                       | `@update:open`            | `v-model:open` 的标准事件                               |
| `value` + `onChange`                 | `v-model`                 | 输入/选择类                                             |
| `selectedKey` + `onSelectionChange`  | `v-model`                 | Select/ListBox/Tabs；另发 `@selection-change`           |
| `selectedKeys` + `onSelectionChange` | `v-model`                 | TagGroup；`multiple` 时为数组，另发 `@selection-change` |
| `onRemove`                           | `@remove`                 | TagGroup；只有监听时标签才可删除                        |
| `defaultSelectedKey`                 | `defaultSelectedKey`      | 非受控                                                  |
| `expandedKeys` + `onExpandedChange`  | `v-model:expanded-keys`   | Accordion/DisclosureGroup                               |
| `sortDescriptor` + `onSortChange`    | `v-model:sort-descriptor` | Table                                                   |
| `as` / `asChild`                     | `as` / `asChild`          | 多态渲染                                                |
| `render` prop                        | scoped slot 或 `asChild`  | 不提供函数式 `className`                                |
| `ref`                                | `ref`                     | 指向根 DOM/组件                                         |

`disabled` **不是** `isDisabled` 的别名。原生 `disabled` 只用于直接映射到原生元素的场景；组件级禁用统一 `isDisabled`。

## 4. Events

| React               | Vue                                        | 说明                                                           |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `onPress`           | `@press`                                   | 指针 + 键盘激活；payload 是 Vue 对象/事件，不是 React 合成事件 |
| `onClick`           | `@click`                                   | 原生点击继续透传                                               |
| `onSelectionChange` | `@update:model-value`、`@selection-change` | `v-model` 优先                                                 |
| `onOpenChange`      | `@update:open`                             |                                                                |
| `onValueChange`     | `@update:model-value`                      |                                                                |
| `onAction`          | `@action`                                  | ListBox / Menu；payload 是 key                                 |
| `onSortChange`      | `@update:sort-descriptor`                  |                                                                |
| `onExpandedChange`  | `@update:expanded-keys`                    |                                                                |
| `onLoadMore`        | `@load-more`                               | Table                                                          |

文档统一写 kebab-case：`@update:model-value`。

## 5. Slots 与 render props

| React                              | Vue                                                                  |
| ---------------------------------- | -------------------------------------------------------------------- |
| `children`                         | 默认 slot                                                            |
| `children={({isHovered}) => ...}`  | `#default="{ isHovered }"`                                           |
| `className={({isHovered}) => ...}` | **不支持**；用 scoped slot + `data-hovered` 自定义 CSS，或 `asChild` |
| `render={(props) => ...}`          | scoped slot 或 `asChild`                                             |

```vue
<template>
  <Checkbox v-slot="{isSelected}">
    {{ isSelected ? "已选" : "未选" }}
  </Checkbox>
</template>
```

> 只在上游确实暴露 render props 的组件提供 scoped slot；不要为每个组件造一套。

## 6. 示例

### 6.1 Button

```tsx
// React
<Button variant="primary" isDisabled onPress={() => save()}>
  Save
</Button>
```

```vue
<!-- Vue -->
<Button variant="primary" :is-disabled="true" @press="save">
  Save
</Button>
```

### 6.2 Card

```tsx
// React
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Body</Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

```vue
<!-- Vue -->
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Body</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### 6.3 Modal

```tsx
// React
const [isOpen, setIsOpen] = useState(false);

<Button onPress={() => setIsOpen(true)}>Open</Button>
<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
  <Modal.Backdrop>
    <Modal.Container>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Heading>Title</Modal.Heading>
        </Modal.Header>
        <Modal.Body>Body</Modal.Body>
      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>
</Modal>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import {
  Button,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
} from "@sail-ui/vue";

const isOpen = ref(false);
</script>

<template>
  <Button @press="isOpen = true">Open</Button>
  <Modal v-model:open="isOpen">
    <ModalBackdrop>
      <ModalContainer>
        <ModalDialog>
          <ModalHeader>
            <ModalHeading>Title</ModalHeading>
          </ModalHeader>
          <ModalBody>Body</ModalBody>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  </Modal>
</template>
```

### 6.4 Select

```tsx
// React
<Select selectedKey={value} onSelectionChange={setValue}>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Popover>
    <ListBox>
      <ListBox.Item id="a">A</ListBox.Item>
      <ListBox.Item id="b">B</ListBox.Item>
    </ListBox>
  </Select.Popover>
</Select>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@sail-ui/vue";

const value = ref("a");
</script>

<template>
  <Select v-model="value">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectPopover>
      <SelectListBox>
        <SelectItem value="a">A</SelectItem>
        <SelectItem value="b">B</SelectItem>
      </SelectListBox>
    </SelectPopover>
  </Select>
</template>
```

上游 `Select.Popover` 内的 `ListBox` 在 Vue 中必须替换为 Select 专用 parts：`ListBox` → `SelectListBox`，`ListBox.Item` → `SelectItem`，`ListBox.ItemIndicator` → `SelectItemIndicator`。独立 `ListBox` 不共享 Select 的状态，不能放进 `SelectPopover`（见 [ADR 0012](./decisions/0012-select-composition.md)）。

多选使用 `selection-mode="multiple"`，`v-model` 为数组；`disabled-keys` 接收值集合，`by` 可传键名或比较函数。

### 6.5 Dropdown

```tsx
// React
<Dropdown>
  <Button>Actions</Button>
  <Dropdown.Popover>
    <Dropdown.Menu selectionMode="single" onAction={handleAction}>
      <Dropdown.Item id="edit">Edit</Dropdown.Item>
      <Dropdown.Section selectionMode="multiple">
        <Header>Share</Header>
        <Dropdown.Item id="email">Email</Dropdown.Item>
      </Dropdown.Section>
      <Dropdown.SubmenuTrigger>
        <Dropdown.Item id="social">
          Social
          <Dropdown.SubmenuIndicator />
        </Dropdown.Item>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item id="mastodon">Mastodon</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.SubmenuTrigger>
    </Dropdown.Menu>
  </Dropdown.Popover>
</Dropdown>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import {
  Dropdown,
  DropdownMenu,
  DropdownPopover,
  DropdownSubmenuTrigger,
  DropdownTrigger,
  Header,
  Label,
  MenuItem,
  MenuItemIndicator,
  MenuItemSubmenuIndicator,
  MenuSection,
  type MenuKey,
} from "@sail-ui/vue";

const value = ref("edit");

function handleAction(key: MenuKey) {
  console.log(key);
}
</script>

<template>
  <Dropdown>
    <DropdownTrigger>Actions</DropdownTrigger>
    <DropdownPopover>
      <DropdownMenu v-model="value" selection-mode="single" @action="handleAction">
        <MenuItem value="edit" text-value="Edit">
          <Label>Edit</Label>
          <MenuItemIndicator />
        </MenuItem>
        <MenuSection selection-mode="multiple">
          <Header>Share</Header>
          <MenuItem value="email" text-value="Email">
            <Label>Email</Label>
          </MenuItem>
        </MenuSection>
        <DropdownSubmenuTrigger>
          <MenuItem value="social" text-value="Social">
            <Label>Social</Label>
            <MenuItemSubmenuIndicator />
          </MenuItem>
          <DropdownPopover>
            <DropdownMenu>
              <MenuItem value="mastodon" text-value="Mastodon">
                <Label>Mastodon</Label>
              </MenuItem>
            </DropdownMenu>
          </DropdownPopover>
        </DropdownSubmenuTrigger>
      </DropdownMenu>
    </DropdownPopover>
  </Dropdown>
</template>
```

与上游的差别：

- Trigger 必须显式写 `<DropdownTrigger>`；Vue 无法可靠克隆第一个子元素。
- `Dropdown.Item` / `Dropdown.Section` 复用命名导出 `MenuItem` / `MenuSection`；item 的选择键是 `value`，不是 `id`。
- `selectedKeys` 改为 `v-model`（`single` 为标量，`multiple` 为数组）；`onAction` 改为 `@action`。
- 子菜单在 `DropdownSubmenuTrigger` 内放恰好一个 `MenuItem` 和一个 `DropdownPopover`；`DropdownPopover` 会自动渲染 Reka 的 `MenuSubContent`。
- 独立 `Menu` 可替代 `DropdownMenu`，但必须位于 `DropdownPopover` 内（Reka 没有可脱离弹层的菜单根）。见 [ADR 0013](./decisions/0013-dropdown-menu-behavior.md)。

### 6.6 Toast

```tsx
// React
<Toast.Provider placement="bottom" />;
toast.success("Saved");
```

```vue
<!-- Vue -->
<script setup lang="ts">
import {ToastProvider, useToast} from "@sail-ui/vue";

const toast = useToast();

function save() {
  toast.success("Saved");
}
</script>

<template>
  <ToastProvider placement="bottom" />
</template>
```

Nuxt 下 `<ToastProvider />` 由模块自动挂载，直接用 `useToast()`。

### 6.7 Form / Input

```tsx
// React
<Form onSubmit={submit}>
  <TextField isRequired isInvalid={hasError}>
    <Label>Email</Label>
    <Input />
    <FieldError>{error}</FieldError>
  </TextField>
  <Button type="submit">Submit</Button>
</Form>
```

```vue
<!-- Vue -->
<Form @submit="submit">
  <TextField isRequired :is-invalid="hasError">
    <Label>Email</Label>
    <Input />
    <FieldError>{{ error }}</FieldError>
  </TextField>
  <Button type="submit">Submit</Button>
</Form>
```

### 6.8 表单控件（19 个）

选择类控件统一用 `v-model` 取代 React 的 `value` / `onChange`：

| React                                                                | Vue                                                       |
| -------------------------------------------------------------------- | --------------------------------------------------------- |
| `<CheckboxGroup value={list} onChange={setList}>`                    | `<CheckboxGroup v-model="list">`（数组）                  |
| `<RadioGroup value={value} onChange={setValue}>`                     | `<RadioGroup v-model="value">`                            |
| `<Switch isSelected={on} onChange={setOn}>`                          | `<Switch v-model="on">`                                   |
| `<ToggleButtonGroup selectionMode="multiple" selectedKeys={keys}>`   | `<ToggleButtonGroup v-model="keys" type="multiple">`      |
| `<ToggleButtonGroup selectionMode="single" selectedKeys={keys}>`     | `<ToggleButtonGroup v-model="key" type="single">`         |
| `<ToggleButton id="bold">`                                           | `<ToggleButton value="bold">`                             |
| `<Slider value={n} onChange={setN} minValue={0} maxValue={100}>`     | `<Slider v-model="n" :min="0" :max="100">`                |
| `<NumberField value={n} onChange={setN} minValue={0} maxValue={10}>` | `<NumberField v-model="n" :min="0" :max="10">`            |
| `<SearchField value={q} onChange={setQ}>`                            | `<SearchField v-model="q">`，提交用 `@submit`             |
| `<Form onSubmit={submit}>`                                           | `<Form @submit="submit">`（透传原生事件，不阻止默认行为） |

复合部件保持上游命名：`Checkbox.Content` / `Checkbox.Control` / `Checkbox.Indicator`、`Radio.Content` / `Radio.Control` / `Radio.Indicator`、`Switch.Content` / `Switch.Control` / `Switch.Thumb`、`NumberField.Group` / `NumberField.Input` / `NumberField.IncrementButton`、`Slider.Track` / `Slider.Fill` / `Slider.Thumb`、`SearchField.Group` / `SearchField.Input` / `SearchField.ClearButton`、`InputGroup.Prefix` / `InputGroup.Input` / `InputGroup.Suffix`。静态 `<Checkbox.Control>` 标签不生效，用命名导出 `<CheckboxControl>`。

### 6.9 覆盖层通用约定

- 开关状态统一用 `v-model:open` / `defaultOpen`，不再传 `isOpen` + `onOpenChange` 组合。
- 关闭态不渲染覆盖层 DOM；服务端不会输出 Modal / Drawer / Sheet / Popover / Tooltip / Toast 的浮层内容。
- 退场由真实 CSS animation/transition 驱动：元素保持挂载并带 `data-exiting="true"`，动画结束后才卸载；`prefers-reduced-motion` 下跳过动画但保留同样的生命周期。
- Modal / AlertDialog 的 trigger 是 `div role="button"`；Drawer 的 trigger 是原生 `<button>`。这是上游 DOM 合约，不是可配置项。
- Popover 的可见容器由 Reka 输出 `role="dialog"`；标题语义由 `PopoverDialog` / `PopoverHeading` 提供。上游由 Dialog 承载语义，屏幕阅读器行为一致。
- Tooltip 的 hover 模式忽略触摸指针；触摸/键盘聚焦仍按 focus 语义打开。`aria-describedby` 指向一个隐藏的 `role="tooltip"` 节点。
- Sheet 在 T05 只实现方向、尺寸、把手拖拽与进出场；snap points、detached、嵌套 sheet 尚未实现。

## 7. 样式与主题

- 保留 `className` 里的 BEM/工具类写法，改为 `class`。
- 不要用 `useMemo`/`tv()` 在业务层动态拼类；用组件的 `variant`/`size`/`color`。
- 主题：在 `<html>` 上加 `dark` 或 `data-theme`；与 HeroUI 一致。
- 自定义：优先覆盖 CSS 变量，不要改上游 BEM 选择器。
- 图标：HeroUI 内部图标不导出；使用 Iconify（推荐 Gravity UI 图标集）或自定义 SVG。

## 8. Nuxt

```ts
export default defineNuxtConfig({
  modules: ["@sail-ui/nuxt"],
  sailUI: {prefix: "S"},
});
```

- 自动导入 `<SButton>` 等；设置 `prefix: ""` 可关闭前缀。
- 模块自动注入样式、Tailwind v4、`ToastProvider`、`useToast`。
- SSR 默认开启；关闭覆盖层不输出 DOM。

## 9. 已知差异（必须知道）

| 差异                                   | 影响                                               | 处理                                                                                |
| -------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 静态 `<Select.Trigger>` 不工作         | 复制 React 示例会报解析失败                        | 改成 `<SelectTrigger>` 或 `:is`                                                     |
| `className` 函数不支持                 | 依赖 render props 的样式写法失效                   | scoped slot + `data-*` CSS                                                          |
| React 事件对象不存在                   | `e.continuePropagation()` 等失效                   | 用 Vue 事件 + 我们的 `PressEvent`                                                   |
| RAC 内部 hooks/context 不公开          | 深度定制代码失效                                   | 用公开 props/slots 或 `asChild`                                                     |
| `Table` 虚拟化/列宽 API 不同           | 迁移需改数据层                                     | 用 TanStack 表模型；见 ADR 0005                                                     |
| Toast manager 不是全局单例             | 直接 import `toast` 的写法失效                     | `useToast()` + `<ToastProvider />`                                                  |
| `disabled` 不是 `isDisabled` 别名      | 误用会静默失效                                     | 统一 `isDisabled`                                                                   |
| 日期值类型                             | React 用 `DateValue` 对象                          | Vue 同样用 `@internationalized/date` 值，不用原生 `Date`                            |
| `ToggleButtonGroup` 的选择模式         | React 用 `selectionMode` + `selectedKeys`（`Set`） | Vue 用 `type="single" \| "multiple"` + `v-model`（单选为字符串，多选为数组）        |
| `ToggleButton` / `ListBoxItem` 的标识  | React 用 `id` 作为选择键                           | Vue 用 `value`                                                                      |
| `Checkbox` / `Radio` / `Switch` 的 DOM | React 是 `<label>` + 隐藏原生 `input`              | Vue 同样输出 `<label>` + 隐藏原生 `input`，DOM 与参考实现一致                       |
| `Textarea` 自适应高度                  | React 的 TextArea 不自动增高                       | Vue 需显式开启 `autoResize`                                                         |
| `Form` 的提交                          | React 的 `onSubmit` 拿到合成事件                   | Vue 的 `@submit` 拿到原生 `SubmitEvent`，组件不阻止默认行为                         |
| TagGroup 的描述关联                    | React 经 TextContext 自动写入 `aria-describedby`   | 显式传 `aria-describedby` 并给 Description 设置 id；见 ADR 0010                     |
| ListBox 的 typeahead                   | React 可自定义文本                                 | 使用 item 渲染文本；`textValue` 仅作无 Label 时的 `aria-label`；见 ADR 0011         |
| Select 的列表组成                      | React 在 `Select.Popover` 内直接放 `ListBox`       | Vue 用 `SelectListBox` / `SelectItem`；独立 ListBox 不共享 Select 状态；见 ADR 0012 |
| Select 的 SSR 选中文本                 | 服务端输出 placeholder，挂载后才显示选中标签       | 无 hydration mismatch；依赖首屏文本的场景需注意；见 ADR 0012                        |
| Select 多选与禁用键                    | `v-model` 为数组；禁用键按值比较                   | `by` 支持键名或比较函数；空字符串 `value` 保留给“无选择”                            |
| Dropdown 的 trigger                    | React 克隆 `Dropdown` 的第一个子元素作为 trigger   | Vue 显式写 `<DropdownTrigger>`；见 ADR 0013                                         |
| Dropdown trigger 的外观                | `Dropdown.Trigger` 是 24px 的 `.dropdown__trigger` | Vue 同为原生 button，不叠加 `.button` 变体；需要按钮外观时加 `button button--*` 类  |
| Dropdown 的 item 标识                  | React 用 `id` 作为选择键                           | Vue 用 `value`                                                                      |
| Dropdown 的子菜单                      | `SubmenuTrigger` 内放 `Item` + `Popover`           | 结构相同，item 用共享 `MenuItem`；见 ADR 0013                                       |
| 独立 Menu 的宿主                       | React 可直接使用 `Menu`                            | Vue 的 `Menu` 必须位于 `DropdownPopover` 内；见 ADR 0013                            |

## 10. 迁移检查清单

- [ ] 包名/导入改为 `@sail-ui/vue` 与子路径。
- [ ] 引入 `@sail-ui/styles`，Tailwind v4 配置正确。
- [ ] 所有 `<X.Y>` 复合标签改为命名导出。
- [ ] `isOpen`/`onOpenChange` 改为 `v-model:open`。
- [ ] `selectedKey`/`onSelectionChange` 改为 `v-model`。
- [ ] `className` 改为 `class`；函数形式改 scoped slot。
- [ ] `onPress` 改为 `@press`；保留原生 `@click` 的场景。
- [ ] Toast 改为 `<ToastProvider />` + `useToast()`。
- [ ] Nuxt：加 `@sail-ui/nuxt`，确认前缀与 SSR。
- [ ] 跑一遍键盘与 SSR 冒烟；对照 [验收矩阵](./acceptance-matrix.md)。
