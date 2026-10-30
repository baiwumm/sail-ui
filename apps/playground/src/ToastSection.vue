<script setup lang="ts">
import {Button} from "@sail-ui/vue/button";
import {useToast} from "@sail-ui/vue/toast";

const toast = useToast();

function showUpdate() {
  const id = toast("Uploading report", {timeout: 0});

  setTimeout(() => {
    toast.update(id, "Report uploaded", {variant: "success", timeout: 4000});
  }, 900);
}

function showPromise() {
  toast.promise(
    new Promise<string>((resolve) => {
      setTimeout(() => resolve("report.csv"), 1200);
    }),
    {
      error: "Upload failed",
      loading: "Uploading attachment",
      success: (file) => `Uploaded ${file}`,
    },
  );
}
</script>

<template>
  <section id="toast" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Toast</h2>
    <div class="flex flex-wrap items-center gap-3">
      <Button variant="secondary" @press="toast('Changes saved')"> Default </Button>
      <Button variant="secondary" @press="toast.success('Deployment complete')"> Success </Button>
      <Button variant="secondary" @press="toast.danger('Build failed')"> Danger </Button>
      <Button variant="secondary" @press="toast.info('New version available')"> Info </Button>
      <Button variant="secondary" @press="toast.warning('Usage at 90%')"> Warning </Button>
      <Button
        variant="secondary"
        @press="
          toast('Invitation sent', {
            actionProps: {children: 'Undo', variant: 'tertiary'},
            description: 'We emailed ada@example.com.',
          })
        "
      >
        With action
      </Button>
      <Button variant="secondary" @press="showUpdate"> Update in place </Button>
      <Button variant="secondary" @press="showPromise"> Promise </Button>
      <Button
        variant="secondary"
        @press="
          () => {
            for (let index = 0; index < 5; index += 1) toast(`Queued item ${index + 1}`);
          }
        "
      >
        Long queue
      </Button>
      <Button variant="outline" @press="toast.clear()"> Clear </Button>
    </div>
  </section>
</template>
