import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmbPanelComponent } from 'src/admb/admb.component';

const routes: Routes = [
  { path: 'admb', component: AdmbPanelComponent },
  { path: '', redirectTo: '/admb', pathMatch: 'full' }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
