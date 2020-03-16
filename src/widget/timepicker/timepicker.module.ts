import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TimepickerComponent } from './timepicker.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {TabViewModule} from 'primeng/tabview';
import {SpinnerModule} from 'primeng/spinner';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';


@NgModule({
  declarations: [
    TimepickerComponent
  ],
  exports: [
    TimepickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SpinnerModule,
    DropdownModule,
    CalendarModule,
    OverlayPanelModule,
    TabViewModule,
  ]
})
export class TimepickerModule { }
