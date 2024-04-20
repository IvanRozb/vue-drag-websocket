import type { IBox, IDimensions } from '@/components/interactive-workspace/interfaces/IBox'

export const getTransformBox = (
  oldBoundBox: IBox,
  newBoundBox: IBox,
  step: number,
  stageBox: IDimensions
) => {
  if (Math.abs(newBoundBox.width) < step || Math.abs(newBoundBox.height) < step) {
    return oldBoundBox
  }

  let res = { ...newBoundBox }

  const fillBoxProp = (dimension: keyof IBox) => {
    const diffX = Math.abs(oldBoundBox[dimension] - newBoundBox[dimension])

    if (diffX < step) res[dimension] = oldBoundBox[dimension]
    else res[dimension] = newBoundBox[dimension]

    res[dimension] = Math.round(res[dimension] / step) * step
  }

  const boxProps: (keyof IBox)[] = ['width', 'height', 'x', 'y']
  boxProps.forEach(fillBoxProp)

  const isOut =
    res.x < 0 ||
    res.y < 0 ||
    res.x + res.width > stageBox.width ||
    res.y + res.height > stageBox.height

  if (isOut) {
    res = oldBoundBox
  }

  return res
}
