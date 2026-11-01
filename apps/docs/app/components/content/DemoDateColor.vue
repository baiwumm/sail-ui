<script setup lang="ts">
import {ref} from "vue";

const dateValue = ref();
const timeValue = ref();
const hex = ref("#0a84ff");
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SDate-field-root v-model="dateValue" class="w-64" locale="en" aria-label="Date">
      <SLabel>Date</SLabel>
      <SDate-field-group>
        <SDate-field-input>
          <template #default="{segment}">
            <SDate-field-segment :segment="segment" />
          </template>
        </SDate-field-input>
      </SDate-field-group>
    </SDate-field-root>

    <STime-field-root v-model="timeValue" class="w-40" aria-label="Time">
      <SLabel>Time</SLabel>
      <STime-field-group>
        <STime-field-input>
          <template #default="{segment}">
            <STime-field-segment :segment="segment" />
          </template>
        </STime-field-input>
      </STime-field-group>
    </STime-field-root>

    <SColor-field-root v-model="hex" class="w-48" aria-label="Hex value">
      <SLabel>Color</SLabel>
      <SColor-field-group>
        <SColor-field-input />
      </SColor-field-group>
    </SColor-field-root>

    <SColor-slider-root v-model="hex" channel="hue" color-space="hsl" class="w-64" aria-label="Hue">
      <SColor-slider-track>
        <SColor-slider-thumb />
      </SColor-slider-track>
    </SColor-slider-root>
  </div>
</template>
