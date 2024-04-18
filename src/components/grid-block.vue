<script setup lang="ts">
import { ref } from 'vue'
import { maxZIndex } from '@/composables/maxZIndex'

defineProps<{
  id: number
  width: number
  height: number
  color: string
}>()

const emit = defineEmits<{
  (
    name: 'transformend',
    e: {
      target: { x: Function; y: Function; rotation: Function; scaleX: Function; scaleY: Function }
    }
  ): void
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
  <v-group :config="{ zIndex }">
    <v-rect
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      :config="{
        id,
        name: id.toString(),
        width,
        height,
        draggable: true,
        fill: color
      }"
      @transformend="(e: any) => emit('transformend', e)"
    />
  </v-group>
</template>
