<script setup lang="ts">
import {
  Accordion,
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@sail-ui/vue/accordion";
import {Description} from "@sail-ui/vue/description";
import {
  Disclosure,
  DisclosureBody,
  DisclosureContent,
  DisclosureHeading,
  DisclosureIndicator,
  DisclosureTrigger,
} from "@sail-ui/vue/disclosure";
import {DisclosureGroup} from "@sail-ui/vue/disclosure-group";
import {Dropdown, DropdownMenu, DropdownPopover, DropdownTrigger} from "@sail-ui/vue/dropdown";
import {Header} from "@sail-ui/vue/header";
import {Label} from "@sail-ui/vue/label";
import {ListBox, ListBoxItem, ListBoxItemIndicator, ListBoxSection} from "@sail-ui/vue/list-box";
import {MenuItem, MenuItemIndicator} from "@sail-ui/vue/menu-item";
import {MenuSection} from "@sail-ui/vue/menu-section";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationSummary,
} from "@sail-ui/vue/pagination";
import {
  Select,
  SelectClearButton,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@sail-ui/vue/select";
import {Tab, TabIndicator, TabList, TabListContainer, TabPanel, Tabs} from "@sail-ui/vue/tabs";
import {Tag} from "@sail-ui/vue/tag";
import {TagGroup, TagGroupList} from "@sail-ui/vue/tag-group";
import {computed, ref} from "vue";

import type {TagKey} from "@sail-ui/vue/tag-group";

const states = [
  {id: "florida", label: "Florida"},
  {id: "delaware", label: "Delaware"},
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "new-york", label: "New York"},
  {id: "washington", label: "Washington"},
];

const westStates = [
  {id: "california", label: "California"},
  {id: "washington", label: "Washington"},
];
const eastStates = [
  {id: "florida", label: "Florida"},
  {id: "delaware", label: "Delaware"},
  {id: "new-york", label: "New York"},
];

const basicSelect = ref<string | undefined>("california");
const groupedSelect = ref<string | undefined>("california");
const multipleSelect = ref<string[]>(["california", "texas"]);
const customSelect = ref<string | undefined>("texas");
const disabledSelect = ref<string | undefined>("florida");

const listBoxValue = ref<string | undefined>("bob");
const groupedListBoxValue = ref<string | undefined>("apple");
const multipleListBoxValue = ref<string[]>(["typescript"]);

const listBoxAction = ref("none");
const dropdownAction = ref("none");

const accordionKeys = ref<string[]>(["shipping"]);
const accordionMultipleKeys = ref<string[]>(["shipping", "returns"]);

const tabsValue = ref<string>("overview");
const verticalTabValue = ref<string>("account");

const tags = ref([
  {label: "News", value: "news"},
  {label: "Travel", value: "travel"},
  {label: "Gaming", value: "gaming"},
]);
const removedTags = ref<string>("none");
const selectedTag = ref<TagKey>("news");

const page = ref(3);
const totalPages = 10;
const pageItems = computed<Array<number | "ellipsis-start" | "ellipsis-end">>(() => {
  if (page.value <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
  }

  if (page.value >= 8) {
    return [1, "ellipsis-start", 6, 7, 8, 9, totalPages];
  }

  return [
    1,
    "ellipsis-start",
    page.value - 1,
    page.value,
    page.value + 1,
    "ellipsis-end",
    totalPages,
  ];
});

function goToPage(value: number) {
  page.value = value;
}

function previousPage() {
  page.value = Math.max(1, page.value - 1);
}

function nextPage() {
  page.value = Math.min(totalPages, page.value + 1);
}

function handleTagRemove(values: TagKey[]) {
  removedTags.value = values.join(", ");
  tags.value = tags.value.filter((tag) => !values.includes(tag.value));
}

function recordListBoxAction(value: string | number) {
  listBoxAction.value = String(value);
}

function recordDropdownAction(value: string | number) {
  dropdownAction.value = String(value);
}
</script>

