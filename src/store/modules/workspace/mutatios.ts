import type { KonvaStage, KonvaTransformer } from '@/types/konva'
import type { IBlock } from '@/interfaces/IBlock'
import { setLocalStorageItem } from '@/utils/localStorage'
import type { IWorkspaceState } from '@/store/modules/workspace/index'
import type { IMutationTree } from '@/interfaces/IMutationTree'
import { generateDefaultItems } from '@/store/modules/workspace/helpers'

export const mutations: IMutationTree<IWorkspaceState> = {
  resetState(state: IWorkspaceState) {
    state.items = generateDefaultItems()
    state.lastDeletedItem = null

    console.log('here')

    setLocalStorageItem('items', state.items)
    setLocalStorageItem('last-deleted-item', state.lastDeletedItem)
  },
  setStageRef(state: IWorkspaceState, stageRef: KonvaStage) {
    state.stageRef = stageRef
  },
  setTransformerRef(state: IWorkspaceState, transformerRef: KonvaTransformer) {
    state.transformerRef = transformerRef
  },
  setItems(state: IWorkspaceState, items: IBlock[]) {
    state.items = items
    setLocalStorageItem('items', items)
  },
  setLastDeletedItem(state: IWorkspaceState, item: { item: IBlock; index: number } | null) {
    state.lastDeletedItem = item
    setLocalStorageItem('last-deleted-item', item)
  }
}
