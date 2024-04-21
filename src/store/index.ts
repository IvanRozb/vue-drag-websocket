import { type InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { type IWorkspaceState, workspaceStore } from '@/store/modules/workspace'

export interface IState {
  workspaceStore: IWorkspaceState
}

export const key: InjectionKey<Store<IState>> = Symbol()

export const store = createStore<IState>({
  state: {} as IState,
  modules: {
    workspaceStore
  }
})

export const useStore = () => {
  return baseUseStore(key)
}
