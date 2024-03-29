import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { EditorView, keymap, drawSelection, highlightSpecialChars, highlightActiveLine, lineNumbers, highlightActiveLineGutter} from "@codemirror/view";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { EditorState } from '@codemirror/state';
import { debounceTime, Subject } from 'rxjs';

import { admb } from "@admb/admb-lang";
import { AdmbProviderService } from '../admb-provider.service';

const test = `
8911*:/Overall*/Average Response Time (ms)[min,baseline@WEEKLY] >> groupBy 4 >> reduce fn=avg
>> [
  8911*:/Ind*/{Calls,Errors}* >> groupBy rex="(SEA|NYC)"
] >> flatten >> smooth
`;

@Component({
  selector: 'app-sample-editor',
  templateUrl: './sample-editor.component.html',
  styleUrls: ['./sample-editor.component.scss']
})
export class SampleEditorComponent implements AfterViewInit {
  @ViewChild('el') el! : ElementRef;

  private editorView! : EditorView;
  private docChangeDebouncer: Subject<string>;
  @Output() 
  public readonly docChange = new EventEmitter<string>();

  constructor(private autocompleteProvider:AdmbProviderService) {
    this.docChangeDebouncer = new Subject<string>();
    this.docChangeDebouncer.pipe(
      debounceTime(200)
    ).subscribe((value) => this.docChange.emit(value));
  }

  private _doc = test;
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


  ngAfterViewInit() {
    const onUpdate = EditorView.updateListener.of(v => {
      if (v.docChanged) {
        this._doc = v.state.doc.toString();
        this.docChangeDebouncer.next(this._doc);
      }
    })
    const viewExtensions = [
      autocompletion(),
      lineNumbers(),
      drawSelection(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      closeBrackets(),
      highlightActiveLine(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...completionKeymap,
        ...closeBracketsKeymap,
        indentWithTab,
      ]),
      onUpdate,
      admb(this.autocompleteProvider)
    ];
    
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
