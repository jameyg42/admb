import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { MetricTimeseries } from '../svc/model';
import { flatten } from 'lodash';
import { PlotlyComponent } from 'angular-plotly.js';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admb-ts-plot',
  templateUrl: './ts-plot.component.html',
  styleUrls: ['./ts-plot.component.scss']
})
export class TsPlotComponent implements OnInit, OnDestroy {
  _timeseriesGroup: MetricTimeseries[];

  @ViewChild(PlotlyComponent)
  plot: PlotlyComponent;

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

  set interactive(interactive) {
    console.log('interactive', interactive);
    this.plot.config.staticPlot = !interactive;
    this.plot.updatePlot();
  }
  get interactive() {
    return !this.plot?.config.staticPlot || false;
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

  mediaChangeHandler = (print) => {
    console.log('updating for print', this.plot)
    this.plot.plotly.resize(this.plot.plotlyInstance);
  };
  ngOnInit() {
    // handle print resizing
    if (window && window.matchMedia) {
      window.matchMedia('print').addEventListener('change', this.mediaChangeHandler);
    }
  }
  ngOnDestroy() {
    if (window && window.matchMedia) {
      window.matchMedia('print').removeEventListener('change', this.mediaChangeHandler);
    }
  }
}


function timeseriesToPlots(ts: MetricTimeseries) {
  const so: any = ts.metadata.plotLayout || defaultSeriesOptions;
  const series: any = {
    name: ts.fullName,
    x: ts.data.map(dp => dp.start),
    y: ts.data.map(dp => dp.value),
    yaxis: `y${so.yaxis}`
  };
  if (so.type === 'bar' || so.type === 'stacked-bar') {
    Object.assign(series, {
      type: 'bar'
    });
  } else if (so.type === 'area') {
    Object.assign(series, {
      type: 'scatter',
      mode: 'lines',
      fill: 'tonexty',
      line: {
        shape: so.shape || 'spline'
      }
    });
  } else {
    Object.assign(series, {
      type: 'scatter',
      mode: 'lines',
      line: {
        dash: so.type === 'dashed' ? 'dash' : 'solid',
        shape: so.shape || 'spline'
      }
    });
  }
  if (/^stacked/.test(so.type)) {
    series.stackgroup = so.stackgroup || 1;
  }

  return series;
}

const defaultSeriesOptions = {
  type: 'line',
  yaxis: '1',
  vals: ['value']
};
