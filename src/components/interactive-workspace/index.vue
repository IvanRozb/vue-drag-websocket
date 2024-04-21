<script setup lang="ts">
import InteractiveWorkspaceInfoRestore from '@/components/interactive-workspace/restore.vue'
import InteractiveWorkspaceInfoAgenda from '@/components/interactive-workspace/agenda.vue'
import { useWorkspaceStore } from '@/store/workspace'
import StageNode from '@/components/interactive-workspace/stage-node/index.vue'

const workspaceStore = useWorkspaceStore()
</script>

<template>
  <div class="interactive-workspace" :style="{ '--step': `${workspaceStore.state.step}px` }">
    <interactive-workspace-info-restore class="info" />
    <stage-node />
    <interactive-workspace-info-agenda class="info" />
  </div>
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
