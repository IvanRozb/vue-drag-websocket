<script setup lang="ts">
import { reactive, ref } from 'vue'
import { maxZIndex } from '@/composables/maxZIndex'

const props = defineProps<{
  id: number
  x: number
  y: number
  width: number
  height: number
  color: string
}>()

const config = reactive({ ...props })

const isDragging = ref(false)
const zIndex = ref(0)

const handleDragStart = () => {
  isDragging.value = true
  zIndex.value = maxZIndex.value + 1
  maxZIndex.value++
}

const handleDragEnd = () => {
  isDragging.value = false
}

const handleTransformEnd = (e: {
  target: { x: Function; y: Function; rotation: Function; scaleX: Function; scaleY: Function }
}) => {
  config.x = e.target.x()
  config.y = e.target.y()
}
</script>

<template>
  <v-group :config="{ zIndex,
        draggable: true, }">
    <v-rect
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      :config="{
        ...config,
        name: id.toString(),
        fill: color,
      }"
      @transform="handleTransformEnd"
    >
    </v-rect>
    <v-text :config="{
      text: id.toString(),
      x: config.x + 10,
      y: config.y + 10,
      fontSize: 30,
    }"
    />
  </v-group>
</template>
