<script setup lang="ts">
import UiButton from '@/components/ui/button.vue'

defineProps<{
  startWebSocket: (e: MouseEvent) => void
  stopWebSocket: (e: MouseEvent) => void
  reset: (e: MouseEvent) => void
  isWebSocketOpen: boolean
}>()
</script>

<template>
  <div class="buttons">
    <ui-button class="button-start" @click="startWebSocket" :disabled="isWebSocketOpen">
      Start
    </ui-button>
    <ui-button class="button-stop" @click="stopWebSocket" :disabled="!isWebSocketOpen">
      Stop
    </ui-button>
    <ui-button class="button-reset" @click="reset">Reset</ui-button>
  </div>
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  justify-content: space-between;

  margin-bottom: 32px;

  .button-start {
    background-color: green;
  }

  .button-stop {
    background-color: red;
  }

  .button-reset {
    background-color: orange;
  }
}
</style>
