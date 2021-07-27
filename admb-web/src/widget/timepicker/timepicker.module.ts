import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TimepickerComponent } from './timepicker.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RangePipe } from './range.pipe';


@NgModule({
  declarations: [
    TimepickerComponent,
    RangePipe,
  ],
  exports: [
    TimepickerComponent,
    RangePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    OverlayPanelModule,
    TabViewModule,
  ]
})
export class TimepickerModule { }
