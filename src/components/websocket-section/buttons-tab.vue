<script setup lang="ts">
import UiButton from '@/components/ui/button.vue'
import { useStore } from '@/store'

const store = useStore()

const handleStart = () => {
  store.dispatch('websocketStore/startWebSocket')
}

const handleStop = () => {
  store.dispatch('websocketStore/stopWebSocket')
}

const handleReset = () => {
  store.dispatch('websocketStore/reset')
}
</script>

<template>
  <div class="buttons">
    <ui-button
      class="button-start"
      @click="handleStart"
      :disabled="store.state.websocketStore.isWebSocketOpen"
    >
      Start
    </ui-button>
    <ui-button
      class="button-stop"
      @click="handleStop"
      :disabled="!store.state.websocketStore.isWebSocketOpen"
    >
      Stop
    </ui-button>
    <ui-button class="button-reset" @click="handleReset">Reset</ui-button>
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
