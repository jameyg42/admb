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

  @Input()
  range: Range;
  fixedRange: Range;

  @Output()
  rangeChange = new EventEmitter<Range>(true);

  @ViewChild(OverlayPanel, {static: false})
  rangesPanel: OverlayPanel;

  rangeLabel: string;

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
  }
  ngOnInit() {
    this.setRange(this.range || beforeNow(moment.duration(4, 'hours')));
  }
  setRange(range: Range, label?: string) {
    this.range = range;
    this.fixedRange = fix(range); // this just simplifies keeping the absolute controls in sync
    this.rangeChange.emit(range);
    this.rangeLabel = label || formatRange(range);

    this.absoluteStart = new Date(this.fixedRange.startTime);
    this.absoluteEnd = new Date(this.fixedRange.endTime);

    const dur = moment.duration(new Date().getTime() - this.fixedRange.startTime, 'ms');
    this.relativeUnits = Math.floor(dur.asMonths()) > 0 ? 'months' :  (Math.floor(dur.asDays()) > 0 ? 'days' : (Math.floor(dur.asHours()) > 0 ? 'hours' : 'minutes'));
    this.relativeDuration = Math.floor(dur.as(this.relativeUnits));

    this.rangesPanel && this.rangesPanel.hide();
  }

  selectPreset(preset) {
    this.setRange(preset.fn(), preset.label);
  }
  setRelative() {
    const d = moment.duration(this.relativeDuration, this.relativeUnits);
    this.setRange(beforeNow(d));
  }
  setAbsolute() {
    this.setRange(between(this.absoluteStart.getTime(), this.absoluteEnd.getTime()));
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
    this.setRange(slide(this.range, -m));
  }
  slideRight() {
    const m = this.getShiftMagnitude();
    this.setRange(slide(this.range, m));
  }
  zoomIn() {
    const m = Math.floor(this.getShiftMagnitude()  / 2);
    this.setRange(zoom(this.range, -m));
  }
  zoomOut() {
    const m = Math.min(Math.floor(this.getShiftMagnitude() / 2), 5);
    this.setRange(zoom(this.range, m));
  }

}

function formatRange(r: Range) {
  if (r.type === 'BEFORE_NOW') {
    const d = moment.duration(r.durationInMinutes, 'minutes');
    return d.humanize();
  }
  return `${moment(r.startTime).format('L LT')} to ${moment(r.endTime).format('L LT')}`;
}

