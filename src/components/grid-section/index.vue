<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import GridSectionInfoRestore from '@/components/grid-section/restore.vue'
import GridSectionInfoAgenda from '@/components/grid-section/agenda.vue'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/localStorage'
import TextNode from '@/components/grid-section/text-node.vue'
import type { IBlock } from '@/components/grid-section/interfaces/IBlock'
import { generateItems } from '@/components/grid-section/helpers/generateItems'
import type {
  KonvaDragEvent,
  KonvaMouseDownEvent,
  KonvaNode,
  KonvaStage,
  KonvaTransformer,
  KonvaTransformEvent
} from '@/types/konva'
import { getTargetGroup } from '@/components/grid-section/helpers/getTargetGroup'
import { getTransformBox } from '@/components/grid-section/helpers/getTransformBox'
import type { IBox } from '@/components/grid-section/interfaces/IBox'
import { saveTextNodeScale } from '@/components/grid-section/interfaces/saveTextNodeScale'

const stageConfig = {
  width: window.innerWidth,
  height: window.innerHeight
}

const step = 50

const defaultItem = {
  width: 300,
  height: 100,
  x: step,
  y: step,
  scaleX: 1,
  scaleY: 1
}

// State
const localItems = getLocalStorageItem<IBlock[]>('items')
const items = reactive<IBlock[]>(localItems ?? generateItems(defaultItem, step))

const selectId = ref('-1')

const localLastDeletedItem = getLocalStorageItem<{
  item: IBlock
  index: number
}>('last-deleted-item')
const lastDeletedItem = ref<{
  item: IBlock
  index: number
} | null>(localLastDeletedItem)

const transformerRef = ref<KonvaTransformer | null>(null)
const stageRef = ref<KonvaStage | null>(null)

// Watchers
watch(items, () => setLocalStorageItem('items', items))
watch(lastDeletedItem, () => setLocalStorageItem('last-deleted-item', lastDeletedItem.value))

// Helpers
const updateTransformer = () => {
  if (!transformerRef.value) return
  const transformerNode = transformerRef.value.getNode()
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

const blockToTheTop = (target: KonvaNode) => {
  const dragItemId = target.id()

  const item = items.find((i) => i.id === dragItemId.toString())
  if (!item) return

  const index = items.indexOf(item)
  items.splice(index, 1)
  items.push(item)
}

const setCursor = (cursor: string) => {
  if (!stageRef.value) return

  const styles = stageRef.value.getNode().container().style
  styles.cursor = cursor
}

// Handlers
const handleStageMouseDown = (e: KonvaMouseDownEvent) => {
  if (e.target === e.target.getStage()) {
    selectId.value = '-1'
    updateTransformer()
    return
  }

  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) return

  const target = getTargetGroup(e.target)
  const id = target.id()
  const rect = items.find((r) => r.id === id.toString())

  selectId.value = rect ? id.toString() : '-1'

  blockToTheTop(target)
  updateTransformer()
}

const handleDragStart = (e: KonvaDragEvent) => {
  setCursor('grab')

  const group = getTargetGroup(e.target)
  blockToTheTop(group)
}

const handleDragEnd = (e: KonvaDragEvent) => {
  const target = getTargetGroup(e.target)
  const draggedItemId = target.id()

  const draggedItemIndex = items.findIndex((r) => r.id === draggedItemId.toString())
  if (draggedItemIndex === -1) return

  items[draggedItemIndex].x = target.x()
  items[draggedItemIndex].y = target.y()
}

const handleDrag = (e: KonvaDragEvent) => {
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

const handleMouseEnter = () => setCursor('pointer')
const handleMouseLeave = () => setCursor('default')

const handleTransform = (e: KonvaTransformEvent) => {
  const target = e.target
  const targetId = target.id()

  const textNode = target.findOne(`#${targetId}-text`)
  if (!textNode) return

  saveTextNodeScale(textNode)
}

const handleTransformEnd = (e: KonvaTransformEvent) => {
  const target = e.target
  const draggedItemId = target.id()

  const draggedItemIndex = items.findIndex((r) => r.id === draggedItemId.toString())
  if (draggedItemIndex === -1) return

  items[draggedItemIndex].scaleX = target.scaleX()
  items[draggedItemIndex].scaleY = target.scaleY()
  items[draggedItemIndex].x = target.x()
  items[draggedItemIndex].y = target.y()
}

const removeItem = (groupId: string) => {
  const index = items.findIndex((item) => item.id === groupId)
  if (index === -1) return

  const [deletedItem] = items.splice(index, 1)
  lastDeletedItem.value = { item: deletedItem, index }

  setCursor('default')

  if (!transformerRef.value) return

  const transformerNode = transformerRef.value.getNode()
  transformerNode.nodes([])
}

const restoreLastDeletedItem = () => {
  if (!lastDeletedItem.value) return

  const itemToInsert = {
    ...lastDeletedItem.value.item,
    ...defaultItem,
    fill: lastDeletedItem.value.item.fill,
    x: (stageConfig.width - defaultItem.width) / 2,
    y: (stageConfig.height - defaultItem.height) / 2
  }
  items.splice(lastDeletedItem.value.index, 0, itemToInsert)

  lastDeletedItem.value = null
}

const handleBoundBox = (oldBox: IBox, newBox: IBox) => {
  getTransformBox(oldBox, newBox, step, stageConfig)
}
</script>

<template>
  <div class="grid" :style="{ '--step': `${step}px` }">
    <grid-section-info-restore v-if="lastDeletedItem" @click="restoreLastDeletedItem" class="info" />
    <v-stage
      ref="stageRef"
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
          @dblclick="removeItem(block.id)"
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
          <text-node :id="block.id" :text="block.text" />
        </v-group>
        <v-transformer
          ref="transformerRef"
          :config="{
            rotateEnabled: false,
            flipEnabled: false,
            boundBoxFunc: handleBoundBox
          }"
        />
      </v-layer>
    </v-stage>
    <grid-section-info-agenda class="info" />
  </div>
</template>

<style scoped lang="scss">
.grid {
  background-image: repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
    repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
  background-size: var(--step) var(--step);

  .info {
    position: absolute;
    top: 0;
    z-index: 10;

    background-color: white;
    border: 1px solid black;
  }
}
</style>
