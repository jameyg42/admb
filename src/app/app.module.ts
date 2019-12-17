import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';

import { AppComponent } from './app.component';
import { AdmbModule } from 'src/admb/admb.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AdmbModule,
    ToastModule,
    TabViewModule,
    ButtonModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
