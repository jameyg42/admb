import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'admb-expr-editor',
  templateUrl: './expr-editor.component.html',
  styleUrls: ['./expr-editor.component.scss']
})
export class ExprEditorComponent implements OnInit {
  @Input()
  expr: string;

  @Output()
  exprChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
