<script setup lang="ts">
const frameworks = [
  {id: "vue", label: "Vue"},
  {id: "nuxt", label: "Nuxt"},
  {id: "vite", label: "Vite"},
];

const selected = ref<string | undefined>(undefined);
</script>

<template>
  <div class="docs-demo">
    <SSelect v-model="selected" class="w-64" placeholder="Pick a framework">
      <SLabel>Framework</SLabel>
      <SSelectTrigger aria-label="Framework" class="w-full">
        <SSelectValue />
        <SSelectIndicator />
      </SSelectTrigger>
      <SSelectPopover>
        <SSelectListBox>
          <SSelectItem
            v-for="item in frameworks"
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
  </div>
</template>
