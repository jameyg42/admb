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
  app: Application;

  @Output()
  appChange = new EventEmitter<Application>();

  range: Range;

  parseResult: ParseResult;

  plotGroups: any;

  @ViewChild(ExprEditorComponent)
  editor: ExprEditorComponent;

  @ViewChild(ProgressBar)
  progress: ProgressBar;

  constructor(private admbSvc: AdmbService, private historyService: HistoryService) {
    historyService.historySelect$.subscribe(evt => {
      if (evt.range) this.range = evt.range;
      if (evt.app) this.app = evt.app;
      this.editor.expr = evt.expr;
      this.editor._onModelChange(evt.expr);
    });
  }

  runExpression() {
    if (this.isValid()) {
      this.progress.mode = 'indeterminate';
      this.admbSvc.execPipelineExpression(this.parseResult.expr, this.app, this.range)
      .subscribe(ts => {
        console.log('got results', ts);
        this.plotGroups = ts;
        this.progress.mode = 'determinate';
      });
    } else {
      console.log('not valid', this.app, this.range, this.parseResult.expr);
    }
  }

  onExprExecute(expr) {
    this.runExpression();
  }

  isValid() {
    return this.app && this.range && this.parseResult && this.parseResult.valid;
  }

  ngOnInit() {
  }

}
