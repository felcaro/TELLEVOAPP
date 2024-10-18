import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatCarPageRoutingModule } from './chat-car-routing.module';

import { ChatCarPage } from './chat-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatCarPageRoutingModule
  ],
  declarations: [ChatCarPage]
})
export class ChatCarPageModule {}
