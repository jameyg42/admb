import { Component, Input, OnInit } from '@angular/core';
import { AdmbParserService } from 'src/admb/admb-parser.service';
import { AdmbService } from 'src/admb/svc/admb.service';
import { Range } from 'src/widget/timepicker/range';
import { DashboardModel, DashboardWidget } from '../dashboard-model';

@Component({
  selector: 'admb-ts-widget',
  templateUrl: './ts-widget.component.html',
  styleUrls: ['./ts-widget.component.scss']
})
export class TsWidgetComponent implements OnInit {
  constructor(private admbSvc: AdmbService, private parserSvc: AdmbParserService) {
  }

  _model: DashboardWidget;
  @Input()
  set model(model: DashboardWidget) {
    this._model = model;
    this.admbSvc.execPipelineExpression(model.expr, model.range, null).subscribe(tss => {
      this.plotGroups = tss;
    });
  }
  get model() {
    return this._model;
  }
  plotGroups: any;


  ngOnInit(): void {
  }

}
