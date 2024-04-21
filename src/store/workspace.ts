import { type InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store, type ActionContext } from 'vuex'
import type { KonvaStage, KonvaTransformer } from '@/types/konva'
import type { IBlock } from '@/components/interactive-workspace/interfaces/IBlock'
import type { IDimensions } from '@/components/interactive-workspace/interfaces/IBox'
import Konva from 'konva'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/localStorage'

export interface IState {
  stageRef: KonvaStage | null
  transformerRef: KonvaTransformer | null
  items: IBlock[]
  step: number
  stageDimensions: IDimensions
  lastDeletedItem: { item: IBlock; index: number } | null
}

const step = 50
const defaultItem = {
  width: 300,
  height: 100,
  x: step,
  y: step,
  scaleX: 1,
  scaleY: 1
}

const generateItems = (defaultItem: Partial<IBlock>): IBlock[] =>
  Array.from({ length: 5 }).map(
    (_, index) =>
      ({
        ...defaultItem,
        x: defaultItem.x! + (index % 3) * (step + defaultItem.width!) + step,
        y: defaultItem.y! + (step + defaultItem.height!) * Math.floor(index / 3) + step,
        id: 'node-' + index,
        text: (index + 1).toString(),
        fill: Konva.Util.getRandomColor()
      }) as IBlock
  )

export const key: InjectionKey<Store<IState>> = Symbol()

export const workspaceStore = createStore<IState>({
  state: {
    stageRef: null,
    transformerRef: null,
    items: getLocalStorageItem<IBlock[]>('items') ?? generateItems(defaultItem),
    step,
    stageDimensions: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    lastDeletedItem: getLocalStorageItem<{
      item: IBlock
      index: number
    }>('last-deleted-item')
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
      setLocalStorageItem('items', items)
    },
    setLastDeletedItem(state: IState, item: { item: IBlock; index: number } | null) {
      state.lastDeletedItem = item
      setLocalStorageItem('last-deleted-item', item)
    }
  },
  actions: {
    updateStageRef({ commit }: ActionContext<IState, IState>, stageRef: KonvaStage) {
      commit('setStageRef', stageRef)
    },
    updateTransformerRef(
      { commit }: ActionContext<IState, IState>,
      transformerRef: KonvaTransformer
    ) {
      commit('setTransformerRef', transformerRef)
    },
    updateItems({ commit }: ActionContext<IState, IState>, items: IBlock[]) {
      commit('setItems', items)
    },
    updateItemById(
      { commit, state }: ActionContext<IState, IState>,
      payload: { id: string; newItem: Partial<IBlock> }
    ) {
      const { items } = state
      const { id, newItem } = payload

      const draggedItemIndex = items.findIndex((i) => i.id === id)
      if (draggedItemIndex === -1) return

      const updatedItems = [...items]
      updatedItems[draggedItemIndex] = { ...items[draggedItemIndex], ...newItem }

      commit('setItems', updatedItems)
    },
    moveItemToFirstIndex({ commit, state }: ActionContext<IState, IState>, id: string) {
      const { items } = state

      const item = items.find((i) => i.id === id)
      if (!item) return

      const updatedItems = [...items]
      const index = updatedItems.indexOf(item)
      updatedItems.splice(index, 1)
      updatedItems.push(item)

      commit('setItems', updatedItems)
    },
    removeItemById({ commit, state }: ActionContext<IState, IState>, id: string) {
      const { items } = state
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) return

      const updatedItems = [...items]
      const deletedItem = updatedItems.splice(index, 1)[0]
      const lastDeletedItem = { item: deletedItem, index }

      commit('setItems', updatedItems)
      commit('setLastDeletedItem', lastDeletedItem)
    },
    restoreDeletedItem({ commit, state }: ActionContext<IState, IState>) {
      const lastDeletedItem = getLocalStorageItem<{ item: IBlock; index: number }>(
        'last-deleted-item'
      )
      if (!lastDeletedItem) return

      const { stageDimensions, items } = state

      const itemToInsert = {
        ...lastDeletedItem.item,
        ...defaultItem,
        fill: lastDeletedItem.item.fill,
        x: (stageDimensions.width - defaultItem.width) / 2,
        y: (stageDimensions.height - defaultItem.height) / 2
      }

      const updatedItems = [...items]
      updatedItems.splice(lastDeletedItem.index, 0, itemToInsert)

      commit('setItems', updatedItems)
      commit('setLastDeletedItem', null)
    },
    updateTransformNodes({ state }: ActionContext<IState, IState>, id: string) {
      const { transformerRef } = state
      if (!transformerRef) return
      const transformerNode = transformerRef.getNode()
      const stage = transformerNode.getStage()
      if (!stage) return

      const selectedNode = stage.findOne('#' + id)
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode])
      } else {
        // remove transformer
        transformerNode.nodes([])
      }
    },
    updateCursor({ state }: ActionContext<IState, IState>, cursor: string) {
      const { stageRef } = state
      if (!stageRef) return

      const styles = stageRef.getNode().container().style
      styles.cursor = cursor
    }
  }
})

export function useWorkspaceStore() {
  return baseUseStore(key)
}
