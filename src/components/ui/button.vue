<template>
  <button class="button"><slot /></button>
</template>

<style scoped lang="scss">
.button {
  all: unset;

  padding: 12px 20px;
  border-radius: 8px;

  color: white;
  cursor: pointer;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
