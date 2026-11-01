<script setup lang="ts">
import {ref} from "vue";

const plan = ref("free");
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SRadioGroup v-model="plan" class="max-w-sm" aria-label="Plan">
      <SRadio value="free">
        <SRadio-content>
          <SRadio-control>
            <SRadio-indicator />
          </SRadio-control>
          Free
        </SRadio-content>
      </SRadio>
      <SRadio value="pro">
        <SRadio-content>
          <SRadio-control>
            <SRadio-indicator />
          </SRadio-control>
          Pro
        </SRadio-content>
      </SRadio>
      <SRadio value="team" is-disabled>
        <SRadio-content>
          <SRadio-control>
            <SRadio-indicator />
          </SRadio-control>
          Team (unavailable)
        </SRadio-content>
      </SRadio>
    </SRadioGroup>
  </div>
</template>
