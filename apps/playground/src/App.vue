<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  AlertDialogTrigger,
} from "@sail-ui/vue/alert-dialog";
import {Button} from "@sail-ui/vue/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDialog,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerHeading,
  DrawerTrigger,
} from "@sail-ui/vue/drawer";
import {
  Sheet,
  SheetBackdrop,
  SheetBody,
  SheetClose,
  SheetCloseTrigger,
  SheetContent,
  SheetDialog,
  SheetFooter,
  SheetHandle,
  SheetHeader,
  SheetHeading,
  SheetTrigger,
} from "@sail-ui/vue/sheet";
import {Input, TextField} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
import {Description} from "@sail-ui/vue/description";
import {FieldError} from "@sail-ui/vue/field-error";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ModalIcon,
  ModalTrigger,
} from "@sail-ui/vue/modal";
import {
  Select,
  Select as SelectCompound,
  SelectClearButton,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@sail-ui/vue/select";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDialog,
  PopoverHeading,
  PopoverTrigger,
} from "@sail-ui/vue/popover";
import {Tooltip, TooltipArrow, TooltipContent, TooltipTrigger} from "@sail-ui/vue/tooltip";
import {onMounted, reactive, ref} from "vue";

import Calendar from "./Calendar.vue";
import Collections from "./Collections.vue";
import Colors from "./Colors.vue";
import ComboBoxes from "./ComboBoxes.vue";
import Data from "./Data.vue";
import DateFields from "./DateFields.vue";
import DatePickers from "./DatePickers.vue";
import Forms from "./Forms.vue";
import Gallery from "./Gallery.vue";
import Toasts from "./Toasts.vue";

const inputValue = ref("heroui.com");
const state = ref<string | undefined>("california");
const compoundState = ref<string | undefined>("texas");
const modalOpen = ref(false);
const alertDialogOpen = ref(false);
const drawerOpen = ref(false);
const sideDrawerOpen = ref(false);
const sheetOpen = ref(false);
const filtersSheetOpen = ref(false);
const isDark = ref(false);
const showCompound = ref(false);

// Overlay visual matrix (tests/visual): one uncontrolled overlay per placement.
const alertDialogPlacements = ["auto", "top", "center", "bottom"] as const;
const edgePlacements = ["bottom", "top", "left", "right"] as const;
const popoverPlacements = ["bottom", "top", "left", "right"] as const;
const tooltipPlacements = ["top", "bottom", "left", "right"] as const;
const overlayOpen = reactive<Record<string, boolean>>({});

function closeOverlay(key: string) {
  overlayOpen[key] = false;
}

const states = [
  {id: "florida", label: "Florida"},
  {id: "delaware", label: "Delaware"},
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "new-york", label: "New York"},
  {id: "washington", label: "Washington"},
];

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get("theme");

  showCompound.value = params.has("compound");

  if (params.get("animations") === "slow") {
    document.documentElement.dataset.animations = "slow";
  }

  if (theme === "dark") {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  }
});
</script>

