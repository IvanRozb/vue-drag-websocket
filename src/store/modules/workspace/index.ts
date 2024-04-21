import { type Module } from 'vuex'
import type { KonvaStage, KonvaTransformer } from '@/types/konva'
import type { IBlock } from '@/interfaces/IBlock'
import Konva from 'konva'
import { getLocalStorageItem } from '@/utils/localStorage'
import type { IState } from '@/store'
import { mutations } from '@/store/modules/workspace/mutatios'
import { actions } from '@/store/modules/workspace/actions'
import { DEFAULT_ITEM, DISCRETE_UNIT } from '@/constants/workspace'

export interface IWorkspaceState {
  stageRef: KonvaStage | null
  transformerRef: KonvaTransformer | null
  items: IBlock[]
  lastDeletedItem: { item: IBlock; index: number } | null
}

const generateItems = (defaultItem: Partial<IBlock>): IBlock[] =>
  Array.from({ length: 5 }).map(
    (_, index) =>
      ({
        ...defaultItem,
        x: defaultItem.x! + (index % 3) * (DISCRETE_UNIT + defaultItem.width!) + DISCRETE_UNIT,
        y:
          defaultItem.y! +
          (DISCRETE_UNIT + defaultItem.height!) * Math.floor(index / 3) +
          DISCRETE_UNIT,
        id: 'node-' + index,
        text: (index + 1).toString(),
        fill: Konva.Util.getRandomColor()
      }) as IBlock
  )

const getItems = () => getLocalStorageItem<IBlock[]>('items') ?? generateItems(DEFAULT_ITEM)

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
