import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Range } from '../svc/model';


@Component({
  selector: 'admb-range-select',
  templateUrl: './range-select.component.html',
  styleUrls: ['./range-select.component.scss']
})
export class RangeSelectComponent implements OnInit {
  ranges = [
    {name: 'Last Hour', range: {type: 'BEFORE_NOW', durationInMinutes: 60}},
    {name: 'Last 2 Hours', range: {type: 'BEFORE_NOW', durationInMinutes: 60 * 2}},
    {name: 'Last 4 Hours', range: {type: 'BEFORE_NOW', durationInMinutes: 60 * 4}},
    {name: 'Last 12 Hours', range: {type: 'BEFORE_NOW', durationInMinutes: 60 * 12}},
    {name: 'Last 24 Hours', range: {type: 'BEFORE_NOW', durationInMinutes: 60 * 24}},
    {name: 'Last 7 Days', range: {type: 'BEFORE_NOW', durationInMinutes: 60 * 24 * 7}},
    {name: 'Last 2 Weeks', range: {type: 'BEFORE_NOW', durationInMinutes: 60 * 24 * 14}},
    {name: 'Last 1 Month', range: {type: 'BEFORE_NOW', durationInMinutes: 60 * 24 * 30}},
    {name: 'Last 3 Months', range: {type: 'BEFORE_NOW', durationInMinutes: 60 * 24 * 180}},
  ];
  selectedRangeOption;

  _selectedRange: Range;
  @Input()
  set selectedRange(range: Range) {
    this._selectedRange = range;
    if (range) {
      this.selectedRangeOption = this.ranges.filter(r => r.range.durationInMinutes === range.durationInMinutes).shift();
    } else {
      this.selectedRangeOption = null;
    }
    this.selectedRangeChange.emit(range);
  }
  get selectedRange(): Range {
    return this._selectedRange;
  }

  @Output()
  selectedRangeChange = new EventEmitter<Range>();

  constructor() {
  }
  ngOnInit() {
    const self = this;
    setTimeout(() => {
      if (!self.selectedRange) {
        self.selectedRange = self.ranges[0].range;
      }
    }, 0);
  }
}
