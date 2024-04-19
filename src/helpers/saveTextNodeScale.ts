export const saveTextNodeScale = (textNode: any) => {
  const absScale = textNode.getAbsoluteScale()
  textNode.scaleX(textNode.scaleX() / absScale.x)
  textNode.scaleY(textNode.scaleY() / absScale.y)
}
