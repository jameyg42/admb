import { Component, Input } from '@angular/core';
import { SyntaxNode } from '@lezer/common';

@Component({
  selector: 'app-parse-tree',
  templateUrl: './parse-tree.component.html',
  styleUrls: ['./parse-tree.component.scss']
})
export class ParseTreeComponent {
  @Input()
  private _root!:ParseTreeNode;

  dump:string = '';

  public set root(root:ParseTreeNode) {
    this._root = root;
    this.dump = this.formatDeep(root);
  }
  formatDeep(node:ParseTreeNode, level=0) {
    let f = new Array(level).fill('').join(' ');
    f += `[${node.type} : ${node.value}]\n`;
    f += node.children.map(c => this.formatDeep(c, level+1)).join('');
    return f;
  }
}

export class ParseTreeNode {
  type: string;
  value: string;
  children: ParseTreeNode[];

  constructor(node:SyntaxNode, readonly expr:string) {
    this.type = node.name;
    this.value = expr.substring(node.from, node.to);
    this.children = getChildren(node).map(c => new ParseTreeNode(c, expr));
  }
}

function getChildren(node: SyntaxNode): SyntaxNode[] {
  let cur = node.cursor();
  const result: SyntaxNode[] = []
  if (!cur.firstChild()) return result;
  for (;;) {
    result.push(cur.node);
    if (!cur.nextSibling()) return result;
  }
}
