import { getTargetNodeByClassName } from '@/utils/getTargetNodeByClassName'
import type { KonvaNode } from '@/types/konva'

export const getTargetGroup = (targetNode: KonvaNode) => {
  return getTargetNodeByClassName(targetNode, 'Group')
}
