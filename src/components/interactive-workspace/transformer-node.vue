<script setup lang="ts">
import type { IBox, IDimensions } from '@/components/interactive-workspace/interfaces/IBox'
import { getTransformBox } from '@/components/interactive-workspace/helpers/getTransformBox'
import { onMounted, ref } from 'vue'
import type { KonvaTransformer } from '@/types/konva'
import { useWorkspaceStore } from '@/store/workspace'

const props = defineProps<{
  transformStep: number
}>()

const workspaceState = useWorkspaceStore()
const transformerRef = ref<KonvaTransformer | null>(null)

onMounted(() => {
  workspaceState.dispatch('updateTransformerRef', transformerRef.value)
})

const handleBoundBox = (oldBox: IBox, newBox: IBox) => {
  const stage = workspaceState.state.stageRef
  if (!transformerRef.value || !stage) return

  const stageNode = stage.getNode()
  const stageDimensions: IDimensions = {
    width: stageNode.attrs.width,
    height: stageNode.attrs.height
  }
  return getTransformBox(oldBox, newBox, props.transformStep, stageDimensions)
}
</script>

<template>
  <v-transformer
    ref="transformerRef"
    :config="{
      rotateEnabled: false,
      flipEnabled: false,
      boundBoxFunc: handleBoundBox
    }"
  />
</template>
