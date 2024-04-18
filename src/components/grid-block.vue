<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  width: number
  height: number
}>()
const isDragging = ref(false)

const handleDragStart = () => {
  isDragging.value = true
}
const handleDragEnd = () => {
  isDragging.value = false
}
</script>

<template>
  <v-rect
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    :config="{
      width,
      height,
      draggable: true,
      fill: isDragging ? 'green' : 'black'
    }"
  />
</template>
