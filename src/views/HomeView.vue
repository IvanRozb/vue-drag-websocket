<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import Konva from 'konva'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/localStorage'

const width = window.innerWidth
const height = window.innerHeight

const stageConfig = {
  width: width,
  height: height
}

const defaultProps = {
  width: 300,
  height: 100,
  x: 10,
  y: 10
}

const generateItems = () =>
  Array.from({ length: 5 }).map((_, index) => ({
    ...defaultProps,
    id: 'node-' + index,
    text: index + 1,
    fill: Konva.Util.getRandomColor()
  }))

const localItems = getLocalStorageItem('items')
const items = reactive(localItems ?? generateItems())

const selectId = ref('-1')
const transformer = ref<any | null>(null)

const updateTransformer = () => {
  if (!transformer.value) return
  const transformerNode = transformer.value.getNode()
  const stage = transformerNode.getStage()
  if (!stage) return

  const selectedNode = stage.findOne('#' + selectId.value)
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

const getTargetParent = (targetNode: any, targetClass: string) => {
  let target = targetNode
  while (target.className && target.className !== targetClass) {
    target = target.getParent()
  }
  return target
}

const blockToTheTop = (target: any) => {
  const dragItemId = target.id()

  const item = items.find((i) => i.id === dragItemId)
  if (!item) return

  const index = items.indexOf(item)
  items.splice(index, 1)
  items.push(item)
}

const handleStageMouseDown = (e: any) => {
  if (e.target === e.target.getStage()) {
    selectId.value = '-1'
    updateTransformer()
    return
  }

  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) return

  const target = getTargetParent(e.target, 'Group')
  const id = target.id()
  const rect = items.find((r) => r.id === id)

  selectId.value = rect ? id : -1

  blockToTheTop(target)
  updateTransformer()
}

const setCursor = (e: any, cursor: string) => {
  const styles = e.target.getStage().container().style
  styles.cursor = cursor
}

const handleDragStart = (e: any) => {
  setCursor(e, 'grab')
  blockToTheTop(getTargetParent(e.target, 'Group'))
}

const handleDragEnd = (e: any) => {
  const target = getTargetParent(e.target, 'Group')
  const draggedItemId = target.attrs.id

  const draggedItemIndex = items.findIndex((r) => r.id === draggedItemId)

  if (draggedItemIndex !== -1) {
    items[draggedItemIndex].x = target.attrs.x
    items[draggedItemIndex].y = target.attrs.y
  }
}

const handleDrag = (e: any) => {
  const target = e.target

  const calculateNextStepValue = (value: number) => {
    const step = 50
    return Math.round(value / step) * step
  }

  const [newX, newY] = [target.x(), target.y()].map(calculateNextStepValue)

  target.x(newX)
  target.y(newY)
}

const handleMouseEnter = (e: any) => {
  setCursor(e, 'pointer')
}

const handleMouseLeave = (e: any) => {
  setCursor(e, 'default')
}

const handleTransformEnd = (e: any) => {
  const target = e.target
  const targetId = target.id()

  const textNode = target.findOne(`#${targetId}-text`)
  if (!textNode) return

  const absScale = textNode.getAbsoluteScale()
  textNode.scaleX(textNode.scaleX() / absScale.x)
  textNode.scaleY(textNode.scaleY() / absScale.y)
}

watch(items, () => {
  console.log(1)
  setLocalStorageItem('items', items)
})
</script>

<template>
  <v-stage
    :config="stageConfig"
    @mousedown="handleStageMouseDown"
    @touchstart="handleStageMouseDown"
  >
    <v-layer>
      <v-group
        :key="block.id"
        v-for="block in items"
        :config="{ draggable: true, id: block.id, x: block.x, y: block.y }"
        @dragmove="handleDrag"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @transform="handleTransformEnd"
      >
        <v-rect
          :config="{
            ...block,
            x: undefined,
            y: undefined,
            id: `${block.id}-rect`
          }"
        >
        </v-rect>
        <v-text
          :config="{
            id: `${block.id}-text`,
            text: block.text,
            fontSize: 30,
            stroke: 'white',
            fill: 'white'
          }"
        />
      </v-group>
      <v-transformer ref="transformer" :config="{ rotateEnabled: false, flipEnabled: false }" />
    </v-layer>
  </v-stage>
</template>
