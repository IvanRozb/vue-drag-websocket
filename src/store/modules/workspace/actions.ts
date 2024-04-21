import type { ActionContext } from 'vuex'
import type { IState } from '@/store'
import type { IBlock } from '@/interfaces/IBlock'
import { getLocalStorageItem } from '@/utils/localStorage'
import type { IWorkspaceState } from '@/store/modules/workspace/index'
import { DEFAULT_ITEM, STAGE_DIMENSIONS } from '@/constants/workspace'

export const actions = {
  updateItemById(
    { commit, state }: ActionContext<IWorkspaceState, IState>,
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
  moveItemToFirstIndex({ commit, state }: ActionContext<IWorkspaceState, IState>, id: string) {
    const { items } = state

    const item = items.find((i) => i.id === id)
    if (!item) return

    const updatedItems = [...items]
    const index = updatedItems.indexOf(item)
    updatedItems.splice(index, 1)
    updatedItems.push(item)

    commit('setItems', updatedItems)
  },
  removeItemById({ commit, state }: ActionContext<IWorkspaceState, IState>, id: string) {
    const { items } = state
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return

    const updatedItems = [...items]
    const deletedItem = updatedItems.splice(index, 1)[0]
    const lastDeletedItem = { item: deletedItem, index }

    commit('setItems', updatedItems)
    commit('setLastDeletedItem', lastDeletedItem)
  },
  restoreDeletedItem({ commit, state }: ActionContext<IWorkspaceState, IState>) {
    const lastDeletedItem = getLocalStorageItem<{ item: IBlock; index: number }>(
      'last-deleted-item'
    )
    if (!lastDeletedItem) return

    const { items } = state

    const itemToInsert = {
      ...lastDeletedItem.item,
      ...DEFAULT_ITEM,
      fill: lastDeletedItem.item.fill,
      x: (STAGE_DIMENSIONS.width - DEFAULT_ITEM.width) / 2,
      y: (STAGE_DIMENSIONS.height - DEFAULT_ITEM.height) / 2
    }

    const updatedItems = [...items]
    updatedItems.splice(lastDeletedItem.index, 0, itemToInsert)

    commit('setItems', updatedItems)
    commit('setLastDeletedItem', null)
  },
  updateTransformNodes({ state }: ActionContext<IWorkspaceState, IState>, id: string) {
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
  updateCursor({ state }: ActionContext<IWorkspaceState, IState>, cursor: string) {
    const { stageRef } = state
    if (!stageRef) return

    const styles = stageRef.getNode().container().style
    styles.cursor = cursor
  }
}
