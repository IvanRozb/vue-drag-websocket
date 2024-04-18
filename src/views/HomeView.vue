<script lang="ts" setup>
import { reactive } from 'vue'
import GridBlock from '@/components/grid-block.vue'

const width = window.innerWidth
const height = window.innerHeight

const stageSize = reactive({
  width: width,
  height: height
})

const initialBlocks = [
  {
    width: 300,
    height: 500,
    color: 'red'
  },
  {
    width: 300,
    height: 500,
    color: 'green'
  },
  {
    width: 300,
    height: 500,
    color: 'blue'
  },
  {
    width: 300,
    height: 500,
    color: 'yellow'
  }
]
</script>

<template>
  <v-stage ref="stage" :config="stageSize">
    <grid-block
      :key="id"
      v-for="(block, id) in initialBlocks"
      :width="block.width"
      :height="block.height"
      :color="block.color"
    />
  </v-stage>
</template>
