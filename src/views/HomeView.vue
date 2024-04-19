<script lang="ts" setup>
import { ref, watch } from 'vue'
import Konva from 'konva'

const width = window.innerWidth
const height = window.innerHeight

const stageConfig = {
  width: width,
  height: height
}

const defaultProps = {
  width: 300,
  height: 100
}

const initialBlocks = ref(
  Array.from({ length: 5 }).map((_, index) => ({
    ...defaultProps,
    id: 'node-' + index,
    text: index + 1,
    fill: Konva.Util.getRandomColor()
  }))
)

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

const handleStageMouseDown = (e: any) => {
  if (e.target === e.target.getStage()) {
    selectId.value = '-1'
    updateTransformer()
    return
  }

  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) return

  const id = e.target.getParent().id()
  const rect = initialBlocks.value.find((r) => r.id === id)
  blockToTheTop(e.target)

  selectId.value = rect ? id : -1

  updateTransformer()
}

const setCursor = (e: any, cursor: string) => {
  const styles = e.target.getStage().container().style
  styles.cursor = cursor
}

const blockToTheTop = (target: any) => {
  const dragItemId = target.id()

  const updatedItems = initialBlocks.value
  const item = updatedItems.find((i) => i.id === dragItemId)
  if (!item) return

  const index = updatedItems.indexOf(item)
  updatedItems.splice(index, 1)
  updatedItems.push(item)
  initialBlocks.value = [...updatedItems]
}

const handleDragStart = (e: any) => {
  setCursor(e, 'grab')
  blockToTheTop(e.target)
}

const handleDragEnd = (e: any) => {
  // setCursor(e, 'default')
  // const group = e.target
  // const rect = group.findOne('.' + rectConfig.id)
  //
  // setLocalStorageItem(rectConfig.id.toString(), {
  //   rect: { ...rect.attrs, name: rectConfig.id.toString() },
  //   group: group.attrs
  // })
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
  const targetId = target.id();

  const textNode = target.findOne(`#${targetId}-text`)
  if (!textNode) return

  const absScale = textNode.getAbsoluteScale()
  textNode.scaleX(textNode.scaleX() / absScale.x)
  textNode.scaleY(textNode.scaleY() / absScale.y)
}
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
        v-for="block in initialBlocks"
        :config="{ draggable: true, id: block.id }"
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
            id: `${block.id}-rect`,
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
      <v-transformer
        ref="transformer"
        :config="{ rotateEnabled: false, flipEnabled: false }"
      />
    </v-layer>
  </v-stage>
</template>
