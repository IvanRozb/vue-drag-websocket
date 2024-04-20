<script setup lang="ts">
import type { ITransaction } from '@/components/websocket-section/interfaces/ITransaction'

defineProps<{
  transactions: ITransaction[]
  totalAmount: number
}>()
</script>

<template>
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
</template>

<style scoped lang="scss">
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
</style>
