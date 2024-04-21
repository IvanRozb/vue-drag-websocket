<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { KonvaTransformer } from '@/types/konva'
import { useStore } from '@/store'
import { STAGE_DIMENSIONS, STEP } from '@/constants/workspace'
import type { IDimensions } from '@/interfaces/IDimensions'

interface IBox extends IDimensions {
  x: number
  y: number
}

const store = useStore()
const transformerRef = ref<KonvaTransformer | null>(null)

onMounted(() => {
  store.commit('workspaceStore/setTransformerRef', transformerRef.value)
})

const getTransformBox = (oldBoundBox: IBox, newBoundBox: IBox) => {
  if (Math.abs(newBoundBox.width) < STEP || Math.abs(newBoundBox.height) < STEP) {
    return oldBoundBox
  }

  let res = { ...newBoundBox }

  const fillBoxProp = (dimension: keyof IBox) => {
    const diffX = Math.abs(oldBoundBox[dimension] - newBoundBox[dimension])

    if (diffX < STEP) res[dimension] = oldBoundBox[dimension]
    else res[dimension] = newBoundBox[dimension]

    res[dimension] = Math.round(res[dimension] / STEP) * STEP
  }

  const boxProps: (keyof IBox)[] = ['width', 'height', 'x', 'y']
  boxProps.forEach(fillBoxProp)

  const isOut =
    res.x < 0 ||
    res.y < 0 ||
    res.x + res.width > STAGE_DIMENSIONS.width ||
    res.y + res.height > STAGE_DIMENSIONS.height

  if (isOut) {
    res = oldBoundBox
  }

  return res
}

const handleBoundBox = (oldBox: IBox, newBox: IBox) => {
  if (!transformerRef.value) return

  return getTransformBox(oldBox, newBox)
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
