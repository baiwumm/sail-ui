<script setup lang="ts">
import {ref} from "vue";

const listBoxValue = ref("bob");
const dropdownAction = ref("");
const page = ref(2);
const tagValues = ref(["vue", "nuxt"]);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <div class="flex flex-wrap items-start gap-6">
      <SList-box v-model="listBoxValue" aria-label="Team members" class="w-56">
        <SList-box-item value="bob" text-value="Bob">
          <SLabel>Bob</SLabel>
          <SList-box-item-indicator />
        </SList-box-item>
        <SList-box-item value="fred" text-value="Fred">
          <SLabel>Fred</SLabel>
          <SList-box-item-indicator />
        </SList-box-item>
        <SList-box-item is-disabled value="martha" text-value="Martha">
          <SLabel>Martha</SLabel>
          <SList-box-item-indicator />
        </SList-box-item>
      </SList-box>

      <SDropdown @action="dropdownAction = String($event)">
        <SDropdown-trigger>
          <SButton variant="secondary">Project actions</SButton>
        </SDropdown-trigger>
        <SDropdown-popover>
          <SDropdown-menu>
            <SMenu-item value="edit" text-value="Edit">
              <SLabel>Edit</SLabel>
              <SMenu-item-indicator />
            </SMenu-item>
            <SMenu-item value="duplicate" text-value="Duplicate">
              <SLabel>Duplicate</SLabel>
              <SMenu-item-indicator />
            </SMenu-item>
            <SMenu-item is-disabled value="archive" text-value="Archive">
              <SLabel>Archive</SLabel>
              <SMenu-item-indicator />
            </SMenu-item>
          </SDropdown-menu>
        </SDropdown-popover>
      </SDropdown>
    </div>

    <STabs class="w-full max-w-md">
      <STab-list-container>
        <STab-list aria-label="Project sections">
          <STab value="overview">
            Overview
            <STab-indicator />
          </STab>
          <STab value="activity">
            Activity
            <STab-indicator />
          </STab>
        </STab-list>
      </STab-list-container>
      <STab-panel value="overview">Overview content</STab-panel>
      <STab-panel value="activity">Activity content</STab-panel>
    </STabs>

    <SDisclosure-group :default-expanded-keys="['details']" class="max-w-md">
      <SDisclosure id="details">
        <SDisclosure-heading>
          <SDisclosure-trigger>
            Order details
            <SDisclosure-indicator />
          </SDisclosure-trigger>
        </SDisclosure-heading>
        <SDisclosure-content>
          <SDisclosure-body>Order #1024 ships on July 12.</SDisclosure-body>
        </SDisclosure-content>
      </SDisclosure>
      <SDisclosure id="invoice">
        <SDisclosure-heading>
          <SDisclosure-trigger>
            Invoice
            <SDisclosure-indicator />
          </SDisclosure-trigger>
        </SDisclosure-heading>
        <SDisclosure-content>
          <SDisclosure-body>The invoice is available after delivery.</SDisclosure-body>
        </SDisclosure-content>
      </SDisclosure>
    </SDisclosure-group>

    <STag-group v-model="tagValues" aria-label="Tags">
      <STag-group-list>
        <STag v-for="tag in tagValues" :key="tag" :value="tag" :text-value="tag">
          {{ tag }}
        </STag>
      </STag-group-list>
    </STag-group>

    <SPagination aria-label="Docs pages" class="max-w-md">
      <SPagination-summary>Page {{ page }} of 8</SPagination-summary>
      <SPagination-content>
        <SPagination-item>
          <SPagination-link :is-active="page === 1" @press="page = 1">1</SPagination-link>
        </SPagination-item>
        <SPagination-item>
          <SPagination-link :is-active="page === 2" @press="page = 2">2</SPagination-link>
        </SPagination-item>
      </SPagination-content>
    </SPagination>
  </div>
</template>
