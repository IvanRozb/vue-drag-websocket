<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { KonvaMouseDownEvent, KonvaNode, KonvaStage } from '@/types/konva'
import GroupNode from '@/components/interactive-workspace/stage-node/group-node/index.vue'
import TransformerNode from '@/components/interactive-workspace/stage-node/transformer-node.vue'
import { useStore } from '@/store'

const store = useStore()

const stageRef = ref<KonvaStage | null>(null)

onMounted(() => {
  store.commit('workspaceStore/setStageRef', stageRef.value)
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
    store.dispatch('workspaceStore/updateTransformNodes', '-1')
    return
  }

  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) return

  const target = getTargetGroup(e.target)
  const id = target.id()

  store.dispatch('workspaceStore/moveItemToFirstIndex', id)

  const rect = store.state.workspaceStore.items.find((r) => r.id === id)
  store.dispatch('workspaceStore/updateTransformNodes', rect ? id : '-1')
}
</script>

<template>
  <v-stage
    ref="stageRef"
    :config="{ ...store.state.workspaceStore.stageDimensions }"
    @mousedown="handleStageMouseDown"
    @touchstart="handleStageMouseDown"
  >
    <v-layer>
      <group-node
        :block="block"
        :key="block.id"
        v-for="block in store.state.workspaceStore.items"
      />
      <transformer-node />
    </v-layer>
  </v-stage>
</template>
