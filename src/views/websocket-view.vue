<script setup lang="ts">
import { ref } from 'vue'
import { Websocket, WebsocketBuilder } from 'websocket-ts'

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
const transactions = ref<{ sender: string; recipient: string; amount: number }[]>([])
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
    <div class="buttons">
      <button class="button button-start" @click="startWebSocket" :disabled="isWebSocketOpen">
        Start
      </button>
      <button class="button button-stop" @click="stopWebSocket" :disabled="!isWebSocketOpen">
        Stop
      </button>
      <button class="button button-reset" @click="reset">Reset</button>
    </div>
    <h3 class="total">Total: {{ totalAmount.toFixed(8) }} BTC</h3>
    <table class="table">
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th class="table__sum">Sum</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{ transaction.sender }}</td>
          <td>{{ transaction.recipient }}</td>
          <td>{{ transaction.amount.toFixed(8) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  max-width: 1000px;

  margin: 32px auto;

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

  .total {
    text-align: center;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    th,
    td {
      padding: 8px;

      width: 40%;

      border: 1px solid #ddd;

      text-align: left;
      word-break: break-word;
    }

    .table__sum {
      width: 20%;
    }

    th {
      background-color: #f2f2f2;
    }
  }
}
</style>
