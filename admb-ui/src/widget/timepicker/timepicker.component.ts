import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Range } from '@admb/libmetrics/out/range';
import { OverlayPanel } from 'primeng/overlaypanel';
import { PRESETS } from './presets';
import { DurationUnit } from '@admb/libutils/out/time';

@Component({
  selector: 'admb-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnInit {
  _range: Range;
  fixedRange: Range;

  @Output()
  rangeChange = new EventEmitter<Range>(true);

  @ViewChild(OverlayPanel)
  rangesPanel: OverlayPanel;

  rangeLabel: string|Range;

  presets = PRESETS;
  beforeNowOptions = [
    {label: 'Minutes Ago', value: 'minutes'},
    {label: 'Hours Ago', value: 'hours'},
    {label: 'Days Ago', value: 'days'},
    {label: 'Weeks Ago', value: 'weeks'},
    {label: 'Months Ago', value: 'months'}
  ];
  relativeDuration:number = 5;
  relativeUnits:DurationUnit = 'minutes' 

  absoluteStart: Date;
  absoluteEnd: Date;

  constructor() {
    this.range = Range.beforeNow({"hours": 4});
  }

  @Input()
  set range(range: Range) {
    if (this._range === range) {
      return;
    }
    this._range = range;
    if (!range) {
      return;
    }
    this.fixedRange = range.fix(); // this just simplifies keeping the absolute controls in sync

    this.absoluteStart = new Date(this.fixedRange.startTime);
    this.absoluteEnd = new Date(this.fixedRange.endTime);

    const dur = range.toDuration();
    this.relativeUnits = Math.floor(dur.as('months')) > 0 ? 'months'
                        :  (Math.floor(dur.as('days')) > 0 ? 'days'
                        : (Math.floor(dur.as('hours')) > 0 ? 'hours' : 'minutes'));
    this.relativeDuration = Math.floor(dur.as(this.relativeUnits));
    this.rangeLabel = range;

    if (this.rangesPanel) {
      this.rangesPanel.hide();
    }
    this.rangeChange.emit(range);
 }
  get range(): Range {
    return this._range;
  }
  setRangeAndLabel(range: Range, label: string) {
    this.range = range;
    this.rangeLabel = label || range;
  }
  ngOnInit() {
  }

  selectPreset(preset) {
    this.setRangeAndLabel(preset.fn(), preset.label);
  }
  setRelative() {
    const d = {};
    d[this.relativeUnits] = this.relativeDuration;
    this.range = Range.beforeNow(d);
  }
  setAbsolute() {
    this.range = Range.between(this.absoluteStart.getTime(), this.absoluteEnd.getTime());
  }
  slideLeft() {
    this.range = this.range.slide("LEFT");
  }
  slideRight() {
    this.range = this.range.slide("RIGHT");
  }
  zoomIn() {
    this.range = this.range.zoom("IN");
  }
  zoomOut() {
    this.range = this.range.zoom("OUT");
  }
}

