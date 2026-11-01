<template>
  <div class="docs-demo docs-demo-stack">
    <SAvatarGroup :max="3" size="md">
      <SAvatar><SAvatarFallback>AL</SAvatarFallback></SAvatar>
      <SAvatar><SAvatarFallback>GH</SAvatarFallback></SAvatar>
      <SAvatar><SAvatarFallback>JB</SAvatarFallback></SAvatar>
      <SAvatar><SAvatarFallback>KV</SAvatarFallback></SAvatar>
    </SAvatarGroup>
    <SAvatarGroup is-grid size="sm">
      <SAvatar><SAvatarFallback>A</SAvatarFallback></SAvatar>
      <SAvatar><SAvatarFallback>B</SAvatarFallback></SAvatar>
      <SAvatar><SAvatarFallback>C</SAvatarFallback></SAvatar>
      <SAvatar><SAvatarFallback>D</SAvatarFallback></SAvatar>
    </SAvatarGroup>
  </div>
</template>
