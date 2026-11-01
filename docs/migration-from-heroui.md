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
| `<Meter.Output>`   | `<MeterOutput>`     | `<component :is="Meter.Output" />`   |
| `<Toast.Provider>` | `<ToastProvider>`   | —                                    |

完整映射：

| 家族      | React parts                                                                                                                                                                                | Vue named exports                                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card      | `Card`, `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`                                                                                                     | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`                                                                                      |
| Modal     | `Modal`, `Modal.Trigger`, `Modal.Backdrop`, `Modal.Container`, `Modal.Dialog`, `Modal.Header`, `Modal.Icon`, `Modal.Heading`, `Modal.Body`, `Modal.Footer`, `Modal.CloseTrigger`           | `Modal`, `ModalTrigger`, `ModalBackdrop`, `ModalContainer`, `ModalDialog`, `ModalHeader`, `ModalIcon`, `ModalHeading`, `ModalBody`, `ModalFooter`, `ModalCloseTrigger` |
| Select    | `Select`, `Select.Trigger`, `Select.Value`, `Select.Popover`, `ListBox`, `ListBox.Item`, `ListBox.ItemIndicator`                                                                           | `Select`, `SelectTrigger`, `SelectValue`, `SelectIndicator`, `SelectClearButton`, `SelectPopover`, `SelectListBox`, `SelectItem`, `SelectItemIndicator`                |
| Table     | `Table`, `Table.Root/ScrollContainer/Content/Header/Column/Body/Row/Cell/Footer/…`                                                                                                         | `Table`（数据驱动：`columns` + `data`，无 part；自定义用 `#cell-<key>` / `#header-<key>` 插槽）                                                                        |
| Tabs      | `Tabs`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`                                                                                                                                              | `Tabs`, `TabsList`, `TabsTab`, `TabsPanel`                                                                                                                             |
| Accordion | `Accordion`, `Accordion.Item`, `Accordion.Trigger`, `Accordion.Panel`                                                                                                                      | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`                                                                                                     |
| TagGroup  | `TagGroup`, `TagGroup.List`, `Tag`, `Tag.RemoveButton`                                                                                                                                     | `TagGroup`, `TagGroupList`, `Tag`, `TagRemoveButton`                                                                                                                   |
| ListBox   | `ListBox`, `ListBox.Item`, `ListBox.ItemIndicator`, `ListBox.Section`                                                                                                                      | `ListBox`, `ListBoxItem`, `ListBoxItemIndicator`, `ListBoxSection`                                                                                                     |
| Meter     | `Meter`, `Meter.Output`, `Meter.Track`, `Meter.Fill`                                                                                                                                       | `Meter`, `MeterOutput`, `MeterTrack`, `MeterFill`                                                                                                                      |
| InputOTP  | `InputOTP`, `InputOTP.Group`, `InputOTP.Slot`, `InputOTP.Separator`                                                                                                                        | `InputOtp`, `InputOtpGroup`, `InputOtpSlot`, `InputOtpSeparator`                                                                                                       |
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

### 6.10 日期、组合框与颜色（15 个）

日期与颜色组件同样用 `v-model` 取代受控 props；日期值统一使用 `@internationalized/date` 类型，颜色接受 CSS 字符串或 `Color` 对象。

| React                                                         | Vue                                                                                     |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `<Calendar value={date} onChange={setDate}>`                  | `<CalendarRoot v-model="date" v-model:focused="focused">`                               |
| `<RangeCalendar value={range} onChange={setRange}>`           | `<RangeCalendarRoot v-model="range">`                                                   |
| `<Calendar value={date} onChange={setDate}>`（YearPicker）    | `<CalendarRoot v-model="date">` + `<CalendarYearPickerTrigger>`（preview）              |
| `<DateField value={date} onChange={setDate}>`                 | `<DateFieldRoot v-model="date">`                                                        |
| `<TimeField value={time} onChange={setTime}>`                 | `<TimeFieldRoot v-model="time">`                                                        |
| `<DatePicker value={date} onChange={setDate}>`                | `<DatePickerRoot v-model="date">`                                                       |
| `<DateRangePicker value={range} onChange={setRange}>`         | `<DateRangePickerRoot v-model="range">`，值为 `{start?, end?} \| null`                  |
| `<ComboBox value={key} onChange={setKey}>`                    | `<ComboBox v-model="key">`，受控输入用 `v-model:input-value`                            |
| `<Autocomplete selectedKey={key} onSelectionChange={setKey}>` | `<Autocomplete v-model="key">`，过滤结果用 `ignore-filter` / `display-value` 接管       |
| `<ColorArea value={color} onChange={setColor}>`               | `<ColorAreaRoot v-model="color">`，`@change` 载荷为 hex 字符串                          |
| `<ColorSlider value={color} onChange={setColor}>`             | `<ColorSliderRoot v-model="color">`                                                     |
| `<ColorField value={color} onChange={setColor}>`              | `<ColorFieldRoot v-model="color">`                                                      |
| `<ColorSwatchPicker value={color} onChange={setColor}>`       | `<ColorSwatchPickerRoot v-model="color">`（item 用 `color` prop，不用子 `ColorSwatch`） |
| `<ColorPicker value={color} onChange={setColor}>`             | `<ColorPickerRoot v-model="color">`                                                     |
| `<ColorSwatch color={color} label="…" />`                     | `<ColorSwatchRoot color="…" label="…" />`，无 label 时需 `aria-label`                   |

