import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import './cm-pipeline-mode';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';

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

  options: any;

  constructor(private ngZone: NgZone) {
    this.options = {
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      theme: 'default',
      mode: 'pipeline',
      extraKeys: {
        'Ctrl-Enter': () => ngZone.run(() => {
          this.exprExecute.emit(this.expr);
        })
      }
    };
  }
}

