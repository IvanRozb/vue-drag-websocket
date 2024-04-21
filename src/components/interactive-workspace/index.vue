<script setup lang="ts">
import InfoRestore from '@/components/interactive-workspace/restore.vue'
import InfoAgenda from '@/components/interactive-workspace/agenda.vue'
import { useStore } from '@/store'
import StageNode from '@/components/interactive-workspace/stage-node/index.vue'

const store = useStore()
</script>

<template>
  <div class="interactive-workspace" :style="{ '--step': `${store.state.workspaceStore.step}px` }">
    <info-restore class="info" />
    <stage-node />
    <info-agenda class="info" />
  </div>
  1
</template>

<style scoped lang="scss">
.interactive-workspace {
  background-image: repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
    repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
  background-size: var(--step) var(--step);

  .info {
    position: absolute;
    z-index: 10;

    background-color: white;
    border: 1px solid black;
  }
}
</style>
