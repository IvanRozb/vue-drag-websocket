import { type InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { type IWorkspaceState, workspaceStore } from '@/store/modules/workspace'
import { type IWebSocketState, websocketStore } from '@/store/modules/websocket'

export interface IState {
  workspaceStore: IWorkspaceState
  websocketStore: IWebSocketState
}

export const key: InjectionKey<Store<IState>> = Symbol()

export const store = createStore<IState>({
  state: {} as IState,
  modules: {
    workspaceStore,
    websocketStore
  }
})

export const useStore = () => {
  return baseUseStore(key)
}
