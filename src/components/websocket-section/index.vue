<script setup lang="ts">
import ButtonsTab from '@/components/websocket-section/buttons-tab.vue'
import TransactionsTable from '@/components/websocket-section/transactions-table.vue'
import UiLoader from '@/components/ui/loader.vue'
import { useStore } from '@/store'

const store = useStore()
</script>

<template>
  <div class="container">
    <buttons-tab />
    <transactions-table />
    <ui-loader v-if="store.state.websocketStore.isWebSocketOpen" />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  max-width: 1000px;

  margin: 60px auto;
  padding: 0 15px;
}
</style>
