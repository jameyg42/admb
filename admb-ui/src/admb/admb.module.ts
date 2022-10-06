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
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';

import { TimepickerModule } from '../widget/timepicker/timepicker.module';

import { AppSelectComponent } from './app-select/app-select.component';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { ExprEditorComponent } from './expr-editor/expr-editor.component';
import { TsPlotComponent } from './ts-plot/ts-plot.component';
import { TsGroupsComponent } from './ts-groups/ts-groups.component';
import { HistoryListComponent } from './history-list/history-list.component';

import { HistoryListItemComponent } from './history-list/history-list-item/history-list-item.component';
import { AdmbPanelComponent } from './admb.component';

import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { TsWidgetComponent } from './dashboard-panel/ts-widget/ts-widget.component';

import { PlotlyViaCDNModule } from 'angular-plotly.js';
import { CodeEditorComponent } from './code-editor/code-editor.component';
PlotlyViaCDNModule.setPlotlyVersion('latest'); // can be `latest` or any version number (i.e.: '1.40.0')
PlotlyViaCDNModule.setPlotlyBundle('basic'); // optional: can be null (for full) or 'basic', 'cartesian', 'geo', 'gl3d', 'gl2d', 'mapbox' or 'finance'


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
    DashboardPanelComponent,
    TsWidgetComponent,
    CodeEditorComponent,
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
    InputSwitchModule,
    MultiSelectModule,
    ProgressBarModule,
    ScrollPanelModule,
    MenuModule,
    DialogModule,

    TimepickerModule,

    PlotlyViaCDNModule
  ],
  exports: [
    AdmbPanelComponent
  ],
  providers: [
  ]
})
export class AdmbModule { }
