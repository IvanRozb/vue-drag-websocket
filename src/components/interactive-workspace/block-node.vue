<script setup lang="ts">
import TextNode from '@/components/interactive-workspace/text-node.vue'
import type { IBlock } from '@/components/interactive-workspace/interfaces/IBlock'

defineProps<{
  block: IBlock
}>()
</script>

<template>
  <v-group
    :config="{
      draggable: true,
      id: block.id,
      x: block.x,
      y: block.y,
      scaleX: block.scaleX,
      scaleY: block.scaleY
    }"
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
</template>