<template>
  <section id="collections" class="flex flex-col gap-10">
    <header class="flex flex-col gap-1">
      <h2 class="text-lg font-semibold">Collections</h2>
      <p class="text-sm text-muted">
        Accordion · Tabs · Tags · ListBox · Select · Dropdown · Pagination, built from named
        exports.
      </p>
    </header>

    <div id="collections-select" class="flex flex-col gap-4">
      <h3 class="text-sm font-medium">Select</h3>
      <p class="text-sm text-muted">
        Keyboard: ArrowUp/ArrowDown move the highlight, Home/End jump to the edges, Enter selects,
        Escape closes, and typing letters jumps to a matching option.
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <Select v-model="basicSelect" class="w-64" placeholder="Select one">
          <Label for="collections-basic-select">Favorite state</Label>
          <SelectTrigger
            id="collections-basic-select"
            aria-label="Favorite state"
            data-testid="select-basic-trigger"
          >
            <SelectValue />
            <SelectClearButton />
            <SelectIndicator />
          </SelectTrigger>
          <SelectPopover>
            <SelectListBox>
              <SelectItem
                v-for="item in states"
                :key="item.id"
                :text-value="item.label"
                :value="item.id"
              >
                {{ item.label }}
                <SelectItemIndicator />
              </SelectItem>
            </SelectListBox>
          </SelectPopover>
        </Select>

        <Select v-model="groupedSelect" class="w-64" placeholder="Select a state">
          <Label for="collections-grouped-select">Grouped states</Label>
          <SelectTrigger id="collections-grouped-select" aria-label="Grouped states">
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectPopover>
            <SelectListBox>
              <ListBoxSection>
                <Header>West</Header>
                <SelectItem
                  v-for="item in westStates"
                  :key="item.id"
                  :text-value="item.label"
                  :value="item.id"
                >
                  {{ item.label }}
                  <SelectItemIndicator />
                </SelectItem>
              </ListBoxSection>
              <ListBoxSection>
                <Header>East</Header>
                <SelectItem
                  v-for="item in eastStates"
                  :key="item.id"
                  :text-value="item.label"
                  :value="item.id"
                >
                  {{ item.label }}
                  <SelectItemIndicator />
                </SelectItem>
              </ListBoxSection>
            </SelectListBox>
          </SelectPopover>
        </Select>

        <Select
          v-model="multipleSelect"
          class="w-72"
          placeholder="Select states"
          selection-mode="multiple"
        >
          <Label for="collections-multiple-select">Visited states</Label>
          <SelectTrigger id="collections-multiple-select" aria-label="Visited states">
            <SelectValue />
            <SelectClearButton />
            <SelectIndicator />
          </SelectTrigger>
          <SelectPopover>
            <SelectListBox>
              <SelectItem
                v-for="item in states"
                :key="item.id"
                :text-value="item.label"
                :value="item.id"
              >
                {{ item.label }}
                <SelectItemIndicator />
              </SelectItem>
            </SelectListBox>
          </SelectPopover>
        </Select>

        <Select
          v-model="customSelect"
          class="w-72"
          placeholder="Pick a plan"
          :disabled-keys="['delaware']"
        >
          <Label for="collections-custom-select">Plan</Label>
          <SelectTrigger id="collections-custom-select" aria-label="Plan">
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectPopover>
            <SelectListBox>
              <SelectItem value="california" text-value="California">
                <Label>California</Label>
                <Description>Custom rendered option</Description>
                <SelectItemIndicator />
              </SelectItem>
              <SelectItem value="texas" text-value="Texas">
                <Label>Texas</Label>
                <Description>Includes priority support</Description>
                <SelectItemIndicator />
              </SelectItem>
              <SelectItem is-disabled value="delaware" text-value="Delaware">
                <Label>Delaware</Label>
                <Description>Unavailable in your region</Description>
                <SelectItemIndicator />
              </SelectItem>
            </SelectListBox>
          </SelectPopover>
        </Select>

        <Select :model-value="disabledSelect" class="w-64" is-disabled>
          <Label for="collections-disabled-select">Disabled</Label>
          <SelectTrigger id="collections-disabled-select" aria-label="Disabled select">
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectPopover>
            <SelectListBox>
              <SelectItem value="florida" text-value="Florida">Florida</SelectItem>
            </SelectListBox>
          </SelectPopover>
        </Select>
      </div>
      <p class="text-sm text-muted">
        Value: <span data-testid="select-basic-value">{{ basicSelect ?? "none" }}</span>
      </p>
    </div>

    <div id="collections-listbox" class="flex flex-col gap-4">
      <h3 class="text-sm font-medium">ListBox</h3>
      <p class="text-sm text-muted">
        Standalone list boxes support single and multiple selection, sections, disabled keys, and
        the same arrow-key navigation as Select.
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <ListBox v-model="listBoxValue" aria-label="Team members" class="w-64">
          <ListBoxItem value="bob" text-value="Bob">
            <Label>Bob</Label>
            <Description>Design</Description>
            <ListBoxItemIndicator />
          </ListBoxItem>
          <ListBoxItem value="fred" text-value="Fred">
            <Label>Fred</Label>
            <Description>Engineering</Description>
            <ListBoxItemIndicator />
          </ListBoxItem>
          <ListBoxItem is-disabled value="martha" text-value="Martha">
            <Label>Martha</Label>
            <Description>On leave</Description>
            <ListBoxItemIndicator />
          </ListBoxItem>
        </ListBox>

        <ListBox v-model="groupedListBoxValue" aria-label="Produce" class="w-64">
          <ListBoxSection>
            <Header>Fruits</Header>
            <ListBoxItem value="apple" text-value="Apple">
              <Label>Apple</Label>
              <ListBoxItemIndicator />
            </ListBoxItem>
            <ListBoxItem value="banana" text-value="Banana">
              <Label>Banana</Label>
              <ListBoxItemIndicator />
            </ListBoxItem>
          </ListBoxSection>
          <ListBoxSection>
            <Header>Vegetables</Header>
            <ListBoxItem value="carrot" text-value="Carrot">
              <Label>Carrot</Label>
              <ListBoxItemIndicator />
            </ListBoxItem>
          </ListBoxSection>
        </ListBox>

        <ListBox
          v-model="multipleListBoxValue"
          aria-label="Skills"
          class="w-64"
          selection-mode="multiple"
          @action="recordListBoxAction"
        >
          <ListBoxItem value="typescript" text-value="TypeScript">
            <Label>TypeScript</Label>
            <ListBoxItemIndicator />
          </ListBoxItem>
          <ListBoxItem value="vue" text-value="Vue">
            <Label>Vue</Label>
            <ListBoxItemIndicator />
          </ListBoxItem>
          <ListBoxItem value="css" text-value="CSS">
            <Label>CSS</Label>
            <ListBoxItemIndicator />
          </ListBoxItem>
        </ListBox>
      </div>
      <p class="text-sm text-muted">
        Last action: <span data-testid="listbox-action">{{ listBoxAction }}</span>
      </p>
    </div>

    <div id="collections-dropdown" class="flex flex-col gap-4">
      <h3 class="text-sm font-medium">Dropdown</h3>
      <p class="text-sm text-muted">
        Keyboard: ArrowUp/ArrowDown move, Home/End jump, typing searches, Enter activates, Escape
        closes. The last trigger flips above the viewport edge when space runs out.
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <Dropdown @action="recordDropdownAction">
          <DropdownTrigger>Project actions</DropdownTrigger>
          <DropdownPopover>
            <DropdownMenu>
              <MenuItem value="edit" text-value="Edit">
                <Label>Edit</Label>
                <MenuItemIndicator />
              </MenuItem>
              <MenuItem value="duplicate" text-value="Duplicate">
                <Label>Duplicate</Label>
                <MenuItemIndicator />
              </MenuItem>
              <MenuItem is-disabled value="archive" text-value="Archive">
                <Label>Archive</Label>
                <MenuItemIndicator />
              </MenuItem>
              <MenuItem text-value="Delete" value="delete" variant="danger">
                <Label>Delete</Label>
                <MenuItemIndicator />
              </MenuItem>
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>Grouped menu</DropdownTrigger>
          <DropdownPopover>
            <DropdownMenu>
              <MenuSection>
                <Header>Account</Header>
                <MenuItem value="profile" text-value="Profile">
                  <Label>Profile</Label>
                  <MenuItemIndicator type="dot" />
                </MenuItem>
                <MenuItem value="billing" text-value="Billing">
                  <Label>Billing</Label>
                  <MenuItemIndicator type="dot" />
                </MenuItem>
              </MenuSection>
              <MenuSection>
                <Header>Workspace</Header>
                <MenuItem value="members" text-value="Members">
                  <Label>Members</Label>
                  <MenuItemIndicator type="dot" />
                </MenuItem>
                <MenuItem value="settings" text-value="Settings">
                  <Label>Settings</Label>
                  <MenuItemIndicator type="dot" />
                </MenuItem>
              </MenuSection>
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>Edge actions</DropdownTrigger>
          <DropdownPopover>
            <DropdownMenu aria-label="Edge actions">
              <MenuItem value="first" text-value="First action">
                <Label>First action</Label>
              </MenuItem>
              <MenuItem value="second" text-value="Second action">
                <Label>Second action</Label>
              </MenuItem>
              <MenuItem value="third" text-value="Third action">
                <Label>Third action</Label>
              </MenuItem>
              <MenuItem value="fourth" text-value="Fourth action">
                <Label>Fourth action</Label>
              </MenuItem>
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>
      </div>
      <p class="text-sm text-muted">
        Last action: <span data-testid="dropdown-action">{{ dropdownAction }}</span>
      </p>
    </div>

    <div id="collections-accordion" class="flex flex-col gap-4">
      <h3 class="text-sm font-medium">Accordion</h3>
      <p class="text-sm text-muted">
        Keyboard: Tab focuses a trigger, Enter or Space toggles it, and ArrowUp/ArrowDown move
        between triggers.
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <Accordion v-model:expanded-keys="accordionKeys" class="w-full max-w-md">
          <AccordionItem id="shipping">
            <AccordionHeading>
              <AccordionTrigger>
                Shipping
                <AccordionIndicator />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel>
              <AccordionBody>
                Ships within two business days from the nearest warehouse.
              </AccordionBody>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem id="returns">
            <AccordionHeading>
              <AccordionTrigger>
                Returns
                <AccordionIndicator />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel>
              <AccordionBody> Returns are accepted within 30 days of delivery. </AccordionBody>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem id="support" is-disabled>
            <AccordionHeading>
              <AccordionTrigger>
                Support
                <AccordionIndicator />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel>
              <AccordionBody> Contact support from your account page. </AccordionBody>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Accordion
          v-model:expanded-keys="accordionMultipleKeys"
          allows-multiple-expanded
          class="w-full max-w-md"
          variant="surface"
        >
          <AccordionItem id="shipping">
            <AccordionHeading>
              <AccordionTrigger>
                Shipping
                <AccordionIndicator />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel>
              <AccordionBody> Surface accordions can keep several items open. </AccordionBody>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem id="returns">
            <AccordionHeading>
              <AccordionTrigger>
                Returns
                <AccordionIndicator />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel>
              <AccordionBody> Multiple panels stay expanded at the same time. </AccordionBody>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>

      <DisclosureGroup :default-expanded-keys="['details']" class="flex w-full max-w-md flex-col">
        <Disclosure id="details">
          <DisclosureHeading>
            <DisclosureTrigger>
              Order details
              <DisclosureIndicator />
            </DisclosureTrigger>
          </DisclosureHeading>
          <DisclosureContent>
            <DisclosureBody> Order #1024 ships on July 12. </DisclosureBody>
          </DisclosureContent>
        </Disclosure>
        <Disclosure id="invoice">
          <DisclosureHeading>
            <DisclosureTrigger>
              Invoice
              <DisclosureIndicator />
            </DisclosureTrigger>
          </DisclosureHeading>
          <DisclosureContent>
            <DisclosureBody> The invoice is available after delivery. </DisclosureBody>
          </DisclosureContent>
        </Disclosure>
      </DisclosureGroup>
      <p class="text-sm text-muted">
        Expanded:
        <span data-testid="accordion-expanded">{{ accordionKeys.join(", ") || "none" }}</span>
      </p>
    </div>

    <div id="collections-tabs" class="flex flex-col gap-4">
      <h3 class="text-sm font-medium">Tabs</h3>
      <p class="text-sm text-muted">
        Horizontal tabs activate on arrow keys. The vertical group uses manual activation, so arrow
        keys move focus and Enter or Space selects.
      </p>
      <div class="flex flex-wrap items-start gap-10">
        <Tabs v-model="tabsValue" class="w-full max-w-lg">
          <TabListContainer>
            <TabList aria-label="Project sections">
              <Tab value="overview">
                Overview
                <TabIndicator />
              </Tab>
              <Tab value="activity">
                Activity
                <TabIndicator />
              </Tab>
              <Tab is-disabled value="settings">
                Settings
                <TabIndicator />
              </Tab>
            </TabList>
          </TabListContainer>
          <TabPanel value="overview">Overview content</TabPanel>
          <TabPanel value="activity">Activity content</TabPanel>
          <TabPanel value="settings">Settings content</TabPanel>
        </Tabs>

        <Tabs
          v-model="verticalTabValue"
          activation-mode="manual"
          class="flex gap-6"
          orientation="vertical"
        >
          <TabListContainer>
            <TabList aria-label="Account sections">
              <Tab value="account">
                Account
                <TabIndicator />
              </Tab>
              <Tab value="security">
                Security
                <TabIndicator />
              </Tab>
            </TabList>
          </TabListContainer>
          <TabPanel value="account">Account content</TabPanel>
          <TabPanel value="security">Security content</TabPanel>
        </Tabs>
      </div>
      <p class="text-sm text-muted">
        Selected: <span data-testid="tabs-value">{{ tabsValue }}</span>
      </p>
    </div>

    <div id="collections-tag-group" class="flex flex-col gap-4">
      <h3 class="text-sm font-medium">TagGroup</h3>
      <p class="text-sm text-muted">
        Tags can be removed with their delete button or Backspace, and selected with single or
        multiple selection. Arrow keys move between tags.
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <TagGroup @remove="handleTagRemove">
          <TagGroupList aria-label="Removable tags">
            <Tag v-for="tag in tags" :key="tag.value" :text-value="tag.label" :value="tag.value">
              {{ tag.label }}
            </Tag>
          </TagGroupList>
        </TagGroup>

        <TagGroup v-model="selectedTag" selection-mode="single">
          <TagGroupList aria-label="Filter tags">
            <Tag value="news" text-value="News">News</Tag>
            <Tag value="travel" text-value="Travel">Travel</Tag>
            <Tag is-disabled value="gaming" text-value="Gaming">Gaming</Tag>
          </TagGroupList>
        </TagGroup>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <TagGroup selection-mode="none" size="sm">
          <TagGroupList aria-label="Small tags">
            <Tag value="sm" text-value="Small">Small</Tag>
          </TagGroupList>
        </TagGroup>
        <TagGroup selection-mode="none" size="md">
          <TagGroupList aria-label="Medium tags">
            <Tag value="md" text-value="Medium">Medium</Tag>
          </TagGroupList>
        </TagGroup>
        <TagGroup selection-mode="none" size="lg">
          <TagGroupList aria-label="Large tags">
            <Tag value="lg" text-value="Large">Large</Tag>
          </TagGroupList>
        </TagGroup>
      </div>
      <p class="text-sm text-muted">
        Removed: <span data-testid="tag-removed">{{ removedTags }}</span>
      </p>
    </div>

    <div id="collections-pagination" class="flex flex-col gap-4">
      <h3 class="text-sm font-medium">Pagination</h3>
      <p class="text-sm text-muted">
        The current page carries aria-current="page". Previous and next are native buttons with a
        disabled attribute at the edges.
      </p>
      <Pagination aria-label="Docs pages">
        <PaginationSummary>Page {{ page }} of {{ totalPages }}</PaginationSummary>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious :is-disabled="page === 1" @press="previousPage">
              <PaginationPreviousIcon />
              Previous
            </PaginationPrevious>
          </PaginationItem>
          <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
            <PaginationItem v-if="item === 'ellipsis-start'">
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem v-else-if="item === 'ellipsis-end'">
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem v-else>
              <PaginationLink :is-active="page === item" @press="goToPage(item)">
                {{ item }}
              </PaginationLink>
            </PaginationItem>
          </template>
          <PaginationItem>
            <PaginationNext :is-disabled="page === totalPages" @press="nextPage">
              Next
              <PaginationNextIcon />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div class="flex flex-wrap items-center gap-6">
        <Pagination aria-label="Small pagination" size="sm">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious aria-label="Go to previous page">
                <PaginationPreviousIcon />
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink is-active>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext aria-label="Go to next page">
                <PaginationNextIcon />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Pagination aria-label="Medium pagination" size="md">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious aria-label="Go to previous page">
                <PaginationPreviousIcon />
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink is-active>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext aria-label="Go to next page">
                <PaginationNextIcon />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Pagination aria-label="Large pagination" size="lg">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious aria-label="Go to previous page">
                <PaginationPreviousIcon />
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink is-active>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext aria-label="Go to next page">
                <PaginationNextIcon />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <Pagination aria-label="RTL pagination" dir="rtl" size="sm">
        <PaginationSummary dir="rtl">الصفحة 2 من 5</PaginationSummary>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious aria-label="Go to previous page">
              <PaginationPreviousIcon />
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink is-active>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext aria-label="Go to next page">
              <PaginationNextIcon />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p class="text-sm text-muted">
        Current page: <span data-testid="pagination-page">{{ page }}</span>
      </p>
    </div>
  </section>
</template>
