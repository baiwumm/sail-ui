import {
  Chip,
  InputOTP,
  Label,
  Meter,
  REGEXP_ONLY_CHARS,
  ScrollShadow,
  Spinner,
  Table,
} from "@heroui/react";
import type {ScrollShadowVisibility} from "@heroui/react";
import {TableLayout, Virtualizer} from "react-aria-components/Virtualizer";
import {type ReactNode, useMemo, useRef, useState} from "react";

const shadowParagraphs = Array.from({length: 10}, (_, index) => index);
const shadowCards = Array.from({length: 8}, (_, index) => index);

const colors = [
  {color: "default", label: "Default"},
  {color: "accent", label: "Accent"},
  {color: "success", label: "Success"},
  {color: "warning", label: "Warning"},
  {color: "danger", label: "Danger"},
] as const;

const sizes = [
  {color: "success", label: "Small", size: "sm", value: 40},
  {color: "accent", label: "Medium", size: "md", value: 60},
  {color: "warning", label: "Large", size: "lg", value: 80},
] as const;

interface TeamMember {
  email: string;
  id: number;
  name: string;
  role: string;
  status: string;
}

const teamMembers: TeamMember[] = [
  {email: "kate@acme.com", id: 1, name: "Kate Moore", role: "CEO", status: "Active"},
  {email: "john@acme.com", id: 2, name: "John Smith", role: "CTO", status: "Active"},
  {email: "sara@acme.com", id: 3, name: "Sara Johnson", role: "CMO", status: "On Leave"},
  {email: "michael@acme.com", id: 4, name: "Michael Brown", role: "CFO", status: "Active"},
];

const tableStatusColor: Record<string, "danger" | "success" | "warning"> = {
  Active: "success",
  Inactive: "danger",
  "On Leave": "warning",
};

function MembersTable({
  ariaLabel,
  customCells = false,
  emptyState,
  footer,
  selection = false,
  variant,
}: {
  ariaLabel: string;
  customCells?: boolean;
  emptyState?: ReactNode;
  footer?: ReactNode;
  selection?: boolean;
  variant?: "primary" | "secondary";
}) {
  const rows: TeamMember[] = emptyState ? [] : teamMembers;

  return (
    <Table variant={variant}>
      <Table.ScrollContainer>
        <Table.Content
          aria-label={ariaLabel}
          className="min-w-[600px]"
          defaultSelectedKeys={selection ? new Set([2]) : undefined}
          disabledKeys={selection ? [4] : undefined}
          selectionMode={selection ? "multiple" : undefined}
        >
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Email</Table.Column>
          </Table.Header>
          <Table.Body renderEmptyState={emptyState ? () => emptyState : undefined}>
            <Table.Collection items={rows}>
              {(user) => (
                <Table.Row id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    {customCells ? (
                      <Chip color={tableStatusColor[user.status]} size="sm" variant="soft">
                        {user.status}
                      </Chip>
                    ) : (
                      user.status
                    )}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              )}
            </Table.Collection>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {footer ? <Table.Footer>{footer}</Table.Footer> : null}
    </Table>
  );
}

