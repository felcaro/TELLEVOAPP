import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nextRideDate: Date = new Date();
  nextRideTime: string = '08:00 AM';
  nextRideDriver: string = 'Juan Pérez';

  constructor(private navCtrl: NavController) {}

  findRide() {
    this.navCtrl.navigateForward('/tabs/find-ride');
  }

  offerRide() {
    this.navCtrl.navigateForward('/tabs/offer-ride');
  }
}