- 日期分段必须显式组合：`DateFieldInput` 内提供 `DateFieldSegment`（`TimeFieldInput` 内置分段），`DateFieldInput` 通过 `slot="start"` / `slot="end"` 区分范围字段。
- `locale` 默认 `en` 以保证 SSR 稳定，可显式覆盖；`granularity`、`hour-cycle`、`placeholder-value`、`week-starts-on` 也都是显式 props。时区不在组件 prop 上，由 `DateValue`（如 `ZonedDateTime`）携带，组件不会在服务端读取浏览器环境。
- DatePicker / DateRangePicker 的日历位于 `DatePickerPopover` 内，弹层关闭后焦点回到 trigger；picker 内的 `CalendarRoot` / `RangeCalendarRoot` 自动继承 picker 的值、min/max、locale 与不可用日期。
- `ComboBox` 未提供 `display-value` 时，初始选中值在弹层首次挂载后才会回填输入框；需要稳定回显时传 `display-value` 函数或 `text-value`。
- 颜色组件不导出内部 `ColorInputGroup`；`ColorPicker` 直接组合 `ColorAreaRoot` / `ColorSliderRoot` / `ColorFieldRoot` / `ColorSwatchPickerRoot`。
- `ColorSwatchPickerRoot` 没有默认可访问名称，必须传 `aria-label`；禁用可下放到 item 级 `isDisabled`。

### 6.11 高级数据（4 个）

`Table` 不移植 RAC 的复合 part，而是用 `@tanstack/vue-table` 数据模型 + 自研 DOM/ARIA：传 `columns` 与 `data`，单元格和表头用插槽覆盖。`Meter`、`ScrollShadow`、`InputOtp` 保持与上游相同的 props 名称。

```vue
<Table
  :columns="[
    {
      key: 'name',
      header: 'Name',
      isRowHeader: true,
      allowsSorting: true,
      allowsResizing: true,
      width: 200,
      minWidth: 160,
    },
    {key: 'role', header: 'Role', allowsSorting: true},
  ]"
  :data="members"
  aria-label="Team members"
  selection-mode="multiple"
  v-model:selected-keys="selectedKeys"
  v-model:sort-descriptor="sort"
  is-resizable
  is-virtualized
  :row-height="42"
  scroll-container-class="h-[320px] overflow-auto"
  :has-more="hasMore"
  :is-loading-more="isLoadingMore"
  is-sticky-header
  @load-more="loadMore"
>
  <template #cell-role="{value}">
    <Chip size="sm" variant="soft">{{ value }}</Chip>
  </template>
  <template #loadMore="{isLoading}">
    <Spinner v-if="isLoading" size="md" />
  </template>
</Table>
```

| React                                                         | Vue                                                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `<Table><Table.Header><Table.Column>…`（RAC 复合 part）       | `columns` prop；`#header-<key>` / `#header` 插槽                                      |
| `<Table.Body><Table.Row><Table.Cell>`                         | `data` prop；`#cell-<key>` 插槽（`{row, value, column, rowIndex}`）                   |
| `sortDescriptor` + `onSortChange`                             | `v-model:sort-descriptor` / `default-sort-descriptor`（列 `allowsSorting`）           |
| `selectedKeys` + `onSelectionChange`                          | `v-model:selected-keys` / `default-selected-keys` + `selection-mode` / `disabledKeys` |
| `<Table.ColumnResizer>` + `defaultWidth` / `minWidth`         | 列上 `allowsResizing` + `width` / `minWidth` / `maxWidth`，根上 `is-resizable`        |
| RAC `Virtualizer` + `TableLayout`                             | `is-virtualized` + 固定 `row-height`（默认 44）+ `scroll-container-class`             |
| `<Table.LoadMore onLoadMore>` + `<Table.LoadMoreContent>`     | `has-more` / `is-loading-more` + `#loadMore` 插槽，滚动到底自动 `@load-more`          |
| `<Table.Header className="sticky top-0 …">`                   | `is-sticky-header`（内联 sticky，避免依赖消费方扫描工具类）                           |
| `<Meter value={72}><Meter.Output /><Meter.Track><Meter.Fill>` | `<Meter :value="72"><MeterOutput /><MeterTrack><MeterFill /></MeterTrack></Meter>`    |
| `<ScrollShadow />`                                            | `<ScrollShadow />`（`orientation` / `visibility` / `size` / `offset` / `isEnabled`）  |
| `<InputOTP maxLength={6}><InputOTP.Group><InputOTP.Slot>`     | `<InputOtp :max-length="6"><InputOtpGroup><InputOtpSlot :index="0">`                  |

