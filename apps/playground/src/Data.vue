<script setup lang="ts">
import {Chip} from "@sail-ui/vue/chip";
import {
  InputOtp,
  InputOtpGroup,
  InputOtpSeparator,
  InputOtpSlot,
  REGEXP_ONLY_CHARS,
} from "@sail-ui/vue/input-otp";
import {Label} from "@sail-ui/vue/label";
import {Meter, MeterFill, MeterOutput, MeterTrack} from "@sail-ui/vue/meter";
import {ScrollShadow, type ScrollShadowVisibility} from "@sail-ui/vue/scroll-shadow";
import {Spinner} from "@sail-ui/vue/spinner";
import {Table, type TableColumn} from "@sail-ui/vue/table";
import {computed, ref} from "vue";

const shadowParagraphs = Array.from({length: 10}, (_, index) => index);
const shadowCards = Array.from({length: 8}, (_, index) => index);
const shadowEvent = ref<ScrollShadowVisibility>("none");
const otpValue = ref("");
const otpCompleteCode = ref("");
const otpComplete = ref("");
const otpPatternValue = ref("");

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

const tableColumns: TableColumn[] = [
  {key: "name", header: "Name", isRowHeader: true},
  {key: "role", header: "Role"},
  {key: "status", header: "Status"},
  {key: "email", header: "Email"},
];

const teamMembers = [
  {email: "kate@acme.com", id: 1, name: "Kate Moore", role: "CEO", status: "Active"},
  {email: "john@acme.com", id: 2, name: "John Smith", role: "CTO", status: "Active"},
  {email: "sara@acme.com", id: 3, name: "Sara Johnson", role: "CMO", status: "On Leave"},
  {email: "michael@acme.com", id: 4, name: "Michael Brown", role: "CFO", status: "Active"},
];

const emptyTeamMembers: typeof teamMembers = [];

const sortableTableColumns: TableColumn[] = [
  {key: "name", header: "Name", isRowHeader: true, allowsSorting: true},
  {key: "role", header: "Role", allowsSorting: true},
  {key: "status", header: "Status", allowsSorting: true},
  {key: "email", header: "Email"},
];
const defaultTableSort = {column: "name", direction: "ascending"} as const;
const selectedTeamMemberKeys = new Set([2]);
const disabledTeamMemberKeys = [4];

const resizableTableColumns: TableColumn[] = [
  {key: "name", header: "Name", isRowHeader: true, allowsResizing: true, width: 200, minWidth: 160},
  {key: "role", header: "Role", allowsResizing: true, width: 200, minWidth: 160},
  {key: "status", header: "Status", allowsResizing: true, width: 140, minWidth: 100},
  {key: "email", header: "Email", width: 200, minWidth: 160},
];

const tableStatusColor: Record<string, "danger" | "success" | "warning"> = {
  Active: "success",
  Inactive: "danger",
  "On Leave": "warning",
};

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
const demoStatuses = ["Active", "Inactive", "On Leave"] as const;

