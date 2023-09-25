import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { MetricTimeseries, MetricTimeseriesGroup } from '../svc/model';
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
  set timeseriesGroup(tss: MetricTimeseries[]) {
    this._timeseriesGroup = tss;
    this.plotData = flatten(tss.map(timeseriesToPlots));
    if (this.plotData.some(s => s.type === 'bar' && s.stackgroup)) {
      this.layout.barmode = 'stack';
    } else {
      delete this.layout.barmode;
    }
  }

  set interactive(interactive) {
    this.plot.config.staticPlot = !interactive;
    this.plot.updatePlot();
  }
  get interactive() {
    return !this.plot?.config.staticPlot || false;
  }

  private _hideWeekends = false;
  private hideWeekendsBounds =  {bounds:["sat", "mon"]};
  set hideWeekends(hide:boolean) {
    this._hideWeekends = hide;
    let breaks = this.layout.xaxis.rangebreaks || [];
    if (hide) {
      breaks.push(this.hideWeekendsBounds);
    } else {
      breaks = breaks.filter(b => b !== this.hideWeekendsBounds);
    }
    this.layout.xaxis.rangebreaks = breaks;
    this.plot.updatePlot();
  }
  get hideWeekends(): boolean {
    return this._hideWeekends;
  }
  private _hideNonWorkHours= false;
  private hideNonWorkHoursBounds =  {bounds:[18,8], pattern:"hour"};
  set hideNonWorkHours(hide:boolean) {
    this._hideNonWorkHours = hide;
    let breaks = this.layout.xaxis.rangebreaks || [];
    if (hide) {
      breaks.push(this.hideNonWorkHoursBounds);
      if (!this.hideWeekends) {
        breaks.push(this.hideWeekendsBounds);
      }      
    } else {
      breaks = breaks.filter(b => b !== this.hideNonWorkHoursBounds);
      if (!this.hideWeekends) {
        breaks = breaks.filter(b => b !== this.hideWeekendsBounds);
      }
    }
    this.layout.xaxis.rangebreaks = breaks;
    this.plot.updatePlot();
  }
  get hideNonWorkHours(): boolean {
    return this._hideNonWorkHours;
  }


  constructor() {
    this.config = {
      staticPlot: false,
      editable: false,
      displayModeBar: true,
      displaylogo: false,
      doubleClickDelay: 400
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
      legend: {
        orientation: 'h',
        itemclick: 'toggleothers',
        itemdoubleclick: 'toggle'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      hoverlabel: {
        align: 'left',
        namelength: -1,
        font: {
          size: 12
        }
      },
      hovermode: 'closest'
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
  const so: any = ts.metadata.plot || defaultSeriesOptions;
  const series: any = {
    name: ts.fullName,
    truncatedName: smartTruncate(ts),
    valueName: `${ts.name}`,
    valueType: ts.value === 'value' ? '' : `[${ts.value}]`,
    x: ts.data.map(dp => dp.start),
    y: ts.data.map(dp => dp.value),
    yaxis: `y${so.yaxis}`,
    hovertemplate: '<b>%{y:,d}</b> - %{data.valueName} %{data.valueType}<br>%{data.truncatedName}<extra><b>%{x|%H:%M}</b></extra>'
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

function smartTruncate(ts:MetricTimeseries):string {
  // actually kindof dumb...for now
  const maxLength = 120;

  let s = ts.fullName;
  if (s.length <= maxLength) return s;

  s = s.replace(`[${ts.value}]`, '');
  if (s.length <= maxLength) return s;

  s = s.replace('|'+ts.name, '').replace(ts.name, '');
  if (s.length <= maxLength) return s;

  return `${s.substring(0, Math.floor((maxLength/2)-3))}...${s.substring(s.length - Math.floor((maxLength/2)))}`;
}