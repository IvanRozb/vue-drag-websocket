<script setup lang="ts">
import { useStore } from '@/store'

const store = useStore()

const restoreLastDeletedItem = () => {
  store.dispatch('workspaceStore/restoreDeletedItem')
  store.dispatch('workspaceStore/updateTransformNodes', '-1')
}
</script>

<template>
  <svg
    v-if="store.state.workspaceStore.lastDeletedItem"
    @click="restoreLastDeletedItem"
    class="restore"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
  >
    <path d="M0 0h48v48H0z" fill="none" />
    <g id="Shopicon">
      <path
        d="M10,22v2c0,7.72,6.28,14,14,14s14-6.28,14-14s-6.28-14-14-14h-6.662l3.474-4.298l-3.11-2.515L10.577,12l7.125,8.813   l3.11-2.515L17.338,14H24c5.514,0,10,4.486,10,10s-4.486,10-10,10s-10-4.486-10-10v-2H10z"
      />
    </g>
  </svg>
</template>

<style scoped lang="scss">
.restore {
  bottom: 0;
  left: 0;

  width: calc(var(--step) * 1);
  height: calc(var(--step) * 1);

  cursor: pointer;

  &:hover {
    stroke: green;
    fill: green;
  }
}
</style>
