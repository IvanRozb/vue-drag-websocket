import type { IBlock } from '@/components/grid-section/interfaces/IBlock'
import Konva from 'konva'

export const generateItems = (defaultItem: Partial<IBlock>, step: number): IBlock[] =>
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
