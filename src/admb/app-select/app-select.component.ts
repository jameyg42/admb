import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '../svc/model';
import { AdmbService } from '../svc/admb.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'admb-app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss']
})
export class AppSelectComponent implements OnInit {
  @Input() selectedApp: Application;
  @Output() selectedAppChange = new EventEmitter<Application>();

  applications$: Observable<Application[]>;

  constructor(private admbSvc: AdmbService) { }

  ngOnInit() {
    this.applications$ = this.admbSvc.listApps();
  }
}
