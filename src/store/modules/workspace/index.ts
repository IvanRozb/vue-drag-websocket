import { type Module } from 'vuex'
import type { KonvaStage, KonvaTransformer } from '@/types/konva'
import type { IBlock } from '@/interfaces/IBlock'
import { getLocalStorageItem } from '@/utils/localStorage'
import type { IState } from '@/store'
import { mutations } from '@/store/modules/workspace/mutatios'
import { actions } from '@/store/modules/workspace/actions'
import { generateDefaultItems } from '@/store/modules/workspace/helpers'

export interface IWorkspaceState {
  stageRef: KonvaStage | null
  transformerRef: KonvaTransformer | null
  items: IBlock[]
  lastDeletedItem: { item: IBlock; index: number } | null
}

const getItems = () => getLocalStorageItem<IBlock[]>('items') ?? generateDefaultItems()

export const workspaceStore: Module<IWorkspaceState, IState> = {
  namespaced: true,
  state: {
    stageRef: null,
    transformerRef: null,
    items: getItems(),
    lastDeletedItem: getLocalStorageItem<{
      item: IBlock
      index: number
    }>('last-deleted-item')
  },
  mutations,
  actions
}
