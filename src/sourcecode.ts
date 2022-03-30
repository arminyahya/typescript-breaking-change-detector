export default class SourceCode {
  constructor(public text: string) {
    this.text = text;
  }

  getText(node, beforeCount, afterCount) {
    if (node) {
      return this.text.slice(
        Math.max(node.range[0] - (beforeCount || 0), 0),
        node.range[1] + (afterCount || 0)
      );
    }
    return this.text;
  }
}
