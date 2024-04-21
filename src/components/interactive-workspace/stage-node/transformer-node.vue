<script setup lang="ts">
import type { IBox, IDimensions } from '@/components/interactive-workspace/interfaces/IBox'
import { onMounted, ref } from 'vue'
import type { KonvaTransformer } from '@/types/konva'
import { useWorkspaceStore } from '@/store/workspace'

const workspaceStore = useWorkspaceStore()
const transformerRef = ref<KonvaTransformer | null>(null)

onMounted(() => {
  workspaceStore.dispatch('updateTransformerRef', transformerRef.value)
})

const getTransformBox = (
  oldBoundBox: IBox,
  newBoundBox: IBox,
  step: number,
  stageBox: IDimensions
) => {
  if (Math.abs(newBoundBox.width) < step || Math.abs(newBoundBox.height) < step) {
    return oldBoundBox
  }

  let res = { ...newBoundBox }

  const fillBoxProp = (dimension: keyof IBox) => {
    const diffX = Math.abs(oldBoundBox[dimension] - newBoundBox[dimension])

    if (diffX < step) res[dimension] = oldBoundBox[dimension]
    else res[dimension] = newBoundBox[dimension]

    res[dimension] = Math.round(res[dimension] / step) * step
  }

  const boxProps: (keyof IBox)[] = ['width', 'height', 'x', 'y']
  boxProps.forEach(fillBoxProp)

  const isOut =
    res.x < 0 ||
    res.y < 0 ||
    res.x + res.width > stageBox.width ||
    res.y + res.height > stageBox.height

  if (isOut) {
    res = oldBoundBox
  }

  return res
}

const handleBoundBox = (oldBox: IBox, newBox: IBox) => {
  if (!transformerRef.value) return

  return getTransformBox(
    oldBox,
    newBox,
    workspaceStore.state.step,
    workspaceStore.state.stageDimensions
  )
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