<template>
  <main class="mx-auto flex max-w-5xl flex-col gap-10 p-8">
    <header class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Sail UI playground</h1>
        <p class="text-sm text-muted">
          Button · Input · Overlays · Select · Collections · Forms · Display & feedback · Calendar ·
          Date pickers · Date &amp; time fields · Combo box · Colors
        </p>
      </div>
      <Button variant="outline" size="sm" @press="toggleTheme">
        {{ isDark ? "Light" : "Dark" }}
      </Button>
    </header>

    <section id="overlays" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Overlay matrix</h2>
      <div class="flex flex-wrap items-center gap-3">
        <AlertDialog
          v-for="placement in alertDialogPlacements"
          :key="`alert-dialog-${placement}`"
          v-model:open="overlayOpen[`alert-dialog-${placement}`]"
        >
          <AlertDialogTrigger class="button button--secondary button--md">
            Dialog {{ placement }}
          </AlertDialogTrigger>
          <AlertDialogBackdrop>
            <AlertDialogContainer :placement="placement">
              <AlertDialogDialog class="sm:max-w-[400px]">
                <AlertDialogCloseTrigger />
                <AlertDialogHeader>
                  <AlertDialogIcon status="danger" />
                  <AlertDialogHeading>Delete project permanently?</AlertDialogHeading>
                </AlertDialogHeader>
                <AlertDialogBody>
                  <p>
                    This will permanently delete <strong>Sail UI</strong> and all of its data. This
                    action cannot be undone.
                  </p>
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button variant="tertiary" @press="closeOverlay(`alert-dialog-${placement}`)">
                    Cancel
                  </Button>
                  <Button variant="danger" @press="closeOverlay(`alert-dialog-${placement}`)">
                    Delete project
                  </Button>
                </AlertDialogFooter>
              </AlertDialogDialog>
            </AlertDialogContainer>
          </AlertDialogBackdrop>
        </AlertDialog>

        <Drawer
          v-for="placement in edgePlacements"
          :key="`drawer-${placement}`"
          v-model:open="overlayOpen[`drawer-${placement}`]"
        >
          <DrawerTrigger class="button button--secondary button--md">
            Drawer {{ placement }}
          </DrawerTrigger>
          <DrawerBackdrop>
            <DrawerContent :placement="placement">
              <DrawerDialog>
                <DrawerCloseTrigger />
                <DrawerHandle v-if="placement === 'bottom'" />
                <DrawerHeader>
                  <DrawerHeading>Drawer</DrawerHeading>
                </DrawerHeader>
                <DrawerBody>
                  <p>Sliding panel from the {{ placement }} edge with a scrollable body.</p>
                </DrawerBody>
                <DrawerFooter>
                  <Button variant="tertiary" @press="closeOverlay(`drawer-${placement}`)">
                    Cancel
                  </Button>
                  <Button variant="primary" @press="closeOverlay(`drawer-${placement}`)">
                    Save
                  </Button>
                </DrawerFooter>
              </DrawerDialog>
            </DrawerContent>
          </DrawerBackdrop>
        </Drawer>

        <Sheet
          v-for="placement in edgePlacements"
          :key="`sheet-${placement}`"
          v-model:open="overlayOpen[`sheet-${placement}`]"
          :placement="placement"
        >
          <SheetTrigger class="button button--secondary button--md">
            Sheet {{ placement }}
          </SheetTrigger>
          <SheetBackdrop>
            <SheetContent>
              <SheetDialog>
                <SheetCloseTrigger />
                <SheetHandle v-if="placement === 'bottom'" />
                <SheetHeader>
                  <SheetHeading>Sheet</SheetHeading>
                </SheetHeader>
                <SheetBody>
                  <p>Sheet panel from the {{ placement }} edge.</p>
                </SheetBody>
                <SheetFooter>
                  <SheetClose class="button button--secondary button--md"> Close </SheetClose>
                </SheetFooter>
              </SheetDialog>
            </SheetContent>
          </SheetBackdrop>
        </Sheet>

        <Popover v-for="placement in popoverPlacements" :key="`popover-${placement}`">
          <PopoverTrigger class="button button--secondary button--md">
            Popover {{ placement }}
          </PopoverTrigger>
          <PopoverContent :placement="placement">
            <PopoverArrow />
            <PopoverDialog class="w-64">
              <PopoverHeading>Popover title</PopoverHeading>
              <p class="text-sm text-muted">Anchored content with an arrow.</p>
            </PopoverDialog>
          </PopoverContent>
        </Popover>

        <Tooltip v-for="placement in tooltipPlacements" :key="`tooltip-${placement}`" :delay="0">
          <TooltipTrigger class="button button--secondary button--md">
            Tooltip {{ placement }}
          </TooltipTrigger>
          <TooltipContent :placement="placement" show-arrow>
            <TooltipArrow />
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </div>
    </section>

    <section id="buttons" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Button</h2>
      <div class="flex flex-wrap items-center gap-3">
        <Button variant="primary"> Primary </Button>
        <Button variant="secondary"> Secondary </Button>
        <Button variant="tertiary"> Tertiary </Button>
        <Button variant="outline"> Outline </Button>
        <Button variant="ghost"> Ghost </Button>
        <Button variant="danger"> Danger </Button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Button size="sm"> Small </Button>
        <Button size="md"> Medium </Button>
        <Button size="lg"> Large </Button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Button is-disabled> Disabled </Button>
        <Button is-loading> Loading </Button>
        <Button aria-label="Add item" is-icon-only variant="secondary">
          <svg aria-hidden="true" class="size-4" fill="none" viewBox="0 0 16 16">
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            />
          </svg>
        </Button>
        <Button class="custom-button" data-testid="attrs-button" style="letter-spacing: 0.04em">
          Attrs
        </Button>
      </div>
    </section>

    <section id="input" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Input</h2>
      <div class="flex flex-wrap items-start gap-6">
        <TextField full-width class="max-w-sm">
          <Label>Domain</Label>
          <Input v-model="inputValue" placeholder="domain" />
          <Description>Use a domain you own.</Description>
        </TextField>
        <TextField is-invalid full-width class="max-w-sm">
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
          <FieldError>Enter a valid email address.</FieldError>
        </TextField>
        <TextField is-disabled full-width class="max-w-sm">
          <Label>API key</Label>
          <Input value="sk_live_***" />
          <Description>Managed by your workspace.</Description>
        </TextField>
      </div>
      <p class="text-sm text-muted">
        Controlled value: <span data-testid="input-value">{{ inputValue }}</span>
      </p>
    </section>

    <section id="modal" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Modal</h2>
      <div class="flex flex-wrap items-center gap-3">
        <Modal v-model:open="modalOpen">
          <ModalTrigger
            class="button button--secondary button--md inline-flex items-center justify-center"
          >
            Open Modal
          </ModalTrigger>
          <ModalBackdrop>
            <ModalContainer>
              <ModalDialog class="sm:max-w-[360px]">
                <ModalCloseTrigger />
                <ModalHeader>
                  <ModalIcon class="bg-default text-foreground">
                    <svg aria-hidden="true" class="size-5" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M5 15c6 0 9-3 9-9 3 3 4 6 4 9a5 5 0 0 1-10 0 8 8 0 0 1-3-0Z"
                        stroke="currentColor"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                      />
                    </svg>
                  </ModalIcon>
                  <ModalHeading>Welcome to Sail UI</ModalHeading>
                </ModalHeader>
                <ModalBody>
                  <p>A Vue 3 port of the HeroUI v3 CSS and DOM contract, built on Reka UI.</p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="secondary" @press="modalOpen = false"> Cancel </Button>
                  <Button @press="modalOpen = false"> Continue </Button>
                </ModalFooter>
              </ModalDialog>
            </ModalContainer>
          </ModalBackdrop>
        </Modal>
        <span class="text-sm text-muted" data-testid="modal-state"> open: {{ modalOpen }} </span>
      </div>
    </section>

    <section id="alert-dialog" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">AlertDialog</h2>
      <div class="flex flex-wrap items-center gap-3">
        <AlertDialog v-model:open="alertDialogOpen">
          <AlertDialogTrigger class="button button--secondary button--md">
            Delete project
          </AlertDialogTrigger>
          <AlertDialogBackdrop>
            <AlertDialogContainer placement="center">
              <AlertDialogDialog class="sm:max-w-[400px]">
                <AlertDialogCloseTrigger />
                <AlertDialogHeader>
                  <AlertDialogIcon status="danger" />
                  <AlertDialogHeading>Delete project permanently?</AlertDialogHeading>
                </AlertDialogHeader>
                <AlertDialogBody>
                  <p>
                    This will permanently delete <strong>Sail UI</strong> and all of its data. This
                    action cannot be undone.
                  </p>
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button variant="tertiary" @press="alertDialogOpen = false"> Cancel </Button>
                  <Button variant="danger" @press="alertDialogOpen = false">
                    Delete project
                  </Button>
                </AlertDialogFooter>
              </AlertDialogDialog>
            </AlertDialogContainer>
          </AlertDialogBackdrop>
        </AlertDialog>
        <span class="text-sm text-muted" data-testid="alert-dialog-state">
          open: {{ alertDialogOpen }}
        </span>
      </div>
    </section>

    <section id="drawer" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Drawer</h2>
      <p class="text-sm text-muted">
        Drag the handle down to dismiss the bottom drawer, or use Escape.
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <Drawer v-model:open="drawerOpen">
          <DrawerTrigger class="button button--secondary button--md">
            Open bottom drawer
          </DrawerTrigger>
          <DrawerBackdrop>
            <DrawerContent placement="bottom">
              <DrawerDialog>
                <DrawerCloseTrigger />
                <DrawerHandle />
                <DrawerHeader>
                  <DrawerHeading>Quick settings</DrawerHeading>
                </DrawerHeader>
                <DrawerBody>
                  <p>
                    Bottom drawers keep the full width and cap their height, so long content stays
                    scrollable while the panel slides from the bottom edge.
                  </p>
                </DrawerBody>
                <DrawerFooter>
                  <Button variant="tertiary" @press="drawerOpen = false"> Cancel </Button>
                  <Button variant="primary" @press="drawerOpen = false"> Save </Button>
                </DrawerFooter>
              </DrawerDialog>
            </DrawerContent>
          </DrawerBackdrop>
        </Drawer>
        <Drawer v-model:open="sideDrawerOpen">
          <DrawerTrigger class="button button--secondary button--md">
            Open side drawer
          </DrawerTrigger>
          <DrawerBackdrop>
            <DrawerContent placement="right">
              <DrawerDialog>
                <DrawerCloseTrigger />
                <DrawerHeader>
                  <DrawerHeading>Navigation</DrawerHeading>
                </DrawerHeader>
                <DrawerBody>
                  <p>
                    Side drawers use a fixed width and full height, sliding in from the right edge.
                  </p>
                </DrawerBody>
                <DrawerFooter>
                  <Button variant="secondary" @press="sideDrawerOpen = false"> Close </Button>
                </DrawerFooter>
              </DrawerDialog>
            </DrawerContent>
          </DrawerBackdrop>
        </Drawer>
        <span class="text-sm text-muted" data-testid="drawer-state"> open: {{ drawerOpen }} </span>
      </div>
    </section>

    <section id="sheet" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Sheet</h2>
      <p class="text-sm text-muted">
        Sheets slide from an edge and keep their own scrollable body.
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <Sheet v-model:open="sheetOpen" placement="left">
          <SheetTrigger class="button button--secondary button--md">
            Open navigation sheet
          </SheetTrigger>
          <SheetBackdrop variant="blur">
            <SheetContent>
              <SheetDialog>
                <SheetCloseTrigger />
                <SheetHeader>
                  <SheetHeading>Navigation</SheetHeading>
                </SheetHeader>
                <SheetBody>
                  <p>
                    The left sheet slides in from the viewport edge, keeps focus inside, and closes
                    from Escape, the backdrop, or the close button.
                  </p>
                </SheetBody>
                <SheetFooter>
                  <SheetClose class="button button--secondary button--md"> Close </SheetClose>
                </SheetFooter>
              </SheetDialog>
            </SheetContent>
          </SheetBackdrop>
        </Sheet>
        <Sheet v-model:open="filtersSheetOpen" placement="bottom">
          <SheetTrigger class="button button--secondary button--md">
            Open filters sheet
          </SheetTrigger>
          <SheetBackdrop>
            <SheetContent class="mx-auto max-w-[420px]">
              <SheetDialog>
                <SheetCloseTrigger />
                <SheetHandle />
                <SheetHeader>
                  <SheetHeading>Filters</SheetHeading>
                </SheetHeader>
                <SheetBody>
                  <p>Drag the handle down to dismiss the bottom sheet.</p>
                </SheetBody>
                <SheetFooter>
                  <SheetClose class="button button--secondary button--md"> Done </SheetClose>
                </SheetFooter>
              </SheetDialog>
            </SheetContent>
          </SheetBackdrop>
        </Sheet>
        <span class="text-sm text-muted" data-testid="sheet-state"> open: {{ sheetOpen }} </span>
      </div>
    </section>

    <section id="select" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Select</h2>
      <div class="flex flex-wrap items-start gap-6">
        <Select v-model="state" class="w-64" placeholder="Select one">
          <Label for="state-select">State</Label>
          <SelectTrigger id="state-select" aria-label="State">
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
        <p class="text-sm text-muted">
          Selected: <span data-testid="select-value">{{ state ?? "none" }}</span>
        </p>
      </div>
    </section>
    <section id="popover" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Popover</h2>
      <div class="flex flex-wrap items-start gap-3">
        <Popover>
          <PopoverTrigger class="button button--secondary button--md">Open popover</PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverDialog class="w-64">
              <PopoverHeading>Popover title</PopoverHeading>
              <p class="text-sm text-muted">
                Anchored content with an arrow, placement flipping, and Escape dismissal.
              </p>
              <Popover>
                <PopoverTrigger class="button button--secondary button--sm mt-3">
                  Open nested popover
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverDialog class="w-56">
                    <PopoverHeading>Nested title</PopoverHeading>
                    <p class="text-sm text-muted">
                      Nested content stays inside the parent layer until dismissed.
                    </p>
                  </PopoverDialog>
                </PopoverContent>
              </Popover>
            </PopoverDialog>
          </PopoverContent>
        </Popover>
      </div>
    </section>

    <section id="tooltip" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Tooltip</h2>
      <div class="flex flex-wrap items-center gap-3">
        <Tooltip :delay="0">
          <TooltipTrigger class="button button--secondary button--md">
            Hover or focus for details
          </TooltipTrigger>
          <TooltipContent show-arrow>
            <TooltipArrow />
            Tooltips open after the shared delay and close with the grace period.
          </TooltipContent>
        </Tooltip>
        <Tooltip :delay="0" trigger="focus">
          <TooltipTrigger class="button button--secondary button--md">
            Focus-only tooltip
          </TooltipTrigger>
          <TooltipContent placement="bottom">Opened on focus only.</TooltipContent>
        </Tooltip>
      </div>
    </section>

    <section
      v-if="showCompound"
      id="compound"
      class="flex flex-col gap-4"
      data-testid="compound-demo"
    >
      <h2 class="text-lg font-semibold">Compound API</h2>
      <component
        :is="SelectCompound.Root"
        v-model="compoundState"
        class="w-64"
        placeholder="Compound"
      >
        <component :is="SelectCompound.Trigger" aria-label="Compound select">
          <component :is="SelectCompound.Value" />
          <component :is="SelectCompound.Indicator" />
        </component>
        <component :is="SelectCompound.Popover">
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
        </component>
      </component>
    </section>
    <Collections />
    <Forms />
    <Calendar />
    <DateFields />
    <DatePickers />
    <ComboBoxes />
    <Colors />
    <Data />
    <Gallery />
    <Toasts />
  </main>
</template>
