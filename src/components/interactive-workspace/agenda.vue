<script setup lang="ts">
import { useStore } from '@/store'

const store = useStore()

const handleResetState = () => {
  store.commit('workspaceStore/resetState')
}
</script>

<template>
  <div class="agenda">
    <p>To delete an item, just double-click on it.</p>
    <p>To restore an item, click on the restore icon in bottom-left corner.</p>
    <p>
      In order to reset full state click <span class="reset" @click="handleResetState">here</span>.
    </p>
  </div>
</template>

<style scoped lang="scss">
.agenda {
  top: 0;
  right: 0;
  padding: 0 12px;

  width: 400px;

  font-size: 1.25rem;

  .reset {
    color: blue;
    cursor: pointer;
  }
}
</style>
