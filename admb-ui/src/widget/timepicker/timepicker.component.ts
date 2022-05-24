import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {Range, between, beforeNow, zoom, slide, fix} from './range';
import { OverlayPanel } from 'primeng/overlaypanel';

import * as moment from 'moment';
import { PRESETS } from './presets';
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
  relativeDuration = 5;
  relativeUnits = 'minutes' as moment.DurationInputArg2;

  absoluteStart: Date;
  absoluteEnd: Date;

  constructor() {
    this.range = beforeNow(moment.duration(4, 'hours'));
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
    this.fixedRange = fix(range); // this just simplifies keeping the absolute controls in sync

    this.absoluteStart = new Date(this.fixedRange.startTime);
    this.absoluteEnd = new Date(this.fixedRange.endTime);

    const dur = moment.duration(new Date().getTime() - this.fixedRange.startTime, 'ms');
    this.relativeUnits = Math.floor(dur.asMonths()) > 0 ? 'months'
                        :  (Math.floor(dur.asDays()) > 0 ? 'days'
                        : (Math.floor(dur.asHours()) > 0 ? 'hours' : 'minutes'));
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
    const d = moment.duration(this.relativeDuration, this.relativeUnits);
    this.range = beforeNow(d);
  }
  setAbsolute() {
    this.range = between(this.absoluteStart.getTime(), this.absoluteEnd.getTime());
  }

  getShiftMagnitude(): number {
    // how much we shift depends on the size of the range - larger ranges shift more
    const r = this.fixedRange;
    const d = moment.duration(moment(r.endTime).diff(moment(r.startTime)));
    const m = Math.floor(d.asMinutes() * .25);
    return m;
  }
  slideLeft() {
    const m = this.getShiftMagnitude();
    this.range = slide(this.range, -m);
  }
  slideRight() {
    const m = this.getShiftMagnitude();
    this.range = slide(this.range, m);
  }
  zoomIn() {
    const m = Math.floor(this.getShiftMagnitude()  / 2);
    this.range = zoom(this.range, -m);
  }
  zoomOut() {
    const m = Math.min(Math.floor(this.getShiftMagnitude() / 2), 5);
    this.range = zoom(this.range, m);
  }
}

