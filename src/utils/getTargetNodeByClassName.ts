import type { KonvaNode } from '@/types/konva'

export const getTargetNodeByClassName = (targetNode: KonvaNode, className: string) => {
  let target = targetNode
  while (target.className && target.className !== className) {
    target = target.getParent()
  }
  return target
}
