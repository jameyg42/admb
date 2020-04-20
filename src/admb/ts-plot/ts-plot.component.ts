import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MetricTimeseries } from '../svc/model';
import { flatten } from 'lodash';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admb-ts-plot',
  templateUrl: './ts-plot.component.html',
  styleUrls: ['./ts-plot.component.scss']
})
export class TsPlotComponent implements OnInit {
  _timeseriesGroup: MetricTimeseries[];

  plotData: any;
  config: any;
  layout: any;

  get timeseriesGroup(): MetricTimeseries[] {
    return this._timeseriesGroup;
  }
  @Input()
  set timeseriesGroup(ts: MetricTimeseries[]) {
    this._timeseriesGroup = ts;
    this.plotData = flatten(ts.map(timeseriesToPlots));
    if (this.plotData.some(s => s.type === 'bar' && s.stackgroup)) {
      this.layout.barmode = 'stack';
    } else {
      delete this.layout.barmode;
    }
  }

  constructor() {
    this.config = {
      staticPlot: true,
      editable: false,
      displayModeBar: true,
      displaylogo: false,
      responsive: true,
      autosize: true,
    };
    this.layout =  {
      autosize: true,
      xaxis: {
        type: 'date',
        automargin: true,
      },
      yaxis: {
        rangemode: 'tozero',
        automargin: true,
      },
      yaxis2: {
        rangemode: 'tozero',
        automargin: true,
        side: 'right',
        overlaying: 'y'
      },
      margin: {
        l: 50,
        r: 20,
        t: 10,
        b: 30,
        pad: 0
      },
      showlegend: true,
      legend: {orientation: 'h'},
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
    };
  }

  ngOnInit() {
  }

}


function timeseriesToPlots(ts: MetricTimeseries) {
  const so: any = ts.plotLayout || defaultSeriesOptions;
  const vals = so.vals || ['value'];

  const all = vals.map(val => {
    const series: any = {
      name: val == 'value' ? ts.metricFullName : `${ts.metricFullName} - ${val}`,
      x: ts.data.map(dp => dp.start),
      y: ts.data.map(dp => dp[val]),
      yaxis: `y${so.yaxis}`
    };
    if (so.type === 'bar' || so.type === 'stacked-bar') {
      Object.assign(series, {
        type: 'bar'
      });
    } else if (so.type === 'area') {
      Object.assign(series, {
        type: 'statter',
        mode: 'lines',
        fill: 'tonexty',
        line: {
          shape: 'spline'
        }
      });
    } else {
      Object.assign(series, {
        type: 'scatter',
        mode: 'lines',
        line: {
          shape: 'spline'
        }
      });
    }
    if (/^stacked/.test(so.type)) {
      series.stackgroup = so.stackgroup || 1;
    }

    return series;
  });
  return all;
}

const defaultSeriesOptions = {
  type: 'line',
  yaxis: '1',
  vals: ['value']
};