- 虚拟化只能是固定行高：`row-height` 同时用于估算滚动高度与服务端首屏窗口（SSR 固定渲染前 10 行，挂载后由 virtualizer 接管，避免 hydration mismatch）。
- LoadMore 使用 `IntersectionObserver`（root 为滚动容器），仅在 `has-more` 且未处于 `is-loading-more` 时发一次；没有 `IntersectionObserver` 的环境不会触发。
- Table 的表格/网格语义由组件输出（`role="grid"`、`aria-rowcount`、2D 键盘），无需手动添加；`is-virtualized` 时 DOM 从 `<table>` 切换为 grid 行容器，样式仍走同一套上游 BEM 类。

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

| 差异                                   | 影响                                                                                                      | 处理                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 静态 `<Select.Trigger>` 不工作         | 复制 React 示例会报解析失败                                                                               | 改成 `<SelectTrigger>` 或 `:is`                                                        |
| `className` 函数不支持                 | 依赖 render props 的样式写法失效                                                                          | scoped slot + `data-*` CSS                                                             |
| React 事件对象不存在                   | `e.continuePropagation()` 等失效                                                                          | 用 Vue 事件 + 我们的 `PressEvent`                                                      |
| RAC 内部 hooks/context 不公开          | 深度定制代码失效                                                                                          | 用公开 props/slots 或 `asChild`                                                        |
| `Table` 是数据驱动                     | React 的复合 part 不能逐个替换                                                                            | 传 `columns` / `data`，自定义用插槽；见 6.11 与 ADR 0005                               |
| `Table` 列宽 API                       | `<Table.ColumnResizer>` 不存在                                                                            | 列上 `allowsResizing` + `width`/`minWidth`/`maxWidth`，根上 `is-resizable`             |
| `Table` 虚拟化需固定行高               | 动态行高/可变内容不适配                                                                                   | `is-virtualized` + `row-height`；DOM 切换为 grid 行容器                                |
| `Table` LoadMore 是 props + 插槽       | `Table.LoadMore` / `Table.LoadMoreContent` 不存在                                                         | `has-more` / `is-loading-more` + `#loadMore`，滚动触发 `@load-more`                    |
| Toast manager 不是全局单例             | 直接 import `toast` 的写法失效                                                                            | `useToast()` + `<ToastProvider />`                                                     |
| `disabled` 不是 `isDisabled` 别名      | 误用会静默失效                                                                                            | 统一 `isDisabled`                                                                      |
| 日期值类型                             | React 用 `DateValue` 对象                                                                                 | Vue 同样用 `@internationalized/date` 值，不用原生 `Date`                               |
| `ToggleButtonGroup` 的选择模式         | React 用 `selectionMode` + `selectedKeys`（`Set`）                                                        | Vue 用 `type="single" \| "multiple"` + `v-model`（单选为字符串，多选为数组）           |
| `ToggleButton` / `ListBoxItem` 的标识  | React 用 `id` 作为选择键                                                                                  | Vue 用 `value`                                                                         |
| `Checkbox` / `Radio` / `Switch` 的 DOM | React 是 `<label>` + 隐藏原生 `input`                                                                     | Vue 同样输出 `<label>` + 隐藏原生 `input`，DOM 与参考实现一致                          |
| `Textarea` 自适应高度                  | React 的 TextArea 不自动增高                                                                              | Vue 需显式开启 `autoResize`                                                            |
| `Form` 的提交                          | React 的 `onSubmit` 拿到合成事件                                                                          | Vue 的 `@submit` 拿到原生 `SubmitEvent`，组件不阻止默认行为                            |
| TagGroup 的描述关联                    | React 经 TextContext 自动写入 `aria-describedby`                                                          | 显式传 `aria-describedby` 并给 Description 设置 id；见 ADR 0010                        |
| ListBox 的 typeahead                   | React 可自定义文本                                                                                        | 使用 item 渲染文本；`textValue` 仅作无 Label 时的 `aria-label`；见 ADR 0011            |
| Select 的列表组成                      | React 在 `Select.Popover` 内直接放 `ListBox`                                                              | Vue 用 `SelectListBox` / `SelectItem`；独立 ListBox 不共享 Select 状态；见 ADR 0012    |
| Select 的 SSR 选中文本                 | 服务端输出 placeholder，挂载后才显示选中标签                                                              | 无 hydration mismatch；依赖首屏文本的场景需注意；见 ADR 0012                           |
| Select 多选与禁用键                    | `v-model` 为数组；禁用键按值比较                                                                          | `by` 支持键名或比较函数；空字符串 `value` 保留给“无选择”                               |
| Dropdown 的 trigger                    | React 克隆 `Dropdown` 的第一个子元素作为 trigger                                                          | Vue 显式写 `<DropdownTrigger>`；见 ADR 0013                                            |
| Dropdown trigger 的外观                | `Dropdown.Trigger` 是 24px 的 `.dropdown__trigger`                                                        | Vue 同为原生 button，不叠加 `.button` 变体；需要按钮外观时加 `button button--*` 类     |
| Dropdown 的 item 标识                  | React 用 `id` 作为选择键                                                                                  | Vue 用 `value`                                                                         |
| Dropdown 的子菜单                      | `SubmenuTrigger` 内放 `Item` + `Popover`                                                                  | 结构相同，item 用共享 `MenuItem`；见 ADR 0013                                          |
| 独立 Menu 的宿主                       | React 可直接使用 `Menu`                                                                                   | Vue 的 `Menu` 必须位于 `DropdownPopover` 内；见 ADR 0013                               |
| 日期分段输入                           | React 的 `DateField.Input` 自动渲染分段                                                                   | Vue 需在 `DateFieldInput` 内用插槽渲染 `DateFieldSegment`                              |
| 日期 picker 的值                       | RAC 的 `DateRangePicker` 需要完整范围                                                                     | Vue 的 `v-model` 允许 `{start?, end?} \| null`，键入中的半截范围也会保留               |
| 颜色事件载荷                           | React 的 `onChange` 给出 `Color` 对象                                                                     | Vue 的 `@change` 给出 hex 字符串；`v-model` 同时接受字符串与 `Color`                   |
| 颜色更新频率                           | React 在拖动结束时触发一次                                                                                | Vue 每次 update 触发 `@change`，与 RAC 的连续 input 事件对齐                           |
| SwatchPicker 的选项                    | React 在 item 内放子 `ColorSwatch`                                                                        | Vue 用 `<ColorSwatchPickerItem color="…">`，swatch 由 `ColorSwatchPickerSwatch` 渲染   |
| CalendarYearPicker                     | 上游仍在演进                                                                                              | 标为 preview，API 可能随上游调整                                                       |
| ComboBox 关闭态回显                    | React 的常驻 collection 可直接显示选中标签                                                                | Vue 在弹层首次挂载前不知道标签，需 `display-value` 或 `text-value`                     |
| 日期字段的 min/max 无效态              | Reka 初始渲染即标记 `data-invalid`；RAC 默认 `validationBehavior="native"` 要失焦/提交后才显示            | Vue 立即显示无效样式；逐像素对照 React 时给 `DateField` 传 `validationBehavior="aria"` |
| ColorArea 的默认值与通道               | RAC 默认值 `#ffffff`，缺省轴按颜色空间通道顺序（sRGB 为 red/green）；Reka 默认 `#ff0000` + hue/saturation | 需要同图时显式传 `default-value`、`color-space`、`x-channel`、`y-channel`              |
| 颜色 hex 字符串大小写                  | RAC 的 `toString("hex")` 输出大写，Reka 输出小写                                                          | 展示与比较前统一大小写；`v-model` 两种都接受                                           |
| `ToggleButtonGroup` 单选的方向键       | RAC 仅移动焦点，Enter/Space 激活                                                                          | Vue 保持 radio 惯例：方向键移动并选中；点击已选项可反选（与上游一致）                  |
| Tooltip 连续扫过                       | RAC 有全局 warmup：第一个 tooltip 打开后，closeDelay 窗口内换触发器立即打开并跳过退场                     | Vue 每次等满 `--tooltip-delay` 并播完整退场；warmup 计划随 `@sail-ui/nuxt` 提供        |
| 日期的 timeZone                        | RAC 经 `I18nProvider timeZone` 渲染                                                                       | Vue 使用浏览器本地时区；显式时区支持将随 ConfigProvider 提供                           |
| 日期组件的 dir                         | RAC 自动跟随 `document.dir`                                                                               | Vue 组件读显式 `dir` prop 或 `<html dir>`；`ConfigProvider` 可统一指定                 |
| Calendar 的视图                        | 上游支持 `visibleDuration` 为 weeks/days 的周/日视图                                                      | Vue 仅支持 months；周/日视图见迁移差异，暂不排期                                       |
| InputOtp 的额外 props                  | RAC 透传 OTPInput 的 `autoComplete`/`textAlign`/`pasteTransformer`                                        | Vue 暂只暴露 `mask` 与 `inputMode`；其余按需在迁移差异中追加                           |

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
