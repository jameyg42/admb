import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import './cm-pipeline-mode';
import * as parser from '@metlife/appd-services-js/lib/metrics/pipeline/parser';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  exprChangeSubject = new Subject<string>();

  @Output()
  exprExecute = new EventEmitter<string>();

  @Output()
  validChange = new EventEmitter<boolean>();
  isValid = false;

  @Output()
  parseResultChange = new EventEmitter<ParseResult>();
  parseResult: ParseResult;
  parseTable: any;

  @ViewChild(CodemirrorComponent, {static: false})
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
    this.exprChangeSubject.pipe(
      debounceTime(100),
      distinctUntilChanged()
    ).subscribe((expr) => this._parseExpression(expr));
  }
  _onModelChange(event$) {
    this.exprChange.emit(this.expr);
    this.exprChangeSubject.next(event$);
  }

  _parseExpression(expr: string) {
    try {
      const p = parser.streaming();
      p.feed(expr);
      this.parseTable = p.table;
      const ast = p.results.length === 1 ? p.results[0] : null;
      if (ast) {
        this.parseResult = {expr, ast, valid: true };
      } else {
        this.parseResult = {expr, ast, valid: false};
      }
    } catch (e) {
      this.parseResult = {expr, valid: false, error: e};
    }
    this.parseResultChange.emit(this.parseResult);
  }
}

export interface ParseResult {
  expr: string;
  valid: boolean;
  ast?: any;
  error?: any;
}
