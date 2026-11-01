<template>
  <div class="docs-demo docs-demo-stack">
    <SAlert status="accent">
      <SAlertIndicator />
      <SAlertContent>
        <SAlertTitle>New version available</SAlertTitle>
        <SAlertDescription>Sail UI 0.x can be updated from the CLI.</SAlertDescription>
      </SAlertContent>
    </SAlert>
    <SAlert status="success">
      <SAlertIndicator />
      <SAlertContent>
        <SAlertTitle>Saved</SAlertTitle>
        <SAlertDescription>Your changes were stored.</SAlertDescription>
      </SAlertContent>
    </SAlert>
    <SAlert status="danger">
      <SAlertIndicator />
      <SAlertContent>
        <SAlertTitle>Deletion failed</SAlertTitle>
        <SAlertDescription>The item is referenced by other records.</SAlertDescription>
      </SAlertContent>
      <SCloseButton aria-label="Dismiss" size="sm" />
    </SAlert>
  </div>
</template>
