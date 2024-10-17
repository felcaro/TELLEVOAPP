import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferRidePageRoutingModule } from './offer-ride-routing.module';

import { OfferRidePage } from './offer-ride.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferRidePageRoutingModule
  ],
  declarations: [OfferRidePage]
})
export class OfferRidePageModule {}
