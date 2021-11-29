import { Component, Input, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup";
import { Extension } from '@codemirror/state';

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
