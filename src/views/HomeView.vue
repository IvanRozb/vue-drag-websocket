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
    id: 1,
    width: 300,
    height: 500
  },
  {
    width: 300,
    height: 500
  },
  {
    width: 300,
    height: 500
  },
  {
    width: 300,
    height: 500
  }
]
</script>

<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <grid-block
        :key="id"
        v-for="(block, id) in initialBlocks"
        :width="block.width"
        :height="block.height"
      />
    </v-layer>
  </v-stage>
</template>
