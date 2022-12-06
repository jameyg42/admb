import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Extension } from '@codemirror/state';
import { Command, KeyBinding, keymap } from '@codemirror/view';

@Component({
  selector: 'admb-expr-editor',
  templateUrl: './expr-editor.component.html',
  styleUrls: ['./expr-editor.component.scss']
})
export class ExprEditorComponent {
  @Input()
  expr: string;

  @Output()
  exprChange = new EventEmitter<string>();

  @Output()
  exprExecute = new EventEmitter<string>();

  extensions: Extension[];

  constructor(private ngZone: NgZone) {
    const execExpr: Command = view => {
      this.exprExecute.emit(this.expr);
      return true;
    };
    const exprKeymap: readonly KeyBinding[] = ([
      {key: "Ctrl-Enter",  run: execExpr, preventDefault: true}
    ]);
    this.extensions = [keymap.of(exprKeymap)];
  }
}
