import { Websocket } from 'websocket-ts'
import type { ITransaction } from '@/interfaces/ITransaction'
import type { IWebSocketState } from '@/store/modules/websocket/index'
import type { IMutationTree } from '@/interfaces/IMutationTree'

export const mutations: IMutationTree<IWebSocketState> = {
  setWebsocket(state: IWebSocketState, ws: Websocket) {
    state.ws = ws
  },
  setIsWebsocketOpen(state: IWebSocketState, isOpen: boolean) {
    state.isWebSocketOpen = isOpen
  },
  addTransaction(state: IWebSocketState, transaction: ITransaction) {
    state.transactions.push(transaction)
  },
  updateTotalAmount(state: IWebSocketState, amount: number) {
    state.totalAmount += amount
  },
  resetState(state: IWebSocketState) {
    state.transactions = []
    state.totalAmount = 0
  }
}
