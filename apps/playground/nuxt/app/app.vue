<script setup lang="ts">
import {Button} from "@sail-ui/vue/button";
import {Input, TextField} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalHeading,
  ModalTrigger,
} from "@sail-ui/vue/modal";
import {
  Select,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@sail-ui/vue/select";
import {ref} from "vue";

const name = ref("Ada");
// Reka's SelectValue reads the selected text from items that mount only on the
// client, so a preselected value would make the server emit the placeholder and
// hydration patch the text. Start empty to keep the fixture SSR-deterministic.
const state = ref<string | undefined>(undefined);
const modalOpen = ref(false);

const states = [
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "new-york", label: "New York"},
];
</script>

<template>
  <main class="mx-auto flex max-w-3xl flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Sail UI Nuxt fixture</h1>

    <Button id="ssr-button" variant="primary"> SSR Button </Button>

    <TextField class="max-w-sm" full-width>
      <Label>Name</Label>
      <Input id="ssr-input" v-model="name" placeholder="Your name" />
    </TextField>

    <Modal v-model:open="modalOpen">
      <ModalTrigger class="button button--secondary button--md"> Open Modal </ModalTrigger>
      <ModalBackdrop>
        <ModalContainer>
          <ModalDialog>
            <ModalCloseTrigger />
            <ModalHeading>Nuxt modal</ModalHeading>
            <ModalBody>Rendered only after hydration opens the modal.</ModalBody>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>

    <Select id="ssr-select" v-model="state" class="w-64" placeholder="Select one">
      <Label>State</Label>
      <SelectTrigger aria-label="State">
        <SelectValue />
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
  </main>
</template>
