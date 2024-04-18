<script setup lang="ts">
import { reactive, ref } from 'vue'
import { maxZIndex } from '@/composables/maxZIndex'

const props = defineProps<{
  id: number
  x: number
  y: number
  width: number
  height: number
  fill: string
}>()

const config = reactive({ ...props })

const zIndex = ref(0)

const setCursor = (e: any, cursor: string) => {
  const styles = e.target.getStage().container().style
  styles.cursor = cursor
}

const handleDragStart = (e: any) => {
  zIndex.value = maxZIndex.value + 1
  maxZIndex.value++

  setCursor(e, 'grab')
}

const handleDragEnd = (e: any) => {
  setCursor(e, 'default')
}

const handleMouseEnter = (e: any) => {
  setCursor(e, 'pointer')
}

const handleMouseLeave = (e: any) => {
  setCursor(e, 'default')
}

const handleTransformEnd = (e: {
  target: { x: Function; y: Function; rotation: Function; scaleX: Function; scaleY: Function }
}) => {
  config.x = e.target.x()
  config.y = e.target.y()
}
</script>

<template>
  <v-group
    :config="{ zIndex, draggable: true, cursor: 'pointer' }"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <v-rect
      :config="{
        ...config,
        name: id.toString(),
        strokeWidth: 1,
        stroke: 'black'
      }"
      @transform="handleTransformEnd"
    >
    </v-rect>
    <v-text
      :config="{
        text: id.toString(),
        x: config.x + 10,
        y: config.y + 10,
        fontSize: 30,
        stroke: 'white',
        fill: 'white'
      }"
    />
  </v-group>
</template>
