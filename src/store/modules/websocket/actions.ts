import type { ActionContext } from 'vuex'
import type { IState } from '@/store'
import { WebsocketBuilder } from 'websocket-ts'
import type { IWebSocketState } from '@/store/modules/websocket/index'
import type { IActionTree } from '@/interfaces/IActionTree'

export const actions: IActionTree<IWebSocketState, IState> = {
  startWebSocket({ commit }: ActionContext<IWebSocketState, IState>) {
    const ws = new WebsocketBuilder('wss://ws.blockchain.info/inv')
      .onOpen(() => {
        console.log('WebSocket connection opened!')
        commit('setIsWebsocketOpen', true)
        ws.send(JSON.stringify({ op: 'unconfirmed_sub' }))
      })
      .onClose(() => {
        console.log('WebSocket connection closed!')
        commit('setIsWebsocketOpen', false)
      })
      .onMessage((_, ev: MessageEvent) => {
        const message = JSON.parse(ev.data)
        if (message.op === 'utx') {
          const transaction = message.x
          const sender = transaction.inputs[0].prev_out.addr
          const recipient = transaction.out[0].addr
          const amount = transaction.out[0].value / 1e8

          if (!sender || !recipient) return

          commit('addTransaction', { sender, recipient, amount })
          commit('updateTotalAmount', amount)
        }
      })
      .build()

    commit('setWebsocket', ws)
  },
  stopWebSocket({ state, commit }: ActionContext<IWebSocketState, IState>) {
    state.ws?.close()
    commit('setWebsocket', null)
  },
  reset({ commit }: ActionContext<IWebSocketState, IState>) {
    commit('resetState')
  }
}
