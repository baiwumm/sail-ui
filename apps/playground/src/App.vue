<script setup lang="ts">
import {Button} from "@sail-ui/vue/button";
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
  ModalTrigger
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
  SelectValue
} from "@sail-ui/vue/select";
import {onMounted, ref} from "vue";

import Gallery from "./Gallery.vue";

const inputValue = ref("heroui.com");
const state = ref<string | undefined>("california");
const compoundState = ref<string | undefined>("texas");
const modalOpen = ref(false);
const isDark = ref(false);
const showCompound = ref(false);

const states = [
  {id: "florida", label: "Florida"},
  {id: "delaware", label: "Delaware"},
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "new-york", label: "New York"},
  {id: "washington", label: "Washington"}
];

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get("theme");

  showCompound.value = params.has("compound");

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
        <h1 class="text-2xl font-semibold">
          Sail UI playground
        </h1>
        <p class="text-sm text-muted">
          Button · Input · Modal · Select · Display & feedback
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        @press="toggleTheme"
      >
        {{ isDark ? "Light" : "Dark" }}
      </Button>
    </header>

    <section
      id="buttons"
      class="flex flex-col gap-4"
    >
      <h2 class="text-lg font-semibold">
        Button
      </h2>
      <div class="flex flex-wrap items-center gap-3">
        <Button variant="primary">
          Primary
        </Button>
        <Button variant="secondary">
          Secondary
        </Button>
        <Button variant="tertiary">
          Tertiary
        </Button>
        <Button variant="outline">
          Outline
        </Button>
        <Button variant="ghost">
          Ghost
        </Button>
        <Button variant="danger">
          Danger
        </Button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Button size="sm">
          Small
        </Button>
        <Button size="md">
          Medium
        </Button>
        <Button size="lg">
          Large
        </Button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Button is-disabled>
          Disabled
        </Button>
        <Button is-loading>
          Loading
        </Button>
        <Button
          aria-label="Add item"
          is-icon-only
          variant="secondary"
        >
          <svg
            aria-hidden="true"
            class="size-4"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            />
          </svg>
        </Button>
        <Button
          class="custom-button"
          data-testid="attrs-button"
          style="letter-spacing: 0.04em"
        >
          Attrs
        </Button>
      </div>
    </section>

    <section
      id="input"
      class="flex flex-col gap-4"
    >
      <h2 class="text-lg font-semibold">
        Input
      </h2>
      <div class="flex flex-wrap items-start gap-6">
        <TextField
          full-width
          class="max-w-sm"
        >
          <Label>Domain</Label>
          <Input
            v-model="inputValue"
            placeholder="domain"
          />
          <Description>Use a domain you own.</Description>
        </TextField>
        <TextField
          is-invalid
          full-width
          class="max-w-sm"
        >
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
          <FieldError>Enter a valid email address.</FieldError>
        </TextField>
        <TextField
          is-disabled
          full-width
          class="max-w-sm"
        >
          <Label>API key</Label>
          <Input value="sk_live_***" />
          <Description>Managed by your workspace.</Description>
        </TextField>
      </div>
      <p class="text-sm text-muted">
        Controlled value: <span data-testid="input-value">{{ inputValue }}</span>
      </p>
    </section>

    <section
      id="modal"
      class="flex flex-col gap-4"
    >
      <h2 class="text-lg font-semibold">
        Modal
      </h2>
      <div class="flex flex-wrap items-center gap-3">
        <Modal v-model:open="modalOpen">
          <ModalTrigger class="button button--secondary button--md">
            Open Modal
          </ModalTrigger>
          <ModalBackdrop>
            <ModalContainer>
              <ModalDialog class="sm:max-w-[360px]">
                <ModalCloseTrigger />
                <ModalHeader>
                  <ModalIcon class="bg-default text-foreground">
                    <svg
                      aria-hidden="true"
                      class="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
                  <p>
                    A Vue 3 port of the HeroUI v3 CSS and DOM contract, built on Reka UI.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="secondary"
                    @press="modalOpen = false"
                  >
                    Cancel
                  </Button>
                  <Button @press="modalOpen = false">
                    Continue
                  </Button>
                </ModalFooter>
              </ModalDialog>
            </ModalContainer>
          </ModalBackdrop>
        </Modal>
        <span
          class="text-sm text-muted"
          data-testid="modal-state"
        >
          open: {{ modalOpen }}
        </span>
      </div>
    </section>

    <section
      id="select"
      class="flex flex-col gap-4"
    >
      <h2 class="text-lg font-semibold">
        Select
      </h2>
      <div class="flex flex-wrap items-start gap-6">
        <Select
          v-model="state"
          class="w-64"
          placeholder="Select one"
        >
          <Label for="state-select">State</Label>
          <SelectTrigger
            id="state-select"
            aria-label="State"
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
        <p class="text-sm text-muted">
          Selected: <span data-testid="select-value">{{ state ?? "none" }}</span>
        </p>
      </div>
    </section>
    <section
      v-if="showCompound"
      id="compound"
      class="flex flex-col gap-4"
      data-testid="compound-demo"
    >
      <h2 class="text-lg font-semibold">
        Compound API
      </h2>
      <component
        :is="SelectCompound.Root"
        v-model="compoundState"
        class="w-64"
        placeholder="Compound"
      >
        <component
          :is="SelectCompound.Trigger"
          aria-label="Compound select"
        >
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
    <Gallery />
  </main>
</template>
