import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmbPanelComponent } from 'src/admb/admb.component';
import { DashboardPanelComponent } from 'src/admb/dashboard-panel/dashboard-panel.component';

const routes: Routes = [
  { path: 'admb', component: AdmbPanelComponent },
  { path: 'admb-dashboard', component: DashboardPanelComponent},
  { path: '', redirectTo: '/admb', pathMatch: 'full' }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
