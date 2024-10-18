import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatCarPage } from './chat-car.page';

const routes: Routes = [
  {
    path: '',
    component: ChatCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatCarPageRoutingModule {}
