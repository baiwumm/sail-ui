<template>
  <div class="docs-demo docs-demo-stack">
    <div class="flex flex-col gap-1">
      <STypography-heading :level="1">Heading 1</STypography-heading>
      <STypography-heading :level="2">Heading 2</STypography-heading>
      <STypography-heading :level="3">Heading 3</STypography-heading>
    </div>
    <STypography-paragraph>
      Body text at the base size, with <STypography-code>inline code</STypography-code> support.
    </STypography-paragraph>
    <STypography-paragraph size="sm" color="muted">
      Small muted helper text.
    </STypography-paragraph>
  </div>
</template>
