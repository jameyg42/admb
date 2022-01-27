import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { beforeNow } from '../../widget/timepicker/range';
import { AdmbService } from '../svc/admb.service';
import { AdmbParserService, ParseResult } from '../admb-parser.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  }
  parseResult: ParseResult;

  variables = {} as any;
  plotGroups: any;

  isValid = false;

  isRunning = false;

  constructor(private admbSvc: AdmbService, private parserSvc: AdmbParserService, private router: Router, private route: ActivatedRoute) {
    const state = this.route.snapshot.queryParams;
    this.expr = state.ex || '';
    if (state.r) {
      this.range = JSON.parse(state.r);
    }
  }

  selectApps(apps) {
    this.variables.apps = `{${apps.map(a => a.name).join(',')}}`;
  }

  runExpression() {
    const expr = this.expr;
    if (this.isValid) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          ex: expr,
          r: JSON.stringify(this.range)
        }
      });
      this.isRunning = true;
      this.admbSvc.execPipelineExpression(expr, this.range, this.variables)
      .subscribe({
        next: ts => {
          this.plotGroups = ts;
        },
        complete : () => {
          this.isRunning = false;
        }
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
