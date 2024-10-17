import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferRidePage } from './offer-ride.page';

const routes: Routes = [
  {
    path: '',
    component: OfferRidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferRidePageRoutingModule {}
