import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindRidePageRoutingModule } from './find-ride-routing.module';

import { FindRidePage } from './find-ride.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindRidePageRoutingModule
  ],
  declarations: [FindRidePage]
})
export class FindRidePageModule {}
