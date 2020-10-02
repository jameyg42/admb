import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Range } from 'src/widget/timepicker/range';
import { DashboardModel, DashboardWidget } from './dashboard-model';
import { isArray } from 'lodash';
import 'codemirror/mode/javascript/javascript.js';

@Component({
  selector: 'admb-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent implements OnInit {
  dashboardJson: string;
  dashboardModel: DashboardModel;
  dashboardError: string;
  globalRange: Range;

  editMode = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.dashboardJson = route.snapshot.queryParams.r;
    this.fromDashboardJson(this.dashboardJson);
  }
  doneEditing() {
    this.editMode = false;
    this.fromDashboardJson(this.dashboardJson);
  }
  fromDashboardJson(dashboardJson: string) {
    try {
      let model = JSON.parse(dashboardJson);
      model = isArray(model) ? { widgets: model } : model;
      model.widgets.forEach(w => {
        if (!w.expr) {
          throw new Error('missing expr');
        }
        w.type = 'ts';
        w.range = w.range || model.range || this.globalRange;
        w.vars = w.vars || model.vars || {};
        w.cols = w.cols || 4;
      });
      this.dashboardModel = model;
      this.dashboardError = null;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          r: dashboardJson
        }
      });
    } catch (e) {
      this.dashboardError = `Invalid Report JSON : ${e}`;
      this.dashboardModel = null;
    }
  }
  fixup() {
    try {
      var t;
      eval('t = ' + this.dashboardJson);
      this.dashboardJson = JSON.stringify(t, null, 2);
      this.dashboardError = null;
    }
    catch (e) {
      this.dashboardError = `Invalid report JSON: ${e}`;
    }
  }


  ngOnInit(): void {
  }

}
