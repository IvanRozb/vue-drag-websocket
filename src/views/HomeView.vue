<script lang="ts" setup>
import { ref } from 'vue'
import GridBlock from '@/components/grid-block.vue'
import { maxZIndex } from '@/composables/maxZIndex'

const width = window.innerWidth
const height = window.innerHeight

const stageConfig = {
  width: width,
  height: height
}

const defaultProps = {
  width: 300,
  height: 100,
  x: 100,
  y: 100,
  rotation: 0,
  scaleX: 1,
  scaleY: 1
}

const generateRandomColor = () => {
  const generateRandomRGBValue = () => Math.floor(Math.random() * 256)

  const [r, g, b] = Array.from({ length: 3 }).map(() => generateRandomRGBValue())

  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
}

const initialBlocks = Array.from({ length: 5 }).map((_, index) => ({
  ...defaultProps,
  id: index + 1,
  fill: generateRandomColor()
}))

const selectId = ref(-1)
const transformer = ref<any | null>(null)

const updateTransformer = () => {
  if (!transformer.value) return

  // here we need to manually attach or detach Transformer node
  const transformerNode = transformer.value.getNode()
  const stage = transformerNode.getStage()

  const selectedNode = stage.findOne('.' + selectId.value.toString())
  // do nothing if selected node is already attached
  if (selectedNode === transformerNode.node()) {
    return
  }

  if (selectedNode) {
    // attach to another node
    transformerNode.nodes([selectedNode])
  } else {
    // remove transformer
    transformerNode.nodes([])
  }
}

const handleStageMouseDown = (e: any) => {
  if (e.target === e.target.getStage()) {
    selectId.value = -1
    updateTransformer()
    return
  }

  // clicked on transformer - do nothing
  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) {
    return
  }

  // find clicked rect by its id
  const id = e.target.id()
  const rect = initialBlocks.find((r) => r.id === id)

  if (rect) {
    e.target.getParent()?.setAttr('zIndex', maxZIndex.value)
  }

  selectId.value = rect ? id : -1

  updateTransformer()
}
</script>

<template>
  <v-stage
    :config="stageConfig"
    @mousedown="handleStageMouseDown"
    @touchstart="handleStageMouseDown"
  >
    <v-layer>
      <grid-block :key="id" v-for="(block, id) in initialBlocks" v-bind="block" />
      <v-transformer ref="transformer" :config="{ rotateEnabled: false, flipEnabled: false }" />
    </v-layer>
  </v-stage>
</template>
