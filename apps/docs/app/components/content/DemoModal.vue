<script setup lang="ts">
const open = ref(false);
</script>

<template>
  <div class="docs-demo">
    <SButton variant="primary" @press="open = true">Open modal</SButton>

    <SModal v-model:open="open">
      <SModalBackdrop>
        <SModalContainer>
          <SModalDialog>
            <SModalHeading>Confirm deletion</SModalHeading>
            <SModalBody>This permanently removes the item. There is no undo.</SModalBody>
            <SModalFooter>
              <SButton variant="secondary" @press="open = false">Cancel</SButton>
              <SButton variant="danger" @press="open = false">Delete</SButton>
            </SModalFooter>
          </SModalDialog>
        </SModalContainer>
      </SModalBackdrop>
    </SModal>
  </div>
</template>
