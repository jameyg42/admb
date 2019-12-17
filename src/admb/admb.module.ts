import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

import { AppSelectComponent } from './app-select/app-select.component';
import { RangeSelectComponent } from './range-select/range-select.component';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { ExprEditorComponent } from './expr-editor/expr-editor.component';
import { TsPlotComponent } from './ts-plot/ts-plot.component';
import { TsGroupsComponent } from './ts-groups/ts-groups.component';

PlotlyModule.plotlyjs = PlotlyJS;


@NgModule({
  declarations: [
    AppSelectComponent,
    RangeSelectComponent,
    BrowserPanelComponent,
    ExprEditorComponent,
    TsPlotComponent,
    TsGroupsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    ProgressBarModule,
    ScrollPanelModule,

    PlotlyModule,
  ],
  exports: [
    BrowserPanelComponent
  ]
})
export class AdmbModule { }
