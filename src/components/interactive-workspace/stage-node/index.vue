<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { KonvaMouseDownEvent, KonvaNode, KonvaStage } from '@/types/konva'
import GroupNode from '@/components/interactive-workspace/stage-node/group-node/index.vue'
import TransformerNode from '@/components/interactive-workspace/stage-node/transformer-node.vue'
import { useWorkspaceStore } from '@/store/workspace'

const workspaceStore = useWorkspaceStore()

const stageRef = ref<KonvaStage | null>(null)

onMounted(() => {
  workspaceStore.dispatch('updateStageRef', stageRef.value)
})

const getTargetGroup = (targetNode: KonvaNode) => {
  let target = targetNode
  while (target.className && target.className !== 'Group') {
    target = target.getParent()
  }
  return target
}

const handleStageMouseDown = (e: KonvaMouseDownEvent) => {
  if (e.target === e.target.getStage()) {
    workspaceStore.dispatch('updateTransformNodes', '-1')
    return
  }

  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) return

  const target = getTargetGroup(e.target)
  const id = target.id()

  workspaceStore.dispatch('moveItemToFirstIndex', id)

  const rect = workspaceStore.state.items.find((r) => r.id === id)
  workspaceStore.dispatch('updateTransformNodes', rect ? id : '-1')
}
</script>

<template>
  <v-stage
    ref="stageRef"
    :config="{ ...workspaceStore.state.stageDimensions }"
    @mousedown="handleStageMouseDown"
    @touchstart="handleStageMouseDown"
  >
    <v-layer>
      <group-node :block="block" :key="block.id" v-for="block in workspaceStore.state.items" />
      <transformer-node />
    </v-layer>
  </v-stage>
</template>
