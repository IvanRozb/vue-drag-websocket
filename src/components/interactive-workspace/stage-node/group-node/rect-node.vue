<script setup lang="ts">
import type { IBlock } from '@/interfaces/IBlock'

defineProps<{
  block: IBlock
}>()
</script>

<template>
  <v-rect
    :config="{
      ...block,
      x: undefined,
      y: undefined,
      scaleX: undefined,
      scaleY: undefined,
      id: `${block.id}-rect`
    }"
  />
</template>
