import type { IDimensions } from '@/interfaces/IDimensions'

export const DISCRETE_UNIT = 50

export const DEFAULT_ITEM = {
  width: 300,
  height: 100,
  x: DISCRETE_UNIT,
  y: DISCRETE_UNIT,
  scaleX: 1,
  scaleY: 1
}

export const STAGE_DIMENSIONS: IDimensions = {
  width: window.innerWidth,
  height: window.innerHeight
}