function generateDemoMembers(count: number) {
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

const virtualTableColumns: TableColumn[] = [
  {key: "name", header: "Name", isRowHeader: true},
  {key: "role", header: "Role"},
  {key: "email", header: "Email"},
];
const virtualTeamMembers = generateDemoMembers(1000).map(({email, id, name, role}) => ({
  email,
  id,
  name,
  role,
}));

const LOAD_MORE_PAGE_SIZE = 6;
const asyncTeamMembers = generateDemoMembers(18);
const asyncRows = ref(asyncTeamMembers.slice(0, LOAD_MORE_PAGE_SIZE));
const isLoadingMore = ref(false);
const hasMore = computed(() => asyncRows.value.length < asyncTeamMembers.length);

function handleLoadMore() {
  if (!hasMore.value || isLoadingMore.value) {
    return;
  }

  isLoadingMore.value = true;
  window.setTimeout(() => {
    asyncRows.value = asyncTeamMembers.slice(0, asyncRows.value.length + LOAD_MORE_PAGE_SIZE);
    isLoadingMore.value = false;
  }, 600);
}
</script>

<template>
  <section id="data-meter" class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-semibold">Meter</h2>
      <p class="text-sm text-muted">A quantity within a known range.</p>
    </div>

    <div class="flex flex-wrap items-start gap-8">
      <div class="flex w-64 flex-col gap-4" data-testid="meter-basic">
        <Meter :value="60">
          <Label>Storage</Label>
          <MeterOutput />
          <MeterTrack>
            <MeterFill />
          </MeterTrack>
        </Meter>
      </div>

      <div class="flex w-64 flex-col gap-4" data-testid="meter-sizes">
        <Meter
          v-for="item in sizes"
          :key="item.size"
          :color="item.color"
          :size="item.size"
          :value="item.value"
        >
          <Label>{{ item.label }}</Label>
          <MeterOutput />
          <MeterTrack>
            <MeterFill />
          </MeterTrack>
        </Meter>
      </div>

      <div class="flex w-64 flex-col gap-4" data-testid="meter-colors">
        <Meter v-for="item in colors" :key="item.color" :color="item.color" :value="50">
          <Label>{{ item.label }}</Label>
          <MeterOutput />
          <MeterTrack>
            <MeterFill />
          </MeterTrack>
        </Meter>
      </div>

      <div class="flex w-64 flex-col gap-4" data-testid="meter-custom">
        <Meter aria-label="Storage usage" :value="45">
          <MeterTrack>
            <MeterFill />
          </MeterTrack>
        </Meter>
        <Meter
          :format-options="{currency: 'USD', style: 'currency'}"
          :max-value="1000"
          :min-value="0"
          :value="750"
        >
          <Label>Revenue</Label>
          <MeterOutput />
          <MeterTrack>
            <MeterFill />
          </MeterTrack>
        </Meter>
      </div>
    </div>
  </section>

  <section id="data-scroll-shadow" class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-semibold">ScrollShadow</h2>
      <p class="text-sm text-muted">Fades content at the edges of a scroll container.</p>
    </div>

    <div class="flex flex-wrap items-start gap-8">
      <div class="flex w-80 flex-col gap-2">
        <h3 class="text-sm font-semibold">Vertical</h3>
        <ScrollShadow class="max-h-[240px] p-4" data-testid="scroll-shadow-vertical" tabindex="0">
          <div class="space-y-4">
            <p v-for="index in shadowParagraphs" :key="index">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
              risus hendrerit venenatis.
            </p>
          </div>
        </ScrollShadow>
      </div>

      <div class="flex w-80 flex-col gap-2">
        <h3 class="text-sm font-semibold">Horizontal</h3>
        <ScrollShadow
          class="p-4"
          data-testid="scroll-shadow-horizontal"
          orientation="horizontal"
          tabindex="0"
        >
          <div class="flex flex-row gap-4">
            <div
              v-for="index in shadowCards"
              :key="index"
              class="flex min-w-[160px] flex-col gap-1 rounded-xl bg-default p-3"
            >
              <span class="text-sm font-semibold">Card {{ index + 1 }}</span>
              <span class="text-xs text-muted">Horizontal item</span>
            </div>
          </div>
        </ScrollShadow>
      </div>

      <div class="flex w-80 flex-col gap-2">
        <h3 class="text-sm font-semibold">Controlled</h3>
        <ScrollShadow
          class="max-h-[160px] p-4"
          data-testid="scroll-shadow-controlled"
          visibility="both"
          tabindex="0"
        >
          <div class="space-y-4">
            <p v-for="index in shadowParagraphs" :key="index">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
              risus hendrerit venenatis.
            </p>
          </div>
        </ScrollShadow>
      </div>

      <div class="flex w-80 flex-col gap-2">
        <h3 class="text-sm font-semibold">Disabled</h3>
        <ScrollShadow
          :is-enabled="false"
          class="max-h-[160px] p-4"
          data-testid="scroll-shadow-disabled"
          tabindex="0"
        >
          <div class="space-y-4">
            <p v-for="index in shadowParagraphs" :key="index">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
              risus hendrerit venenatis.
            </p>
          </div>
        </ScrollShadow>
      </div>

      <div class="flex w-80 flex-col gap-2">
        <h3 class="text-sm font-semibold">Offset and size</h3>
        <ScrollShadow
          :offset="24"
          :size="80"
          class="max-h-[160px] p-4"
          data-testid="scroll-shadow-offset"
          tabindex="0"
        >
          <div class="space-y-4">
            <p v-for="index in shadowParagraphs" :key="index">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
              risus hendrerit venenatis.
            </p>
          </div>
        </ScrollShadow>
      </div>

      <div class="flex w-80 flex-col gap-2">
        <h3 class="text-sm font-semibold">Visibility change</h3>
        <ScrollShadow
          class="max-h-[160px] p-4"
          data-testid="scroll-shadow-event"
          tabindex="0"
          @visibility-change="shadowEvent = $event"
        >
          <div class="space-y-4">
            <p v-for="index in shadowParagraphs" :key="index">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
              risus hendrerit venenatis.
            </p>
          </div>
        </ScrollShadow>
        <span class="text-sm text-muted">
          Shadow state:
          <span data-testid="scroll-shadow-event-value">{{ shadowEvent }}</span>
        </span>
      </div>

      <div class="flex w-80 flex-col gap-2">
        <h3 class="text-sm font-semibold">Without overflow</h3>
        <ScrollShadow
          hide-scroll-bar
          class="max-h-[160px] p-4"
          data-testid="scroll-shadow-no-overflow"
          tabindex="0"
        >
          <p>Short content that fits without scrolling.</p>
        </ScrollShadow>
      </div>
    </div>
  </section>

  <section id="data-input-otp" class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-semibold">InputOtp</h2>
      <p class="text-sm text-muted">A one-time password input with grouped slots.</p>
    </div>

    <div class="flex flex-wrap items-start gap-8">
      <div class="flex w-[280px] flex-col gap-2">
        <h3 class="text-sm font-semibold">Basic</h3>
        <Label>Verify account</Label>
        <p class="text-sm text-muted">We've sent a code to a****@gmail.com</p>
        <InputOtp :max-length="6" data-testid="input-otp-basic">
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
          </InputOtpGroup>
          <InputOtpSeparator />
          <InputOtpGroup>
            <InputOtpSlot :index="3" />
            <InputOtpSlot :index="4" />
            <InputOtpSlot :index="5" />
          </InputOtpGroup>
        </InputOtp>
        <p class="text-sm text-muted">Didn't receive a code? Resend</p>
      </div>

      <div class="flex w-[280px] flex-col gap-2">
        <h3 class="text-sm font-semibold">Four digits</h3>
        <Label>Enter PIN</Label>
        <InputOtp :max-length="4" data-testid="input-otp-four-digits">
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
            <InputOtpSlot :index="3" />
          </InputOtpGroup>
        </InputOtp>
      </div>

      <div class="flex w-[280px] flex-col gap-2">
        <h3 class="text-sm font-semibold">Controlled</h3>
        <Label>Verify account</Label>
        <InputOtp v-model="otpValue" :max-length="6" data-testid="input-otp-controlled">
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
          </InputOtpGroup>
          <InputOtpSeparator />
          <InputOtpGroup>
            <InputOtpSlot :index="3" />
            <InputOtpSlot :index="4" />
            <InputOtpSlot :index="5" />
          </InputOtpGroup>
        </InputOtp>
        <p class="text-sm text-muted" data-testid="input-otp-controlled-value">
          <template v-if="otpValue.length > 0">
            Value: {{ otpValue }} ({{ otpValue.length }}/6) •
            <button class="font-medium text-foreground underline" @click="otpValue = ''">
              Clear
            </button>
          </template>
          <template v-else>Enter a 6-digit code</template>
        </p>
      </div>

      <div class="flex w-[280px] flex-col gap-2">
        <h3 class="text-sm font-semibold">On complete</h3>
        <Label>Verify account</Label>
        <InputOtp
          v-model="otpCompleteCode"
          :max-length="6"
          data-testid="input-otp-complete"
          @complete="otpComplete = $event"
        >
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
          </InputOtpGroup>
          <InputOtpSeparator />
          <InputOtpGroup>
            <InputOtpSlot :index="3" />
            <InputOtpSlot :index="4" />
            <InputOtpSlot :index="5" />
          </InputOtpGroup>
        </InputOtp>
        <p class="text-sm text-muted" data-testid="input-otp-complete-value">
          {{ otpComplete ? `Complete code: ${otpComplete}` : "Waiting for 6 digits" }}
        </p>
      </div>

      <div class="flex w-[280px] flex-col gap-2">
        <h3 class="text-sm font-semibold">Letters only</h3>
        <Label>Enter code (letters only)</Label>
        <p class="text-sm text-muted">Only alphabetic characters are allowed</p>
        <InputOtp
          v-model="otpPatternValue"
          :max-length="6"
          :pattern="REGEXP_ONLY_CHARS"
          data-testid="input-otp-pattern"
        >
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
          </InputOtpGroup>
          <InputOtpSeparator />
          <InputOtpGroup>
            <InputOtpSlot :index="3" />
            <InputOtpSlot :index="4" />
            <InputOtpSlot :index="5" />
          </InputOtpGroup>
        </InputOtp>
        <p class="text-sm text-muted" data-testid="input-otp-pattern-value">
          Value: {{ otpPatternValue || "empty" }}
        </p>
      </div>

      <div class="flex w-[280px] flex-col gap-2">
        <h3 class="text-sm font-semibold">Variants</h3>
        <Label>Primary variant</Label>
        <InputOtp :default-value="'123456'" :max-length="6" data-testid="input-otp-primary">
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
          </InputOtpGroup>
          <InputOtpSeparator />
          <InputOtpGroup>
            <InputOtpSlot :index="3" />
            <InputOtpSlot :index="4" />
            <InputOtpSlot :index="5" />
          </InputOtpGroup>
        </InputOtp>
        <Label>Secondary variant</Label>
        <InputOtp
          :default-value="'123456'"
          :max-length="6"
          data-testid="input-otp-secondary"
          variant="secondary"
        >
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
          </InputOtpGroup>
          <InputOtpSeparator />
          <InputOtpGroup>
            <InputOtpSlot :index="3" />
            <InputOtpSlot :index="4" />
            <InputOtpSlot :index="5" />
          </InputOtpGroup>
        </InputOtp>
      </div>

      <div class="flex w-[280px] flex-col gap-2">
        <h3 class="text-sm font-semibold">Disabled and invalid</h3>
        <Label is-disabled>Verify account</Label>
        <p class="text-sm text-muted">Code verification is currently disabled</p>
        <InputOtp is-disabled :max-length="6" data-testid="input-otp-disabled">
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
          </InputOtpGroup>
          <InputOtpSeparator />
          <InputOtpGroup>
            <InputOtpSlot :index="3" />
            <InputOtpSlot :index="4" />
            <InputOtpSlot :index="5" />
          </InputOtpGroup>
        </InputOtp>
        <Label is-invalid>Invalid code</Label>
        <InputOtp is-invalid :default-value="'123'" :max-length="6" data-testid="input-otp-invalid">
          <InputOtpGroup>
            <InputOtpSlot :index="0" />
            <InputOtpSlot :index="1" />
            <InputOtpSlot :index="2" />
          </InputOtpGroup>
          <InputOtpSeparator />
          <InputOtpGroup>
            <InputOtpSlot :index="3" />
            <InputOtpSlot :index="4" />
            <InputOtpSlot :index="5" />
          </InputOtpGroup>
        </InputOtp>
      </div>
    </div>
  </section>

  <section id="data-table" class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-semibold">Table</h2>
      <p class="text-sm text-muted">Displays structured data in rows and columns.</p>
    </div>

    <div class="flex flex-col gap-8">
      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-basic">
        <h3 class="text-sm font-semibold">Basic</h3>
        <Table
          :columns="tableColumns"
          :data="teamMembers"
          aria-label="Team members"
          content-class="min-w-[600px]"
        />
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-custom-cells">
        <h3 class="text-sm font-semibold">Custom cells</h3>
        <Table
          :columns="tableColumns"
          :data="teamMembers"
          aria-label="Table with custom cells"
          content-class="min-w-[600px]"
        >
          <template #cell-status="{value}">
            <Chip :color="tableStatusColor[String(value)]" size="sm" variant="soft">
              {{ value }}
            </Chip>
          </template>
        </Table>
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-secondary">
        <h3 class="text-sm font-semibold">Secondary variant</h3>
        <Table
          :columns="tableColumns"
          :data="teamMembers"
          aria-label="Secondary table"
          content-class="min-w-[600px]"
          variant="secondary"
        />
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-empty">
        <h3 class="text-sm font-semibold">Empty state</h3>
        <Table
          :columns="tableColumns"
          :data="emptyTeamMembers"
          aria-label="Empty table"
          content-class="min-w-[600px]"
        >
          <template #empty>
            <div class="flex w-full flex-col items-center justify-center gap-2 py-6 text-center">
              <span class="text-sm font-medium">No results found</span>
              <span class="text-sm text-muted">Try adjusting your search or filters.</span>
            </div>
          </template>
        </Table>
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-loading">
        <h3 class="text-sm font-semibold">Loading</h3>
        <Table
          :columns="tableColumns"
          :data="emptyTeamMembers"
          aria-label="Loading table"
          content-class="min-w-[600px]"
        >
          <template #empty>
            <div class="flex w-full flex-col items-center justify-center gap-2 py-6 text-center">
              <Spinner size="md" />
              <span class="text-sm text-muted">Loading...</span>
            </div>
          </template>
        </Table>
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-footer">
        <h3 class="text-sm font-semibold">With footer</h3>
        <Table
          :columns="tableColumns"
          :data="teamMembers"
          aria-label="Team members with footer"
          content-class="min-w-[600px]"
        >
          <template #footer>
            <span class="text-sm text-muted">Showing 1 to 4 of 18 results</span>
          </template>
        </Table>
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-sortable">
        <h3 class="text-sm font-semibold">Sortable columns</h3>
        <Table
          :columns="sortableTableColumns"
          :data="teamMembers"
          aria-label="Sortable team members"
          content-class="min-w-[600px]"
          :default-sort-descriptor="defaultTableSort"
        />
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-selection">
        <h3 class="text-sm font-semibold">Multiple selection</h3>
        <Table
          :columns="tableColumns"
          :data="teamMembers"
          aria-label="Table with multiple selection"
          content-class="min-w-[600px]"
          selection-mode="multiple"
          :default-selected-keys="selectedTeamMemberKeys"
          :disabled-keys="disabledTeamMemberKeys"
        />
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-resizable">
        <h3 class="text-sm font-semibold">Column resizing</h3>
        <Table
          :columns="resizableTableColumns"
          :data="teamMembers"
          aria-label="Column resizing"
          content-class="min-w-[700px]"
          is-resizable
        />
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-virtualized">
        <h3 class="text-sm font-semibold">Virtualized (1,000 rows)</h3>
        <Table
          :columns="virtualTableColumns"
          :data="virtualTeamMembers"
          aria-label="Virtualized table with 1000 rows"
          content-class="min-w-[700px]"
          is-virtualized
          :row-height="42"
          scroll-container-class="h-[320px] overflow-auto"
        />
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-2" data-testid="table-load-more">
        <h3 class="text-sm font-semibold">Load more and sticky header</h3>
        <Table
          :columns="tableColumns"
          :data="asyncRows"
          aria-label="Async loading"
          content-class="min-w-[600px]"
          :has-more="hasMore"
          :is-loading-more="isLoadingMore"
          is-sticky-header
          scroll-container-class="h-[280px] overflow-y-auto"
          @load-more="handleLoadMore"
        >
          <template #cell-status="{value}">
            <Chip :color="tableStatusColor[String(value)]" size="sm" variant="soft">
              {{ value }}
            </Chip>
          </template>
          <template #loadMore="{isLoading}">
            <Spinner v-if="isLoading" size="md" />
            <span v-else class="text-sm text-muted">Scroll to load more</span>
          </template>
        </Table>
      </div>
    </div>
  </section>
</template>
