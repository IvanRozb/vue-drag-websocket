import type { KonvaTextNode } from '@/types/konva'

export const saveTextNodeScale = (node: KonvaTextNode) => {
  const absScale = node.getAbsoluteScale()
  node.scaleX(node.scaleX() / absScale.x)
  node.scaleY(node.scaleY() / absScale.y)
}
