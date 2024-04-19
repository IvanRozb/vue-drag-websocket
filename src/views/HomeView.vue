<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import Konva from 'konva'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/localStorage'
import TextNode from '@/components/text-node.vue'
import { saveTextNodeScale } from '@/helpers/saveTextNodeScale'

const stageConfig = {
  width: window.innerWidth,
  height: window.innerHeight
}

const step = 50

const defaultProps = {
  width: 300,
  height: 100,
  x: step,
  y: step,
  scaleX: 1,
  scaleY: 1
}

const generateItems = () =>
  Array.from({ length: 5 }).map((_, index) => ({
    ...defaultProps,
    x: defaultProps.x + (index % 3) * (step + defaultProps.width) + step,
    y: defaultProps.y + (step + defaultProps.height) * Math.floor(index / 3) + step,
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
    return Math.round(value / step) * step
  }

  const [newX, newY] = [target.x(), target.y()].map(calculateNextStepValue)

  const {
    attrs: { width, height }
  } = target.findOne('#' + target.id() + '-rect')
  const { x, y } = target.getAbsoluteScale()

  target.x(Math.min(Math.max(newX, 0), stageConfig.width - width * x))
  target.y(Math.min(Math.max(newY, 0), stageConfig.height - height * y))
}

const handleMouseEnter = (e: any) => {
  setCursor(e, 'pointer')
}

const handleMouseLeave = (e: any) => {
  setCursor(e, 'default')
}

const handleTransform = (e: any) => {
  const target = e.target
  const targetId = target.id()

  const textNode = target.findOne(`#${targetId}-text`)
  if (!textNode) return

  saveTextNodeScale(textNode)
}

const handleTransformEnd = (e: any) => {
  const target = e.target
  const draggedItemId = target.id()

  const draggedItemIndex = items.findIndex((r) => r.id === draggedItemId)
  if (draggedItemIndex === -1) return

  items[draggedItemIndex].scaleX = target.attrs.scaleX
  items[draggedItemIndex].scaleY = target.attrs.scaleY
  items[draggedItemIndex].x = target.attrs.x
  items[draggedItemIndex].y = target.attrs.y
}

const boundTransformBoxFunc = (oldBoundBox: any, newBoundBox: any) => {
  if (Math.abs(newBoundBox.width) < step || Math.abs(newBoundBox.height) < step) {
    return oldBoundBox
  }

  let res = { ...newBoundBox }

  const fillDimension = (dimension: string) => {
    const diffX = Math.abs(oldBoundBox[dimension] - newBoundBox[dimension])

    if (diffX < step) res[dimension] = oldBoundBox[dimension]
    else res[dimension] = newBoundBox[dimension]
  }

  const dimensions = ['width', 'height', 'x', 'y']
  dimensions.forEach(fillDimension)

  const isOut =
    res.x < 0 ||
    res.y < 0 ||
    res.x + res.width > stageConfig.width ||
    res.y + res.height > stageConfig.height

  if (isOut) {
    res = oldBoundBox
  }

  return res
}

watch(items, () => {
  setLocalStorageItem('items', items)
})
</script>

<template>
  <div class="grid" :style="{ '--step': `${step}px` }">
    <v-stage
      :config="stageConfig"
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
    >
      <v-layer>
        <v-group
          :key="block.id"
          v-for="block in items"
          :config="{
            draggable: true,
            id: block.id,
            x: block.x,
            y: block.y,
            scaleX: block.scaleX,
            scaleY: block.scaleY
          }"
          @dragmove="handleDrag"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          @transform="handleTransform"
          @transformend="handleTransformEnd"
        >
          <v-rect
            :config="{
              ...block,
              x: undefined,
              y: undefined,
              scaleX: undefined,
              scaleY: undefined,
              id: `${block.id}-rect`
            }"
          >
          </v-rect>
          <TextNode :id="block.id" :text="block.text" />
        </v-group>
        <v-transformer
          ref="transformer"
          :config="{
            rotateEnabled: false,
            flipEnabled: false,
            // anchorDragBoundFunc: dragTransformBounce
            boundBoxFunc: boundTransformBoxFunc
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<style scoped lang="scss">
.grid {
  background-image: repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
    repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
  background-size: var(--step) var(--step);
}
</style>
