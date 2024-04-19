import Konva from 'konva'
import Stage = Konva.Stage
import Transformer = Konva.Transformer
import type { NodeConfig } from 'konva/lib/Node'

interface KonvaNode extends Node {
  getStage(): KonvaNode
  node(): Node<NodeConfig>
  nodes(nodes: Node<NodeConfig>[]): void
  id(): number
  x(value?: number): number
  y(value?: number): number
  scaleX(value?: number): number
  scaleY(value?: number): number
  getParent(): KonvaNode
  findOne(str: string): KonvaNode
  getAbsoluteScale(): { x: number; y: number }
  className: string
  attrs: {
    width: number
    height: number
  }
}

interface KonvaStage extends Stage {
  getNode(): Stage
}

interface KonvaTextNode extends KonvaNode {}

interface KonvaText extends KonvaNode {
  getNode(): KonvaTextNode
}

interface KonvaTransformerNode extends KonvaNode {}

interface KonvaTransformer extends Transformer {
  getNode(): KonvaTransformerNode
}

interface KonvaTransformEvent extends Event {
  target: KonvaNode
}

interface KonvaDragEvent extends Event {
  target: KonvaNode
}

interface KonvaMouseDownEvent extends Event {
  target: KonvaNode
}
