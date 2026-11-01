<template>
  <div class="docs-demo docs-demo-stack">
    <STextField class="max-w-sm" full-width>
      <SLabel>Name</SLabel>
      <SInput placeholder="Your name" />
      <SDescription>We never share it.</SDescription>
    </STextField>

    <STextField class="max-w-sm" full-width is-invalid>
      <SLabel is-invalid>Username</SLabel>
      <SInput value="taken" />
      <SErrorMessage>That username is already claimed.</SErrorMessage>
    </STextField>

    <STextField class="max-w-sm" full-width is-invalid>
      <SLabel is-invalid>Email</SLabel>
      <SInput value="nope" />
      <SFieldError>Enter a valid email address.</SFieldError>
    </STextField>
  </div>
</template>