function SortableMembersTable() {
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({column: "name", direction: "ascending"});

  const sortedRows = useMemo(() => {
    const rows = [...teamMembers];

    rows.sort((a, b) => {
      const first = String(a[sortDescriptor.column as keyof TeamMember]);
      const second = String(b[sortDescriptor.column as keyof TeamMember]);
      const comparison = first.localeCompare(second);

      return sortDescriptor.direction === "descending" ? -comparison : comparison;
    });

    return rows;
  }, [sortDescriptor]);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Sortable team members"
          className="min-w-[600px]"
          sortDescriptor={sortDescriptor}
          onSortChange={(descriptor) =>
            setSortDescriptor({
              column: String(descriptor.column),
              direction: descriptor.direction,
            })
          }
        >
          <Table.Header>
            <Table.Column id="name" isRowHeader allowsSorting>
              {({sortDirection}) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Name
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column id="role" allowsSorting>
              {({sortDirection}) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Role
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column id="status" allowsSorting>
              {({sortDirection}) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Status
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column id="email">Email</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Collection items={sortedRows}>
              {(user) => (
                <Table.Row id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              )}
            </Table.Collection>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

function ResizableMembersTable() {
  return (
    <Table>
      <Table.ResizableContainer>
        <Table.Content aria-label="Column resizing" className="min-w-[700px]">
          <Table.Header>
            <Table.Column defaultWidth={200} id="name" isRowHeader minWidth={160}>
              Name
              <Table.ColumnResizer />
            </Table.Column>
            <Table.Column defaultWidth={200} id="role" minWidth={160}>
              Role
              <Table.ColumnResizer />
            </Table.Column>
            <Table.Column defaultWidth={140} id="status" minWidth={100}>
              Status
              <Table.ColumnResizer />
            </Table.Column>
            <Table.Column defaultWidth={200} id="email" minWidth={160}>
              Email
            </Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Collection items={teamMembers}>
              {(user) => (
                <Table.Row id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              )}
            </Table.Collection>
          </Table.Body>
        </Table.Content>
      </Table.ResizableContainer>
    </Table>
  );
}

const demoFirstNames = [
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Ava",
  "James",
  "Sophia",
  "Oliver",
  "Isabella",
  "Lucas",
  "Mia",
  "Ethan",
  "Charlotte",
  "Mason",
  "Amelia",
  "Logan",
  "Harper",
  "Alexander",
];
const demoLastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Anderson",
  "Taylor",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Clark",
  "Lewis",
];
const demoRoles = [
  "Software Engineer",
  "Senior Engineer",
  "Staff Engineer",
  "Product Manager",
  "Designer",
  "Data Analyst",
  "QA Engineer",
  "DevOps Engineer",
  "Marketing Manager",
  "Sales Representative",
];
const demoStatuses = ["Active", "Inactive", "On Leave"];

function generateDemoMembers(count: number): TeamMember[] {
  return Array.from({length: count}, (_, index) => {
    const firstName = demoFirstNames[index % demoFirstNames.length]!;
    const lastName =
      demoLastNames[Math.floor(index / demoFirstNames.length) % demoLastNames.length]!;

    return {
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@acme.com`,
      id: index + 1,
      name: `${firstName} ${lastName}`,
      role: demoRoles[index % demoRoles.length]!,
      status: demoStatuses[index % demoStatuses.length]!,
    };
  });
}

const virtualizedUsers = generateDemoMembers(1000);
const asyncUsers = generateDemoMembers(18);
const ITEMS_PER_PAGE = 6;

function VirtualizedMembersTable() {
  return (
    <Virtualizer layout={TableLayout} layoutOptions={{headingHeight: 42, rowHeight: 42}}>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Virtualized table with 1000 rows"
            className="h-[320px] min-w-[700px] overflow-auto scrollbar"
          >
            <Table.Header className="h-full w-full">
              <Table.Column id="name" isRowHeader minWidth={160}>
                Name
              </Table.Column>
              <Table.Column id="role" minWidth={220}>
                Role
              </Table.Column>
              <Table.Column id="email" minWidth={240}>
                Email
              </Table.Column>
            </Table.Header>
            <Table.Body items={virtualizedUsers}>
              {(user) => (
                <Table.Row id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Virtualizer>
  );
}

function AsyncMembersTable() {
  const [items, setItems] = useState(() => asyncUsers.slice(0, ITEMS_PER_PAGE));
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const hasMore = items.length < asyncUsers.length;

  const loadMore = () => {
    if (!hasMore || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    window.setTimeout(() => {
      setItems((prev) => asyncUsers.slice(0, prev.length + ITEMS_PER_PAGE));
      setIsLoading(false);
      isLoadingRef.current = false;
    }, 600);
  };

  return (
    <Table>
      <Table.ScrollContainer className="h-[280px] overflow-y-auto">
        <Table.Content aria-label="Async loading" className="min-w-[600px]">
          <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
            <Table.Column id="name" isRowHeader>
              Name
            </Table.Column>
            <Table.Column id="role">Role</Table.Column>
            <Table.Column id="status">Status</Table.Column>
            <Table.Column id="email">Email</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Collection items={items}>
              {(user) => (
                <Table.Row id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    <Chip color={tableStatusColor[user.status]} size="sm" variant="soft">
                      {user.status}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              )}
            </Table.Collection>
            {hasMore ? (
              <Table.LoadMore isLoading={isLoading} scrollOffset={0} onLoadMore={loadMore}>
                <Table.LoadMoreContent>
                  {isLoading ? (
                    <Spinner size="md" />
                  ) : (
                    <span className="text-sm text-muted">Scroll to load more</span>
                  )}
                </Table.LoadMoreContent>
              </Table.LoadMore>
            ) : null}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export default function Data() {
  const [shadowState, setShadowState] = useState<ScrollShadowVisibility>("none");
  const [otpValue, setOtpValue] = useState("");
  const [otpCompleteCode, setOtpCompleteCode] = useState("");
  const [otpComplete, setOtpComplete] = useState("");
  const [otpPatternValue, setOtpPatternValue] = useState("");

  return (
    <>
      <section id="data-meter" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Meter</h2>
          <p className="text-sm text-muted">A quantity within a known range.</p>
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex w-64 flex-col gap-4" data-testid="meter-basic">
            <Meter value={60}>
              <Label>Storage</Label>
              <Meter.Output />
              <Meter.Track>
                <Meter.Fill />
              </Meter.Track>
            </Meter>
          </div>

          <div className="flex w-64 flex-col gap-4" data-testid="meter-sizes">
            {sizes.map((item) => (
              <Meter key={item.size} color={item.color} size={item.size} value={item.value}>
                <Label>{item.label}</Label>
                <Meter.Output />
                <Meter.Track>
                  <Meter.Fill />
                </Meter.Track>
              </Meter>
            ))}
          </div>

          <div className="flex w-64 flex-col gap-4" data-testid="meter-colors">
            {colors.map((item) => (
              <Meter key={item.color} color={item.color} value={50}>
                <Label>{item.label}</Label>
                <Meter.Output />
                <Meter.Track>
                  <Meter.Fill />
                </Meter.Track>
              </Meter>
            ))}
          </div>

          <div className="flex w-64 flex-col gap-4" data-testid="meter-custom">
            <Meter aria-label="Storage usage" value={45}>
              <Meter.Track>
                <Meter.Fill />
              </Meter.Track>
            </Meter>
            <Meter
              formatOptions={{currency: "USD", style: "currency"}}
              maxValue={1000}
              minValue={0}
              value={750}
            >
              <Label>Revenue</Label>
              <Meter.Output />
              <Meter.Track>
                <Meter.Fill />
              </Meter.Track>
            </Meter>
          </div>
        </div>
      </section>

      <section id="data-scroll-shadow" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">ScrollShadow</h2>
          <p className="text-sm text-muted">Fades content at the edges of a scroll container.</p>
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex w-80 flex-col gap-2">
            <h3 className="text-sm font-semibold">Vertical</h3>
            <ScrollShadow
              className="max-h-[240px] p-4"
              data-testid="scroll-shadow-vertical"
              tabIndex={0}
            >
              <div className="space-y-4">
                {shadowParagraphs.map((index) => (
                  <p key={index}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                    non risus hendrerit venenatis.
                  </p>
                ))}
              </div>
            </ScrollShadow>
          </div>

          <div className="flex w-80 flex-col gap-2">
            <h3 className="text-sm font-semibold">Horizontal</h3>
            <ScrollShadow
              className="p-4"
              data-testid="scroll-shadow-horizontal"
              orientation="horizontal"
              tabIndex={0}
            >
              <div className="flex flex-row gap-4">
                {shadowCards.map((index) => (
                  <div
                    key={index}
                    className="flex min-w-[160px] flex-col gap-1 rounded-xl bg-default p-3"
                  >
                    <span className="text-sm font-semibold">Card {index + 1}</span>
                    <span className="text-xs text-muted">Horizontal item</span>
                  </div>
                ))}
              </div>
            </ScrollShadow>
          </div>

          <div className="flex w-80 flex-col gap-2">
            <h3 className="text-sm font-semibold">Controlled</h3>
            <ScrollShadow
              className="max-h-[160px] p-4"
              data-testid="scroll-shadow-controlled"
              visibility="both"
              tabIndex={0}
            >
              <div className="space-y-4">
                {shadowParagraphs.map((index) => (
                  <p key={index}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                    non risus hendrerit venenatis.
                  </p>
                ))}
              </div>
            </ScrollShadow>
          </div>

          <div className="flex w-80 flex-col gap-2">
            <h3 className="text-sm font-semibold">Disabled</h3>
            <ScrollShadow
              className="max-h-[160px] p-4"
              data-testid="scroll-shadow-disabled"
              isEnabled={false}
              tabIndex={0}
            >
              <div className="space-y-4">
                {shadowParagraphs.map((index) => (
                  <p key={index}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                    non risus hendrerit venenatis.
                  </p>
                ))}
              </div>
            </ScrollShadow>
          </div>

          <div className="flex w-80 flex-col gap-2">
            <h3 className="text-sm font-semibold">Offset and size</h3>
            <ScrollShadow
              className="max-h-[160px] p-4"
              data-testid="scroll-shadow-offset"
              offset={24}
              size={80}
              tabIndex={0}
            >
              <div className="space-y-4">
                {shadowParagraphs.map((index) => (
                  <p key={index}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                    non risus hendrerit venenatis.
                  </p>
                ))}
              </div>
            </ScrollShadow>
          </div>

          <div className="flex w-80 flex-col gap-2">
            <h3 className="text-sm font-semibold">Visibility change</h3>
            <ScrollShadow
              className="max-h-[160px] p-4"
              data-testid="scroll-shadow-event"
              onVisibilityChange={(visibility) => setShadowState(visibility)}
              tabIndex={0}
            >
              <div className="space-y-4">
                {shadowParagraphs.map((index) => (
                  <p key={index}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                    non risus hendrerit venenatis.
                  </p>
                ))}
              </div>
            </ScrollShadow>
            <span className="text-sm text-muted">
              Shadow state: <span data-testid="scroll-shadow-event-value">{shadowState}</span>
            </span>
          </div>

          <div className="flex w-80 flex-col gap-2">
            <h3 className="text-sm font-semibold">Without overflow</h3>
            <ScrollShadow
              className="max-h-[160px] p-4"
              data-testid="scroll-shadow-no-overflow"
              hideScrollBar
              tabIndex={0}
            >
              <p>Short content that fits without scrolling.</p>
            </ScrollShadow>
          </div>
        </div>
      </section>

      <section id="data-input-otp" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">InputOtp</h2>
          <p className="text-sm text-muted">A one-time password input with grouped slots.</p>
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex w-[280px] flex-col gap-2">
            <h3 className="text-sm font-semibold">Basic</h3>
            <Label>Verify account</Label>
            <p className="text-sm text-muted">We&apos;ve sent a code to a****@gmail.com</p>
            <InputOTP data-testid="input-otp-basic" maxLength={6}>
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            <p className="text-sm text-muted">Didn&apos;t receive a code? Resend</p>
          </div>

          <div className="flex w-[280px] flex-col gap-2">
            <h3 className="text-sm font-semibold">Four digits</h3>
            <Label>Enter PIN</Label>
            <InputOTP data-testid="input-otp-four-digits" maxLength={4}>
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
                <InputOTP.Slot index={3} />
              </InputOTP.Group>
            </InputOTP>
          </div>

          <div className="flex w-[280px] flex-col gap-2">
            <h3 className="text-sm font-semibold">Controlled</h3>
            <Label>Verify account</Label>
            <InputOTP
              data-testid="input-otp-controlled"
              maxLength={6}
              value={otpValue}
              onChange={setOtpValue}
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            <p className="text-sm text-muted" data-testid="input-otp-controlled-value">
              {otpValue.length > 0 ? (
                <>
                  Value: {otpValue} ({otpValue.length}/6) •{" "}
                  <button
                    className="font-medium text-foreground underline"
                    onClick={() => setOtpValue("")}
                  >
                    Clear
                  </button>
                </>
              ) : (
                "Enter a 6-digit code"
              )}
            </p>
          </div>

          <div className="flex w-[280px] flex-col gap-2">
            <h3 className="text-sm font-semibold">On complete</h3>
            <Label>Verify account</Label>
            <InputOTP
              data-testid="input-otp-complete"
              maxLength={6}
              value={otpCompleteCode}
              onChange={setOtpCompleteCode}
              onComplete={(code) => setOtpComplete(code)}
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            <p className="text-sm text-muted" data-testid="input-otp-complete-value">
              {otpComplete ? `Complete code: ${otpComplete}` : "Waiting for 6 digits"}
            </p>
          </div>

          <div className="flex w-[280px] flex-col gap-2">
            <h3 className="text-sm font-semibold">Letters only</h3>
            <Label>Enter code (letters only)</Label>
            <p className="text-sm text-muted">Only alphabetic characters are allowed</p>
            <InputOTP
              data-testid="input-otp-pattern"
              maxLength={6}
              pattern={REGEXP_ONLY_CHARS}
              value={otpPatternValue}
              onChange={setOtpPatternValue}
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            <p className="text-sm text-muted" data-testid="input-otp-pattern-value">
              Value: {otpPatternValue || "empty"}
            </p>
          </div>

          <div className="flex w-[280px] flex-col gap-2">
            <h3 className="text-sm font-semibold">Variants</h3>
            <Label>Primary variant</Label>
            <InputOTP data-testid="input-otp-primary" defaultValue="123456" maxLength={6}>
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            <Label>Secondary variant</Label>
            <InputOTP
              data-testid="input-otp-secondary"
              defaultValue="123456"
              maxLength={6}
              variant="secondary"
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
          </div>

          <div className="flex w-[280px] flex-col gap-2">
            <h3 className="text-sm font-semibold">Disabled and invalid</h3>
            <Label isDisabled>Verify account</Label>
            <p className="text-sm text-muted">Code verification is currently disabled</p>
            <InputOTP data-testid="input-otp-disabled" isDisabled maxLength={6}>
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            <Label isInvalid>Invalid code</Label>
            <InputOTP data-testid="input-otp-invalid" defaultValue="123" isInvalid maxLength={6}>
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
          </div>
        </div>
      </section>

      <section id="data-table" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Table</h2>
          <p className="text-sm text-muted">Displays structured data in rows and columns.</p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-basic">
            <h3 className="text-sm font-semibold">Basic</h3>
            <MembersTable ariaLabel="Team members" />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-custom-cells">
            <h3 className="text-sm font-semibold">Custom cells</h3>
            <MembersTable ariaLabel="Table with custom cells" customCells />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-secondary">
            <h3 className="text-sm font-semibold">Secondary variant</h3>
            <MembersTable ariaLabel="Secondary table" variant="secondary" />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-empty">
            <h3 className="text-sm font-semibold">Empty state</h3>
            <MembersTable
              ariaLabel="Empty table"
              emptyState={
                <div className="flex w-full flex-col items-center justify-center gap-2 py-6 text-center">
                  <span className="text-sm font-medium">No results found</span>
                  <span className="text-sm text-muted">Try adjusting your search or filters.</span>
                </div>
              }
            />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-loading">
            <h3 className="text-sm font-semibold">Loading</h3>
            <MembersTable
              ariaLabel="Loading table"
              emptyState={
                <div className="flex w-full flex-col items-center justify-center gap-2 py-6 text-center">
                  <Spinner size="md" />
                  <span className="text-sm text-muted">Loading...</span>
                </div>
              }
            />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-footer">
            <h3 className="text-sm font-semibold">With footer</h3>
            <MembersTable
              ariaLabel="Team members with footer"
              footer={<span className="text-sm text-muted">Showing 1 to 4 of 18 results</span>}
            />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-sortable">
            <h3 className="text-sm font-semibold">Sortable columns</h3>
            <SortableMembersTable />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-selection">
            <h3 className="text-sm font-semibold">Multiple selection</h3>
            <MembersTable ariaLabel="Table with multiple selection" selection />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-resizable">
            <h3 className="text-sm font-semibold">Column resizing</h3>
            <ResizableMembersTable />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-virtualized">
            <h3 className="text-sm font-semibold">Virtualized (1,000 rows)</h3>
            <VirtualizedMembersTable />
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-2" data-testid="table-load-more">
            <h3 className="text-sm font-semibold">Load more and sticky header</h3>
            <AsyncMembersTable />
          </div>
        </div>
      </section>
    </>
  );
}
