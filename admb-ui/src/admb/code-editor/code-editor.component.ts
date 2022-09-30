import { Component, Input, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { basicSetup } from "codemirror";
import { EditorState, Extension } from '@codemirror/state';
import { EditorView } from "@codemirror/view";
import { admb } from "@metlife/admb-lang";
import { CodeEditorCompletionService } from './code-editor-completion.service';


@Component({
  selector: 'admb-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit  {
  @Input() extensions : Extension[] = [];

  @ViewChild('el') el : ElementRef;

  private editorView : EditorView;

  private _doc = 'testing';

  constructor(private completionProvider:CodeEditorCompletionService) {
  }

  @Input()
  get doc(): string {
    return this._doc;
  }

  set doc(doc: string) {
    if (doc !== this._doc) {
      this._doc = doc;
      if (this.editorView) {
        this.editorView.dispatch({
          changes:[
            {from: 0, to: this.editorView.state.doc.length},
            {from: 0, insert: doc}
          ]
        });
      }
    }
  }
  @Output() docChange = new EventEmitter<string>();


  ngAfterViewInit() {
    const onUpdate = EditorView.updateListener.of(v => {
      if (v.docChanged) {
        this._doc = v.state.doc.toString();
        this.docChange.emit(this._doc);
      }
    })
    const viewExtensions = this.extensions.slice();
    viewExtensions.push(basicSetup);
    viewExtensions.push(onUpdate);
    viewExtensions.push(admb(this.completionProvider));
    
    const state = EditorState.create({
      doc: this.doc,
      extensions: viewExtensions
    });
    this.editorView = new EditorView({
      state: state,
      parent: this.el.nativeElement
    });
  }
}
