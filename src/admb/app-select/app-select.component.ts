import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '../svc/model';
import { AdmbService } from '../svc/admb.service';
import { Observable } from 'rxjs';
import { SelectItemGroup } from 'primeng/api/public_api';

const toItem = (app) => ({
  label: app.name,
  value: app
});
const eaiSort = (a, b) => {
  const aeai = /(\d*)/.exec(a.name);
  const beai = /(\d*)/.exec(b.name);
  return parseInt(aeai[1]) - parseInt(beai[1]);
};

@Component({
  selector: 'admb-app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss']
})
export class AppSelectComponent implements OnInit {
  @Input() selectedApp: Application;
  @Output() selectedAppChange = new EventEmitter<Application>();

  applications: SelectItemGroup[];

  constructor(private admbSvc: AdmbService) { }

  ngOnInit() {
    this.admbSvc.listApps().subscribe(apps => {
    this.applications = [{
      label: 'System',
      items: apps.filter(a => a.type === 'SYSTEM').map(toItem)
    }, {
      label: 'APM',
      items: apps.filter(a => a.type === 'APM').sort(eaiSort).map(toItem)
    }, {
      label: 'EUM',
      items: apps.filter(a => a.type === 'EUM').sort(eaiSort).map(toItem)
    }]});
  }
}
