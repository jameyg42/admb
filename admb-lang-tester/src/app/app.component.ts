import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { EditorComponent } from './editor/editor.component';
import { ParseTreeComponent, ParseTreeNode } from './parse-tree/parse-tree.component';
import { SampleEditorComponent } from './sample-editor/sample-editor.component';
import { LRParser } from '@lezer/lr';
import { buildParser } from '@lezer/generator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'editor';

  @ViewChild(EditorComponent) 
  private lezerEditor!:EditorComponent;

  @ViewChild(SampleEditorComponent) 
  private sample!:SampleEditorComponent;

  @ViewChild(ParseTreeComponent) 
  private parseTree!:ParseTreeComponent;

  generateResults!: string;

  private parser!:LRParser;

  ngAfterViewInit() {
    setTimeout(() => {
      this.lezerEditor.doc = storage.get('grammar');
      this.sample.doc = storage.get('sample');
      this.generateParser();
    },10);

    this.lezerEditor.docChange.subscribe(()=>this.generateParser());
    this.sample.docChange.subscribe(()=>this.parseSample());
  }

  generateParser() {
    try {
      storage.put('grammar', this.lezerEditor.doc);
      this.parser = buildParser(this.lezerEditor.doc);
      this.parseSample();
      this.generateResults = "No Grammar Errors";

    } catch (e) {
      this.generateResults = e as string;
      console.error(e);
    }
  }
  parseSample() {
    storage.put('sample', this.sample.doc);
    const sample = this.sample.doc;
    const tree = this.parser.parse(sample);
    this.parseTree.root = new ParseTreeNode(tree.topNode, sample);
  }
}


const storagePrefix = 'admb.lezer-editor';
const storage = {
  get: (key:string):string => {
    return localStorage ? localStorage.getItem(`${storagePrefix}.${key}`) || '' : '';
  },
  put: (key:string, item:string):void => {
    localStorage && localStorage.setItem(`${storagePrefix}.${key}`, item);
  }
}