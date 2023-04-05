import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { ParseTreeComponent } from './parse-tree/parse-tree.component';
import { SampleEditorComponent } from './sample-editor/sample-editor.component';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitterModule } from 'primeng/splitter';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ParseTreeComponent,
    SampleEditorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    ButtonModule,
    SplitterModule,
    ToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
