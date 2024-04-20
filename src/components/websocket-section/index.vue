<script setup lang="ts">
import { ref } from 'vue'
import { Websocket, WebsocketBuilder } from 'websocket-ts'
import ButtonsTab from '@/components/websocket-section/buttons-tab.vue'
import type { ITransaction } from '@/components/websocket-section/interfaces/ITransaction'
import TransactionsTable from '@/components/websocket-section/transactions-table.vue'

// Websocket Event Handlers
const handleOpen = () => {
  console.log('WebSocket connection opened!')
  isWebSocketOpen.value = true
  ws.value?.send(JSON.stringify({ op: 'unconfirmed_sub' }))
}

const handleClose = () => {
  console.log('WebSocket connection closed!')
  isWebSocketOpen.value = false
}

const handleMessage = (_: Websocket, ev: MessageEvent) => {
  const message = JSON.parse(ev.data)
  if (message.op === 'utx') {
    const transaction = message.x
    const sender = transaction.inputs[0].prev_out.addr
    const recipient = transaction.out[0].addr
    const amount = transaction.out[0].value / 1e8

    if (!sender || !recipient) return

    transactions.value.push({ sender, recipient, amount })
    totalAmount.value += amount
  }
}

// State
const ws = ref<Websocket | null>(null)

const isWebSocketOpen = ref(false)
const transactions = ref<ITransaction[]>([])
const totalAmount = ref(0)

// Button handlers
const startWebSocket = () => {
  ws.value = new WebsocketBuilder('wss://ws.blockchain.info/inv')
    .onOpen(handleOpen)
    .onClose(handleClose)
    .onMessage(handleMessage)
    .build()
}

const stopWebSocket = () => {
  ws.value?.close()
}

const reset = () => {
  transactions.value = []
  totalAmount.value = 0
}
</script>

<template>
  <div class="container">
    <buttons-tab
      :is-web-socket-open="isWebSocketOpen"
      :start-web-socket="startWebSocket"
      :stop-web-socket="stopWebSocket"
      :reset="reset"
    />
    <transactions-table :total-amount="totalAmount" :transactions="transactions" />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  max-width: 1000px;

  margin: 32px auto;
}
</style>
