import { Component, OnInit, ViewChild, EventEmitter, Output, NgZone } from '@angular/core';
import { Application, Range, MetricTimeseries } from '../svc/model';
import { AdmbService } from '../svc/admb.service';
import { ProgressBar } from 'primeng/progressbar';
import { ParseResult, ExprEditorComponent } from '../expr-editor/expr-editor.component';
import { HistoryService } from '../history-list/history.service';

@Component({
  selector: 'admb-browser-panel',
  templateUrl: './browser-panel.component.html',
  styleUrls: ['./browser-panel.component.scss']
})
export class BrowserPanelComponent implements OnInit {
  range: Range;
  parseResult: ParseResult;

  variables = {} as any;
  plotGroups: any;

  @ViewChild(ExprEditorComponent)
  editor: ExprEditorComponent;

  @ViewChild(ProgressBar)
  progress: ProgressBar;

  constructor(private admbSvc: AdmbService) {
  }
  selectApps(apps) {
    this.variables.apps = `{${apps.map(a => a.name).join(',')}}`;
  }

  runExpression() {
    const apps = this.variables.apps || '';
    const expr = eval('`' + this.parseResult.expr + '`');
    if (this.isValid()) {
      this.progress.mode = 'indeterminate';
      this.admbSvc.execPipelineExpression(expr, this.range)
      .subscribe(ts => {
        console.log('got results', ts);
        this.plotGroups = ts;
        this.progress.mode = 'determinate';
      });
    } else {
      console.log('not valid', this.range, this.parseResult.expr);
    }
  }

  onExprExecute(expr) {
    this.runExpression();
  }

  isValid() {
    return this.range && this.parseResult && this.parseResult.valid;
  }

  ngOnInit() {
  }

}
