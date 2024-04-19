<template>
  <div>
    <button @click="startWebSocket" :disabled="isWebSocketOpen">Start</button>
    <button @click="stopWebSocket" :disabled="!isWebSocketOpen">Stop</button>
    <button @click="reset">Reset</button>
    <ul>
      <li v-for="(transaction, index) in transactions" :key="index">{{ transaction }}</li>
    </ul>
    <p>Total: {{ totalAmount.toFixed(8) }} BTC</p>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const socket = ref(null);
    const transactions = ref([]);
    const totalAmount = ref(0);
    const isWebSocketOpen = ref(false);

    const startWebSocket = () => {
      socket.value = new WebSocket('wss://ws.blockchain.info/inv');
      socket.value.onopen = () => {
        // Subscribe to unconfirmed transactions
        socket.value.send(JSON.stringify({ op: 'unconfirmed_sub' }));
        isWebSocketOpen.value = true;
      };
      socket.value.onmessage = handleMessage;
    };

    const stopWebSocket = () => {
      socket.value.close();
      isWebSocketOpen.value = false;
    };

    const reset = () => {
      transactions.value = [];
      totalAmount.value = 0;
    };

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.op === 'utx') {
        const transaction = message.x;
        const sender = transaction.inputs[0].prev_out.addr;
        const recipient = transaction.out[0].addr;
        const amount = transaction.out[0].value / 1e8;

        transactions.value.push(`Sender: ${sender}, Recipient: ${recipient}, Amount: ${amount.toFixed(8)} BTC`);
        totalAmount.value += amount;
      }
    };


    return {
      startWebSocket,
      stopWebSocket,
      reset,
      transactions,
      totalAmount,
      isWebSocketOpen
    };
  }
};
</script>

<style>
/* Add your CSS styles here */
</style>
