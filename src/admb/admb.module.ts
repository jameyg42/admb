import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';

import { TimepickerModule } from '../widget/timepicker/timepicker.module';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

import { AppSelectComponent } from './app-select/app-select.component';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { ExprEditorComponent } from './expr-editor/expr-editor.component';
import { TsPlotComponent } from './ts-plot/ts-plot.component';
import { TsGroupsComponent } from './ts-groups/ts-groups.component';
import { HistoryListComponent } from './history-list/history-list.component';

// SplitButton hack
import { Router } from '@angular/router';
import { HistoryListItemComponent } from './history-list/history-list-item/history-list-item.component';
import { AdmbPanelComponent } from './admb.component';

PlotlyModule.plotlyjs = PlotlyJS;


@NgModule({
  declarations: [
    AppSelectComponent,
    BrowserPanelComponent,
    ExprEditorComponent,
    TsPlotComponent,
    TsGroupsComponent,
    HistoryListComponent,
    HistoryListItemComponent,
    AdmbPanelComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    ButtonModule,
    SplitButtonModule,
    DropdownModule,
    MultiSelectModule,
    ProgressBarModule,
    ScrollPanelModule,
    MenuModule,
    TabViewModule,

    TimepickerModule,

    CodemirrorModule,

    PlotlyModule,
  ],
  exports: [
    AdmbPanelComponent
  ],
  providers: [
    // SplitButton hack
    {provide: Router, useValue: {}}
  ]
})
export class AdmbModule { }
