<script setup lang="ts">
import {ref} from "vue";

const notifications = ref(true);
const analytics = ref(false);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SSwitchGroup class="max-w-sm gap-3">
      <SSwitch v-model="notifications">
        <SSwitch-content>
          <SSwitch-control>
            <SSwitch-thumb />
          </SSwitch-control>
          Notifications
        </SSwitch-content>
      </SSwitch>
      <SSwitch v-model="analytics" is-disabled>
        <SSwitch-content>
          <SSwitch-control>
            <SSwitch-thumb />
          </SSwitch-control>
          Analytics (managed)
        </SSwitch-content>
      </SSwitch>
    </SSwitchGroup>
  </div>
</template>
