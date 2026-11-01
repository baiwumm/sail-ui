<script setup lang="ts">
import {ref} from "vue";

const value = ref(62);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SProgressBar :value="value" class="w-64" aria-label="Upload progress">
      <SProgressBarTrack>
        <SProgressBarFill />
      </SProgressBarTrack>
      <SProgressBarOutput />
    </SProgressBar>

    <SProgressBar :value="null" is-indeterminate class="w-64" aria-label="Loading">
      <SProgressBarTrack>
        <SProgressBarFill />
      </SProgressBarTrack>
    </SProgressBar>

    <SProgressCircle :value="value" aria-label="Disk usage">
      <SProgressCircleTrack>
        <SProgressCircleFillCircle />
      </SProgressCircleTrack>
      <SProgressCircleOutput />
    </SProgressCircle>
  </div>
</template>
