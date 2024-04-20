<script setup lang="ts">
import { ref } from 'vue';
import { Websocket, WebsocketBuilder } from 'websocket-ts'

// Websocket Event Handlers
const handleOpen = () => {
  console.log("WebSocket connection opened!");
  isWebSocketOpen.value = true;
  ws.value?.send(JSON.stringify({ op: 'unconfirmed_sub' }));
}

const handleClose = () => {
  console.log("WebSocket connection closed!");
  isWebSocketOpen.value = false;
}

const handleMessage = (_: Websocket, ev: MessageEvent) => {
  const message = JSON.parse(ev.data);
  if (message.op === 'utx') {
    const transaction = message.x;
    const sender = transaction.inputs[0].prev_out.addr;
    const recipient = transaction.out[0].addr;
    const amount = transaction.out[0].value / 1e8;

    transactions.value.push(`Sender: ${sender}, Recipient: ${recipient}, Amount: ${amount.toFixed(8)} BTC`);
    totalAmount.value += amount;
  }
};

// State
const ws = ref<Websocket | null>(null);

const isWebSocketOpen = ref(false);
const transactions = ref<string[]>([]);
const totalAmount = ref(0);

// Button handlers
const startWebSocket = () => {
  ws.value = new WebsocketBuilder("wss://ws.blockchain.info/inv")
    .onOpen(handleOpen)
    .onClose(handleClose)
    .onMessage(handleMessage)
    .build();
};

const stopWebSocket = () => {
  ws.value?.close();
};

const reset = () => {
  transactions.value = [];
  totalAmount.value = 0;
};
</script>

<template>
  <div class="container">
    <div class="buttons">
      <button @click="startWebSocket" :disabled="isWebSocketOpen">Start</button>
      <button @click="stopWebSocket" :disabled="!isWebSocketOpen">Stop</button>
      <button @click="reset">Reset</button>
    </div>
    <h3>Total: {{ totalAmount.toFixed(8) }} BTC</h3>
    <ul class="list">
      <li v-for="(transaction, index) in transactions" :key="index" class="item">{{ transaction }}</li>
    </ul>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  max-width: 1000px;

  margin: 0 auto;
}
</style>
