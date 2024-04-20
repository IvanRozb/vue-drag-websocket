<script setup lang="ts">
defineProps<{
  startWebSocket: (e: MouseEvent) => void
  stopWebSocket: (e: MouseEvent) => void
  reset: (e: MouseEvent) => void
  isWebSocketOpen: boolean
}>()
</script>

<template>
  <div class="buttons">
    <button class="button button-start" @click="startWebSocket" :disabled="isWebSocketOpen">
      Start
    </button>
    <button class="button button-stop" @click="stopWebSocket" :disabled="!isWebSocketOpen">
      Stop
    </button>
    <button class="button button-reset" @click="reset">Reset</button>
  </div>
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  justify-content: space-between;

  margin-bottom: 32px;

  .button {
    all: unset;

    padding: 12px 20px;
    border-radius: 8px;

    color: white;
    cursor: pointer;

    &[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

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
