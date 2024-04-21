import type { Module } from 'vuex'
import { Websocket } from 'websocket-ts'
import type { ITransaction } from '@/interfaces/ITransaction'
import type { IState } from '@/store'
import { mutations } from '@/store/modules/websocket/mutations'
import { actions } from '@/store/modules/websocket/actions'

export interface IWebSocketState {
  ws: Websocket | null
  isWebSocketOpen: boolean
  transactions: ITransaction[]
  totalAmount: number
}

export const websocketStore: Module<IWebSocketState, IState> = {
  namespaced: true,
  state: {
    ws: null,
    isWebSocketOpen: false,
    transactions: [],
    totalAmount: 0
  },
  mutations,
  actions
}
