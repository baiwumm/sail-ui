import {
  Accordion,
  Description,
  Disclosure,
  DisclosureGroup,
  Dropdown,
  Header,
  Label,
  ListBox,
  Pagination,
  Select,
  Tag,
  TagGroup,
  Tabs,
} from "@heroui/react";
import {useState} from "react";

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

const initialTags = [
  {label: "News", value: "news"},
  {label: "Travel", value: "travel"},
  {label: "Gaming", value: "gaming"},
];

type PageItem = number | "ellipsis-start" | "ellipsis-end";

export default function Collections() {
  const [tags, setTags] = useState(initialTags);
  const [removedTags, setRemovedTags] = useState("none");
  const [listBoxAction, setListBoxAction] = useState("none");
  const [dropdownAction, setDropdownAction] = useState("none");
  const [page, setPage] = useState(3);
  const totalPages = 10;

  const pageItems: PageItem[] = (() => {
    if (page <= 3) {
      return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
    }

    if (page >= 8) {
      return [1, "ellipsis-start", 6, 7, 8, 9, totalPages];
    }

    return [1, "ellipsis-start", page - 1, page, page + 1, "ellipsis-end", totalPages];
  })();

  function handleTagRemove(keys: Set<React.Key>) {
    const removed = [...keys].map(String);

    setRemovedTags(removed.join(", "));
    setTags((current) => current.filter((tag) => !removed.includes(tag.value)));
  }

  return (
    <section id="collections" className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Collections</h2>
        <p className="text-sm text-muted">
          Accordion · Tabs · Tags · ListBox · Select · Dropdown · Pagination, built from named
          exports.
        </p>
      </header>

      <div id="collections-select" className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">Select</h3>
        <p className="text-sm text-muted">
          Keyboard: ArrowUp/ArrowDown move the highlight, Home/End jump to the edges, Enter selects,
          Escape closes, and typing letters jumps to a matching option.
        </p>
        <div className="flex flex-wrap items-start gap-6">
          <Select className="w-64" defaultValue="california" placeholder="Select one">
            <Label>Favorite state</Label>
            <Select.Trigger aria-label="Favorite state" data-testid="select-basic-trigger">
              <Select.Value />
              <Select.ClearButton />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {states.map((item) => (
                  <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                    {item.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select className="w-64" defaultValue="california" placeholder="Select a state">
            <Label>Grouped states</Label>
            <Select.Trigger aria-label="Grouped states">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Section>
                  <Header>West</Header>
                  {westStates.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox.Section>
                <ListBox.Section>
                  <Header>East</Header>
                  {eastStates.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox.Section>
              </ListBox>
            </Select.Popover>
          </Select>

          <Select
            className="w-72"
            defaultValue={["california", "texas"]}
            placeholder="Select states"
            selectionMode="multiple"
          >
            <Label>Visited states</Label>
            <Select.Trigger aria-label="Visited states">
              <Select.Value />
              <Select.ClearButton />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {states.map((item) => (
                  <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                    {item.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select
            className="w-72"
            defaultValue="texas"
            disabledKeys={["delaware"]}
            placeholder="Pick a plan"
          >
            <Label>Plan</Label>
            <Select.Trigger aria-label="Plan">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="california" textValue="California">
                  <Label>California</Label>
                  <Description>Custom rendered option</Description>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="texas" textValue="Texas">
                  <Label>Texas</Label>
                  <Description>Includes priority support</Description>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="delaware" isDisabled textValue="Delaware">
                  <Label>Delaware</Label>
                  <Description>Unavailable in your region</Description>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          <Select className="w-64" defaultValue="florida" isDisabled>
            <Label>Disabled</Label>
            <Select.Trigger aria-label="Disabled select">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="florida" textValue="Florida">
                  Florida
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
        <p className="text-sm text-muted">
          Value: <span data-testid="select-basic-value">california</span>
        </p>
      </div>

      <div id="collections-listbox" className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">ListBox</h3>
        <p className="text-sm text-muted">
          Standalone list boxes support single and multiple selection, sections, disabled keys, and
          the same arrow-key navigation as Select.
        </p>
        <div className="flex flex-wrap items-start gap-6">
          <ListBox
            aria-label="Team members"
            className="w-64"
            defaultSelectedKeys={["bob"]}
            selectionMode="single"
          >
            <ListBox.Item id="bob" textValue="Bob">
              <Label>Bob</Label>
              <Description>Design</Description>
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="fred" textValue="Fred">
              <Label>Fred</Label>
              <Description>Engineering</Description>
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="martha" isDisabled textValue="Martha">
              <Label>Martha</Label>
              <Description>On leave</Description>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>

          <ListBox
            aria-label="Produce"
            className="w-64"
            defaultSelectedKeys={["apple"]}
            selectionMode="single"
          >
            <ListBox.Section>
              <Header>Fruits</Header>
              <ListBox.Item id="apple" textValue="Apple">
                <Label>Apple</Label>
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="banana" textValue="Banana">
                <Label>Banana</Label>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox.Section>
            <ListBox.Section>
              <Header>Vegetables</Header>
              <ListBox.Item id="carrot" textValue="Carrot">
                <Label>Carrot</Label>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox.Section>
          </ListBox>

          <ListBox
            aria-label="Skills"
            className="w-64"
            defaultSelectedKeys={["typescript"]}
            onAction={(key) => setListBoxAction(String(key))}
            selectionMode="multiple"
          >
            <ListBox.Item id="typescript" textValue="TypeScript">
              <Label>TypeScript</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="vue" textValue="Vue">
              <Label>Vue</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="css" textValue="CSS">
              <Label>CSS</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </div>
        <p className="text-sm text-muted">
          Last action: <span data-testid="listbox-action">{listBoxAction}</span>
        </p>
      </div>

      <div id="collections-dropdown" className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">Dropdown</h3>
        <p className="text-sm text-muted">
          Keyboard: ArrowUp/ArrowDown move, Home/End jump, typing searches, Enter activates, Escape
          closes. The last trigger flips above the viewport edge when space runs out.
        </p>
        <div className="flex flex-wrap items-start gap-6">
          <Dropdown>
            <Dropdown.Trigger>Project actions</Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu onAction={(key) => setDropdownAction(String(key))}>
                <Dropdown.Item id="edit" textValue="Edit">
                  <Label>Edit</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="duplicate" textValue="Duplicate">
                  <Label>Duplicate</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="archive" isDisabled textValue="Archive">
                  <Label>Archive</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="delete" textValue="Delete" variant="danger">
                  <Label>Delete</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger>Grouped menu</Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu>
                <Dropdown.Section>
                  <Header>Account</Header>
                  <Dropdown.Item id="profile" textValue="Profile">
                    <Label>Profile</Label>
                    <Dropdown.ItemIndicator type="dot" />
                  </Dropdown.Item>
                  <Dropdown.Item id="billing" textValue="Billing">
                    <Label>Billing</Label>
                    <Dropdown.ItemIndicator type="dot" />
                  </Dropdown.Item>
                </Dropdown.Section>
                <Dropdown.Section>
                  <Header>Workspace</Header>
                  <Dropdown.Item id="members" textValue="Members">
                    <Label>Members</Label>
                    <Dropdown.ItemIndicator type="dot" />
                  </Dropdown.Item>
                  <Dropdown.Item id="settings" textValue="Settings">
                    <Label>Settings</Label>
                    <Dropdown.ItemIndicator type="dot" />
                  </Dropdown.Item>
                </Dropdown.Section>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger>Edge actions</Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu aria-label="Edge actions">
                <Dropdown.Item id="first" textValue="First action">
                  <Label>First action</Label>
                </Dropdown.Item>
                <Dropdown.Item id="second" textValue="Second action">
                  <Label>Second action</Label>
                </Dropdown.Item>
                <Dropdown.Item id="third" textValue="Third action">
                  <Label>Third action</Label>
                </Dropdown.Item>
                <Dropdown.Item id="fourth" textValue="Fourth action">
                  <Label>Fourth action</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
        <p className="text-sm text-muted">
          Last action: <span data-testid="dropdown-action">{dropdownAction}</span>
        </p>
      </div>

      <div id="collections-accordion" className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">Accordion</h3>
        <p className="text-sm text-muted">
          Keyboard: Tab focuses a trigger, Enter or Space toggles it, and ArrowUp/ArrowDown move
          between triggers.
        </p>
        <div className="flex flex-wrap items-start gap-6">
          <Accordion className="w-full max-w-md" defaultExpandedKeys={["shipping"]}>
            <Accordion.Item id="shipping">
              <Accordion.Heading>
                <Accordion.Trigger>
                  Shipping
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  Ships within two business days from the nearest warehouse.
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item id="returns">
              <Accordion.Heading>
                <Accordion.Trigger>
                  Returns
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>Returns are accepted within 30 days of delivery.</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item id="support" isDisabled>
              <Accordion.Heading>
                <Accordion.Trigger>
                  Support
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>Contact support from your account page.</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Accordion
            allowsMultipleExpanded
            className="w-full max-w-md"
            defaultExpandedKeys={["shipping", "returns"]}
            variant="surface"
          >
            <Accordion.Item id="shipping">
              <Accordion.Heading>
                <Accordion.Trigger>
                  Shipping
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>Surface accordions can keep several items open.</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item id="returns">
              <Accordion.Heading>
                <Accordion.Trigger>
                  Returns
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>Multiple panels stay expanded at the same time.</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>

        <DisclosureGroup
          className="flex w-full max-w-md flex-col"
          defaultExpandedKeys={["details"]}
        >
          <Disclosure id="details">
            <Disclosure.Heading>
              <Disclosure.Trigger>
                Order details
                <Disclosure.Indicator />
              </Disclosure.Trigger>
            </Disclosure.Heading>
            <Disclosure.Content>
              <Disclosure.Body>Order #1024 ships on July 12.</Disclosure.Body>
            </Disclosure.Content>
          </Disclosure>
          <Disclosure id="invoice">
            <Disclosure.Heading>
              <Disclosure.Trigger>
                Invoice
                <Disclosure.Indicator />
              </Disclosure.Trigger>
            </Disclosure.Heading>
            <Disclosure.Content>
              <Disclosure.Body>The invoice is available after delivery.</Disclosure.Body>
            </Disclosure.Content>
          </Disclosure>
        </DisclosureGroup>
        <p className="text-sm text-muted">
          Expanded: <span data-testid="accordion-expanded">shipping</span>
        </p>
      </div>

      <div id="collections-tabs" className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">Tabs</h3>
        <p className="text-sm text-muted">
          Horizontal tabs activate on arrow keys. The vertical group uses manual activation, so
          arrow keys move focus and Enter or Space selects.
        </p>
        <div className="flex flex-wrap items-start gap-10">
          <Tabs className="w-full max-w-lg" defaultSelectedKey="overview">
            <Tabs.ListContainer>
              <Tabs.List aria-label="Project sections">
                <Tabs.Tab id="overview">
                  Overview
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="activity">
                  Activity
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="settings" isDisabled>
                  Settings
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
            <Tabs.Panel id="overview">Overview content</Tabs.Panel>
            <Tabs.Panel id="activity">Activity content</Tabs.Panel>
            <Tabs.Panel id="settings">Settings content</Tabs.Panel>
          </Tabs>

          <Tabs
            className="flex gap-6"
            defaultSelectedKey="account"
            keyboardActivation="manual"
            orientation="vertical"
          >
            <Tabs.ListContainer>
              <Tabs.List aria-label="Account sections">
                <Tabs.Tab id="account">
                  Account
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="security">
                  Security
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
            <Tabs.Panel id="account">Account content</Tabs.Panel>
            <Tabs.Panel id="security">Security content</Tabs.Panel>
          </Tabs>
        </div>
        <p className="text-sm text-muted">
          Selected: <span data-testid="tabs-value">overview</span>
        </p>
      </div>

      <div id="collections-tag-group" className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">TagGroup</h3>
        <p className="text-sm text-muted">
          Tags can be removed with their delete button or Backspace, and selected with single or
          multiple selection. Arrow keys move between tags.
        </p>
        <div className="flex flex-wrap items-start gap-6">
          <TagGroup onRemove={handleTagRemove}>
            <TagGroup.List aria-label="Removable tags">
              {tags.map((tag) => (
                <Tag key={tag.value} id={tag.value} textValue={tag.label}>
                  {tag.label}
                </Tag>
              ))}
            </TagGroup.List>
          </TagGroup>

          <TagGroup defaultSelectedKeys={["news"]} selectionMode="single">
            <TagGroup.List aria-label="Filter tags">
              <Tag id="news" textValue="News">
                News
              </Tag>
              <Tag id="travel" textValue="Travel">
                Travel
              </Tag>
              <Tag id="gaming" isDisabled textValue="Gaming">
                Gaming
              </Tag>
            </TagGroup.List>
          </TagGroup>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <TagGroup selectionMode="none" size="sm">
            <TagGroup.List aria-label="Small tags">
              <Tag id="sm" textValue="Small">
                Small
              </Tag>
            </TagGroup.List>
          </TagGroup>
          <TagGroup selectionMode="none" size="md">
            <TagGroup.List aria-label="Medium tags">
              <Tag id="md" textValue="Medium">
                Medium
              </Tag>
            </TagGroup.List>
          </TagGroup>
          <TagGroup selectionMode="none" size="lg">
            <TagGroup.List aria-label="Large tags">
              <Tag id="lg" textValue="Large">
                Large
              </Tag>
            </TagGroup.List>
          </TagGroup>
        </div>
        <p className="text-sm text-muted">
          Removed: <span data-testid="tag-removed">{removedTags}</span>
        </p>
      </div>

      <div id="collections-pagination" className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">Pagination</h3>
        <p className="text-sm text-muted">
          The current page carries aria-current="page". Previous and next are native buttons with a
          disabled attribute at the edges.
        </p>
        <Pagination aria-label="Docs pages">
          <Pagination.Summary>
            Page {page} of {totalPages}
          </Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={page === 1}
                onPress={() => setPage((current) => Math.max(1, current - 1))}
              >
                <Pagination.PreviousIcon />
                Previous
              </Pagination.Previous>
            </Pagination.Item>
            {pageItems.map((item, index) =>
              item === "ellipsis-start" || item === "ellipsis-end" ? (
                <Pagination.Item key={`${item}-${index}`}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              ) : (
                <Pagination.Item key={`${item}-${index}`}>
                  <Pagination.Link isActive={page === item} onPress={() => setPage(item)}>
                    {item}
                  </Pagination.Link>
                </Pagination.Item>
              ),
            )}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={page === totalPages}
                onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
        <div className="flex flex-wrap items-center gap-6">
          <Pagination aria-label="Small pagination" size="sm">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous aria-label="Go to previous page">
                  <Pagination.PreviousIcon />
                </Pagination.Previous>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Link isActive>1</Pagination.Link>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Link>2</Pagination.Link>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Next aria-label="Go to next page">
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
          <Pagination aria-label="Medium pagination" size="md">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous aria-label="Go to previous page">
                  <Pagination.PreviousIcon />
                </Pagination.Previous>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Link isActive>1</Pagination.Link>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Link>2</Pagination.Link>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Next aria-label="Go to next page">
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
          <Pagination aria-label="Large pagination" size="lg">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous aria-label="Go to previous page">
                  <Pagination.PreviousIcon />
                </Pagination.Previous>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Link isActive>1</Pagination.Link>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Link>2</Pagination.Link>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Next aria-label="Go to next page">
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
        <Pagination aria-label="RTL pagination" dir="rtl" size="sm">
          <Pagination.Summary dir="rtl">الصفحة 2 من 5</Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous aria-label="Go to previous page">
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Link>1</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Link isActive>2</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Link>3</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Next aria-label="Go to next page">
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
        <p className="text-sm text-muted">
          Current page: <span data-testid="pagination-page">{page}</span>
        </p>
      </div>
    </section>
  );
}
