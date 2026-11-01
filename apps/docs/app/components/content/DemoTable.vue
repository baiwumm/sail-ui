<script setup lang="ts">
import type {TableColumn} from "@sail-ui/vue/table";

interface Member {
  id: number;
  name: string;
  role: string;
}

const columns: TableColumn[] = [
  {key: "name", header: "Name", allowsSorting: true, isRowHeader: true},
  {key: "role", header: "Role"},
];

const data: Member[] = [
  {id: 1, name: "Ada Lovelace", role: "Engineer"},
  {id: 2, name: "Grace Hopper", role: "Admiral"},
  {id: 3, name: "Jean Bartik", role: "Programmer"},
];
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <STable
      :columns="columns"
      :data="data"
      :get-row-key="(member: Member) => member.id"
      aria-label="Team members"
    />
  </div>
</template>
