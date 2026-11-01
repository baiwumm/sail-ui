<script setup lang="ts">
import {ref} from "vue";

const alertOpen = ref(false);
const drawerOpen = ref(false);
const sheetOpen = ref(false);
const popoverOpen = ref(false);
const tooltipOpen = ref(false);
</script>

<template>
  <div class="docs-demo">
    <SButton variant="danger" @press="alertOpen = true">Alert dialog</SButton>
    <SAlertDialog v-model:open="alertOpen">
      <SAlertDialog-backdrop>
        <SAlertDialog-container>
          <SAlertDialog-dialog>
            <SAlertDialog-icon status="danger" />
            <SAlertDialog-heading>Delete file</SAlertDialog-heading>
            <SAlertDialog-body>
              This permanently deletes the file. It cannot be undone.
            </SAlertDialog-body>
            <SAlertDialog-footer>
              <SButton variant="secondary" @press="alertOpen = false">Cancel</SButton>
              <SAlertDialog-close-trigger>
                <SButton variant="danger">Delete</SButton>
              </SAlertDialog-close-trigger>
            </SAlertDialog-footer>
          </SAlertDialog-dialog>
        </SAlertDialog-container>
      </SAlertDialog-backdrop>
    </SAlertDialog>

    <SButton variant="secondary" @press="drawerOpen = true">Drawer</SButton>
    <SDrawer v-model:open="drawerOpen">
      <SDrawer-backdrop>
        <SDrawer-content placement="bottom">
          <SDrawer-dialog>
            <SDrawer-handle />
            <SDrawer-header>
              <SDrawer-heading>Quick settings</SDrawer-heading>
            </SDrawer-header>
            <SDrawer-body>
              <p class="text-sm">Bottom drawers slide from the edge with drag-to-dismiss.</p>
            </SDrawer-body>
            <SDrawer-footer>
              <SButton variant="primary" @press="drawerOpen = false">Done</SButton>
            </SDrawer-footer>
          </SDrawer-dialog>
        </SDrawer-content>
      </SDrawer-backdrop>
    </SDrawer>

    <SButton variant="secondary" @press="sheetOpen = true">Sheet</SButton>
    <SSheet v-model:open="sheetOpen" placement="bottom">
      <SSheet-backdrop>
        <SSheet-content>
          <SSheet-dialog>
            <SSheet-handle />
            <SSheet-header>
              <SSheet-heading>Sheet title</SSheet-heading>
            </SSheet-header>
            <SSheet-body>
              <p class="text-sm">Spring-animated mobile surface with drag dismissal.</p>
            </SSheet-body>
          </SSheet-dialog>
        </SSheet-content>
      </SSheet-backdrop>
    </SSheet>

    <SPopover v-model:open="popoverOpen">
      <SPopover-trigger>
        <SButton variant="secondary">Popover</SButton>
      </SPopover-trigger>
      <SPopover-content>
        <SPopover-arrow />
        <SPopover-dialog class="w-64">
          <SPopover-heading>Popover title</SPopover-heading>
          <p class="text-sm">Anchored content with an arrow and Escape dismissal.</p>
        </SPopover-dialog>
      </SPopover-content>
    </SPopover>

    <STooltip v-model:open="tooltipOpen">
      <STooltip-trigger>
        <SButton is-icon-only variant="secondary" aria-label="Settings">⚙</SButton>
      </STooltip-trigger>
      <STooltip-content show-arrow>
        <STooltip-arrow />
        Tooltip content
      </STooltip-content>
    </STooltip>
  </div>
</template>
