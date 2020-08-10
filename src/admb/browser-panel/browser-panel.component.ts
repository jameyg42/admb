import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Range } from '../svc/model';
import { beforeNow } from '../../widget/timepicker/range';
import { AdmbService } from '../svc/admb.service';
import { ProgressBar } from 'primeng/progressbar';
import { AdmbParserService, ParseResult } from '../admb-parser.service';

@Component({
  selector: 'admb-browser-panel',
  templateUrl: './browser-panel.component.html',
  styleUrls: ['./browser-panel.component.scss']
})
export class BrowserPanelComponent implements OnInit {
  @Input()
  range = beforeNow(4 * 60);

  _expr: string;
  get expr(): string {
    return this._expr;
  }
  @Input()
  set expr(expr: string) {
    this._expr = expr;
    this.parseResult = this.parserSvc.parse(expr);
    this.isValid = this.range && this.parseResult && this.parseResult.valid;
    console.log(this.range, this.parseResult, this.isValid);
  }
  parseResult: ParseResult;

  variables = {} as any;
  plotGroups: any;

  isValid = false;

  @ViewChild(ProgressBar)
  progress: ProgressBar;

  constructor(private admbSvc: AdmbService, private parserSvc: AdmbParserService) {
  }

  selectApps(apps) {
    this.variables.apps = `{${apps.map(a => a.name).join(',')}}`;
  }

  runExpression() {
    const expr = this.expr;
    if (this.isValid) {
      this.progress.mode = 'indeterminate';
      this.admbSvc.execPipelineExpression(expr, this.range, this.variables)
      .subscribe(ts => {
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

  ngOnInit() {
  }

}
