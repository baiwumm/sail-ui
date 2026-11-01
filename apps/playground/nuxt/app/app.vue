<script setup lang="ts">
// The @sail-ui/nuxt module auto-imports every component with the `S` prefix
// and `useToast`; nothing here needs an explicit @sail-ui/vue import.
import {ref} from "vue";

const name = ref("Ada");
// Reka's SelectValue reads the selected text from items that mount only on the
// client, so a preselected value would make the server emit the placeholder and
// hydration patch the text. Start empty to keep the fixture SSR-deterministic.
const state = ref<string | undefined>(undefined);
const modalOpen = ref(false);

const toast = useToast();

const states = [
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "new-york", label: "New York"},
];

function showToast() {
  toast("Saved", {description: "Your changes were stored."});
}
</script>

<template>
  <main class="mx-auto flex max-w-3xl flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Sail UI Nuxt fixture</h1>

    <SButton id="ssr-button" variant="primary"> SSR Button </SButton>

    <STextField class="max-w-sm" full-width>
      <SLabel>Name</SLabel>
      <SInput id="ssr-input" v-model="name" placeholder="Your name" />
    </STextField>

    <SModal v-model:open="modalOpen">
      <SModalTrigger class="button button--secondary button--md"> Open Modal </SModalTrigger>
      <SModalBackdrop>
        <SModalContainer>
          <SModalDialog>
            <SModalCloseTrigger />
            <SModalHeading>Nuxt modal</SModalHeading>
            <SModalBody>Rendered only after hydration opens the modal.</SModalBody>
          </SModalDialog>
        </SModalContainer>
      </SModalBackdrop>
    </SModal>

    <SSelect id="ssr-select" v-model="state" class="w-64" placeholder="Select one">
      <SLabel>State</SLabel>
      <SSelectTrigger aria-label="State">
        <SSelectValue />
        <SSelectIndicator />
      </SSelectTrigger>
      <SSelectPopover>
        <SSelectListBox>
          <SSelectItem
            v-for="item in states"
            :key="item.id"
            :text-value="item.label"
            :value="item.id"
          >
            {{ item.label }}
            <SSelectItemIndicator />
          </SSelectItem>
        </SSelectListBox>
      </SSelectPopover>
    </SSelect>

    <SButton id="ssr-toast" variant="secondary" @click="showToast"> Show toast </SButton>
  </main>
</template>
