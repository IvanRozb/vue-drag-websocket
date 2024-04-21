import type { KonvaStage, KonvaTransformer } from '@/types/konva'
import type { IBlock } from '@/components/interactive-workspace/interfaces/IBlock'
import { setLocalStorageItem } from '@/utils/localStorage'
import type { IWorkspaceState } from '@/store/modules/workspace/index'

export const mutations = {
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
