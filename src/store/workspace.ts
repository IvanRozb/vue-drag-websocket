import { type InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store, type ActionContext } from 'vuex'
import type { KonvaStage, KonvaTransformer } from '@/types/konva'
import type { IBlock } from '@/components/interactive-workspace/interfaces/IBlock'

export interface IState {
  stageRef: KonvaStage | null
  transformerRef: KonvaTransformer | null
  items: IBlock[]
}

export const key: InjectionKey<Store<IState>> = Symbol()

export const workspaceStore = createStore<IState>({
  state: {
    stageRef: null,
    transformerRef: null,
    items: []
  },
  mutations: {
    setStageRef(state: IState, stageRef: KonvaStage) {
      state.stageRef = stageRef
    },
    setTransformerRef(state: IState, transformerRef: KonvaTransformer) {
      state.transformerRef = transformerRef
    },
    setItems(state: IState, items: IBlock[]) {
      state.items = items
    }
  },
  actions: {
    updateStageRef({ commit }: ActionContext<IState, any>, stageRef: KonvaStage) {
      commit('setStageRef', stageRef)
    },
    updateTransformerRef({ commit }: ActionContext<IState, any>, transformerRef: KonvaTransformer) {
      commit('setTransformerRef', transformerRef)
    },
    updateItems({ commit }: ActionContext<IState, any>, items: IBlock[]) {
      commit('setItems', items)
    }
  }
})

export function useWorkspaceStore() {
  return baseUseStore(key)
}
