<script lang="ts" setup>
import { reactive, ref } from 'vue'

const width = window.innerWidth
const height = window.innerHeight

const stageSize = reactive({
  width: width,
  height: height
})
const isDragging = ref(false)

const handleDragStart = () => {
  isDragging.value = true
}
const handleDragEnd = () => {
  isDragging.value = false
}
</script>

<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <v-rect
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        :config="{
          width: 300,
          height: 500,
          draggable: true,
          fill: isDragging ? 'green' : 'black'
        }"
      />
    </v-layer>
  </v-stage>
</template>
