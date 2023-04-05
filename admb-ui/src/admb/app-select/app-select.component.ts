import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '../svc/model';
import { AdmbService } from '../svc/admb.service';
import { SelectItem } from 'primeng/api/public_api';

@Component({
  selector: 'admb-app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss']
})
export class AppSelectComponent implements OnInit {
  @Input() selectedApps: Application[];
  @Output() selectedAppsChange = new EventEmitter<Application[]>();

  applications: SelectItem[];

  constructor(private admbSvc: AdmbService) { }

  ngOnInit() {
    this.admbSvc.listApps().subscribe(apps => {
      this.applications = apps.sort(eaiSort).map(toItem);
    });
  }
}

const toItem = (app) => ({
  label: app.name,
  value: app
}) as SelectItem;
const eaiSort = (a, b) => {
  const aeai = /(\d*)/.exec(a.name);
  const beai = /(\d*)/.exec(b.name);
  return parseInt(aeai[1]) - parseInt(beai[1]);
};
