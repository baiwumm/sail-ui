<script setup lang="ts">
// Theme (dark / data-theme) lives on <html>; this toggle persists the choice
// and follows the system preference for "system".
type Theme = "light" | "dark" | "system";

const theme = ref<Theme>("system");

const applyTheme = (next: Theme) => {
  if (!import.meta.client) {
    return;
  }

  const resolved =
    next === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : next;

  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = resolved;
};

watch(theme, (next) => {
  applyTheme(next);

  if (import.meta.client) {
    localStorage.setItem("sail-ui-theme", next);
  }
});

onMounted(() => {
  theme.value = (localStorage.getItem("sail-ui-theme") as Theme | null) ?? "system";
  applyTheme(theme.value);
});
</script>

<template>
  <SButtonGroup aria-label="Color scheme">
    <SButton
      v-for="option in ['light', 'dark', 'system'] as const"
      :key="option"
      :data-testid="`theme-${option}`"
      :variant="theme === option ? 'primary' : 'secondary'"
      size="sm"
      @click="theme = option"
    >
      {{ option }}
    </SButton>
  </SButtonGroup>
</template>
