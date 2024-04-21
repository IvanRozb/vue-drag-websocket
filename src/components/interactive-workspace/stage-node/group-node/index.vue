<script setup lang="ts">
import TextNode from '@/components/interactive-workspace/stage-node/group-node/text-node.vue'
import type { IBlock } from '@/components/interactive-workspace/interfaces/IBlock'
import type { KonvaDragEvent, KonvaTransformEvent } from '@/types/konva'
import { saveTextNodeScale } from '@/components/interactive-workspace/interfaces/saveTextNodeScale'
import { useStore } from '@/store'
import RectNode from '@/components/interactive-workspace/stage-node/group-node/rect-node.vue'
import { STAGE_DIMENSIONS, STEP } from '@/constants/workspace'

defineProps<{
  block: IBlock
}>()

const store = useStore()

const handleDragStart = (e: KonvaDragEvent) => {
  store.dispatch('workspaceStore/updateCursor', 'grab')

  const group = e.target
  store.dispatch('workspaceStore/moveItemToFirstIndex', group.id())
}

const handleDragEnd = (e: KonvaDragEvent) => {
  const target = e.target
  const draggedItemId = target.id()

  store.dispatch('workspaceStore/updateItemById', {
    id: draggedItemId,
    newItem: {
      x: target.x(),
      y: target.y()
    }
  })
}

const handleDrag = (e: KonvaDragEvent) => {
  const target = e.target

  const calculateNextStepValue = (value: number) => {
    return Math.round(value / STEP) * STEP
  }

  const [newX, newY] = [target.x(), target.y()].map(calculateNextStepValue)

  const {
    attrs: { width, height }
  } = target.findOne('#' + target.id() + '-rect')
  const { x, y } = target.getAbsoluteScale()

  target.x(Math.min(Math.max(newX, 0), STAGE_DIMENSIONS.width - width * x))
  target.y(Math.min(Math.max(newY, 0), STAGE_DIMENSIONS.height - height * y))
}

const handleMouseEnter = () => store.dispatch('workspaceStore/updateCursor', 'pointer')
const handleMouseLeave = () => store.dispatch('workspaceStore/updateCursor', 'default')

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

  store.dispatch('workspaceStore/updateItemById', {
    id: draggedItemId,
    newItem: {
      x: target.x(),
      y: target.y(),
      scaleX: target.scaleX(),
      scaleY: target.scaleY()
    }
  })
}

const handleDoubleClick = (groupId: string) => {
  store.dispatch('workspaceStore/removeItemById', groupId)
  store.dispatch('workspaceStore/updateTransformNodes', '-1')
  store.dispatch('workspaceStore/updateCursor', 'default')
}
</script>

<template>
  <v-group
    @dblclick="handleDoubleClick(block.id)"
    @dragmove="handleDrag"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @transform="handleTransform"
    @transformend="handleTransformEnd"
    :config="{
      draggable: true,
      id: block.id,
      x: block.x,
      y: block.y,
      scaleX: block.scaleX,
      scaleY: block.scaleY
    }"
  >
    <rect-node :block="block" />
    <text-node :id="block.id" :text="block.text" />
  </v-group>
</template>
