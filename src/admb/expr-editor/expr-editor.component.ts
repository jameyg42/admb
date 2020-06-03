import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import './cm-pipeline-mode';

@Component({
  selector: 'admb-expr-editor',
  templateUrl: './expr-editor.component.html',
  styleUrls: ['./expr-editor.component.scss']
})
export class ExprEditorComponent implements AfterViewInit {
  @Input()
  expr: string;

  @Output()
  exprChange = new EventEmitter<string>();

  @Output()
  exprExecute = new EventEmitter<string>();

  @ViewChild(CodemirrorComponent)
  cm: CodemirrorComponent;

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit() {
    const self = this;
    this.cm.options = {
      lineNumbers: true,
      lineWrapping: true,
      theme: 'default',
      mode: 'pipeline',
      extraKeys: {
        'Ctrl-Enter': () => {
          self.ngZone.run(() => {
            self.exprExecute.emit(self.expr);
          });
        }
      }
    };
  }
}

