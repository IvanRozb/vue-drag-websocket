<script setup lang="ts">
import { ref } from 'vue'
import { maxZIndex } from '@/composables/maxZIndex'

defineProps<{
  width: number
  height: number
  color: string
}>()
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
</script>

<template>
  <v-layer ref="layer" :config="{ zIndex }">
    <v-rect
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      :config="{
        width,
        height,
        draggable: true,
        fill: color
      }"
    />
  </v-layer>
</template>
