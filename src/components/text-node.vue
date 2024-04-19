<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { saveTextNodeScale } from '@/helpers/saveTextNodeScale'

defineProps<{
  id: string
  text: string
}>()

const textRef = ref<any | null>(null)

onMounted(() => {
  if (!textRef.value) return

  const node = textRef.value.getNode()
  saveTextNodeScale(node)
})
</script>

<template>
  <v-text
    ref="textRef"
    :config="{
      id: `${id}-text`,
      text,
      fontSize: 30,
      stroke: 'white',
      fill: 'white',
      scaleX: 1,
      scaleY: 1
    }"
  />
</template>
