import type { IBlock } from '@/interfaces/IBlock'
import { DEFAULT_ITEM, DISCRETE_UNIT } from '@/constants/workspace'
import Konva from 'konva'

export const generateDefaultItems = (): IBlock[] =>
  Array.from({ length: 5 }).map(
    (_, index) =>
      ({
        ...DEFAULT_ITEM,
        x: DEFAULT_ITEM.x! + (index % 3) * (DISCRETE_UNIT + DEFAULT_ITEM.width!) + DISCRETE_UNIT,
        y:
          DEFAULT_ITEM.y! +
          (DISCRETE_UNIT + DEFAULT_ITEM.height!) * Math.floor(index / 3) +
          DISCRETE_UNIT,
        id: 'node-' + index,
        text: (index + 1).toString(),
        fill: Konva.Util.getRandomColor()
      }) as IBlock
  )
