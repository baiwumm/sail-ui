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

| 家族      | React parts                                                                                                                                                                      | Vue named exports                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card      | `Card`, `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`                                                                                           | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`                                                                                      |
| Modal     | `Modal`, `Modal.Trigger`, `Modal.Backdrop`, `Modal.Container`, `Modal.Dialog`, `Modal.Header`, `Modal.Icon`, `Modal.Heading`, `Modal.Body`, `Modal.Footer`, `Modal.CloseTrigger` | `Modal`, `ModalTrigger`, `ModalBackdrop`, `ModalContainer`, `ModalDialog`, `ModalHeader`, `ModalIcon`, `ModalHeading`, `ModalBody`, `ModalFooter`, `ModalCloseTrigger` |
| Select    | `Select`, `Select.Trigger`, `Select.Value`, `Select.Popover`, `Select.Listbox`（以实际上游为准）                                                                                 | `Select`, `SelectTrigger`, `SelectValue`, `SelectPopover`, `ListBox`, …                                                                                                |
| Table     | `Table`, `Table.Root/ScrollContainer/Content/Header/Column/Body/Row/Cell/Footer/…`                                                                                               | `Table`, `TableRoot`, `TableScrollContainer`, `TableContent`, `TableHeader`, `TableColumn`, `TableBody`, `TableRow`, `TableCell`, `TableFooter`, …                     |
| Tabs      | `Tabs`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`                                                                                                                                    | `Tabs`, `TabsList`, `TabsTab`, `TabsPanel`                                                                                                                             |
| Accordion | `Accordion`, `Accordion.Item`, `Accordion.Trigger`, `Accordion.Panel`                                                                                                            | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`                                                                                                     |

> 命名以最终实现为准；每个组件的 `index.ts` 同时导出命名 part 与复合对象。文档不写静态点号标签。

## 3. Props

| React                               | Vue                       | 说明                                            |
| ----------------------------------- | ------------------------- | ----------------------------------------------- |
| `className`                         | `class`                   | 字符串；不接受函数                              |
| `style`                             | `style`                   | 同                                              |
| `isDisabled`                        | `isDisabled`              | 保留                                            |
| `isRequired`                        | `isRequired`              | 保留                                            |
| `isInvalid`                         | `isInvalid`               | 保留                                            |
| `isReadOnly`                        | `isReadOnly`              | 保留                                            |
| `isLoading`                         | `isLoading`               | 保留                                            |
| `isOpen`                            | `v-model:open`            | 不再单独传 `isOpen`（仍可传 `open` 做只读绑定） |
| `defaultOpen`                       | `defaultOpen`             | 非受控                                          |
| `onOpenChange`                      | `@update:open`            | `v-model:open` 的标准事件                       |
| `value` + `onChange`                | `v-model`                 | 输入/选择类                                     |
| `selectedKey` + `onSelectionChange` | `v-model`                 | Select/ListBox/Tabs；另发 `@selection-change`   |
| `defaultSelectedKey`                | `defaultSelectedKey`      | 非受控                                          |
| `expandedKeys` + `onExpandedChange` | `v-model:expanded-keys`   | Accordion/DisclosureGroup                       |
| `sortDescriptor` + `onSortChange`   | `v-model:sort-descriptor` | Table                                           |
| `as` / `asChild`                    | `as` / `asChild`          | 多态渲染                                        |
| `render` prop                       | scoped slot 或 `asChild`  | 不提供函数式 `className`                        |
| `ref`                               | `ref`                     | 指向根 DOM/组件                                 |

`disabled` **不是** `isDisabled` 的别名。原生 `disabled` 只用于直接映射到原生元素的场景；组件级禁用统一 `isDisabled`。

## 4. Events

| React               | Vue                                        | 说明                                                           |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `onPress`           | `@press`                                   | 指针 + 键盘激活；payload 是 Vue 对象/事件，不是 React 合成事件 |
| `onClick`           | `@click`                                   | 原生点击继续透传                                               |
| `onSelectionChange` | `@update:model-value`、`@selection-change` | `v-model` 优先                                                 |
| `onOpenChange`      | `@update:open`                             |                                                                |
| `onValueChange`     | `@update:model-value`                      |                                                                |
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
  ListBox,
  ListBoxItem,
  Select,
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
      <ListBox>
        <ListBoxItem id="a">A</ListBoxItem>
        <ListBoxItem id="b">B</ListBoxItem>
      </ListBox>
    </SelectPopover>
  </Select>
</template>
```

### 6.5 Toast

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

### 6.6 Form / Input

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

### 6.7 表单控件（19 个）

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

| 差异                                   | 影响                                               | 处理                                                                         |
| -------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| 静态 `<Select.Trigger>` 不工作         | 复制 React 示例会报解析失败                        | 改成 `<SelectTrigger>` 或 `:is`                                              |
| `className` 函数不支持                 | 依赖 render props 的样式写法失效                   | scoped slot + `data-*` CSS                                                   |
| React 事件对象不存在                   | `e.continuePropagation()` 等失效                   | 用 Vue 事件 + 我们的 `PressEvent`                                            |
| RAC 内部 hooks/context 不公开          | 深度定制代码失效                                   | 用公开 props/slots 或 `asChild`                                              |
| `Table` 虚拟化/列宽 API 不同           | 迁移需改数据层                                     | 用 TanStack 表模型；见 ADR 0005                                              |
| Toast manager 不是全局单例             | 直接 import `toast` 的写法失效                     | `useToast()` + `<ToastProvider />`                                           |
| `disabled` 不是 `isDisabled` 别名      | 误用会静默失效                                     | 统一 `isDisabled`                                                            |
| 日期值类型                             | React 用 `DateValue` 对象                          | Vue 同样用 `@internationalized/date` 值，不用原生 `Date`                     |
| `ToggleButtonGroup` 的选择模式         | React 用 `selectionMode` + `selectedKeys`（`Set`） | Vue 用 `type="single" \| "multiple"` + `v-model`（单选为字符串，多选为数组） |
| `ToggleButton` 的标识                  | React 用 `id` 作为选择键                           | Vue 用 `value`                                                               |
| `Checkbox` / `Radio` / `Switch` 的 DOM | React 是 `<label>` + 隐藏原生 `input`              | Vue 同样输出 `<label>` + 隐藏原生 `input`，DOM 与参考实现一致                |
| `Textarea` 自适应高度                  | React 的 TextArea 不自动增高                       | Vue 需显式开启 `autoResize`                                                  |
| `Form` 的提交                          | React 的 `onSubmit` 拿到合成事件                   | Vue 的 `@submit` 拿到原生 `SubmitEvent`，组件不阻止默认行为                  |

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
</content>
