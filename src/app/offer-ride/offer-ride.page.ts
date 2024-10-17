import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-offer-ride',
  templateUrl: './offer-ride.page.html',
  styleUrls: ['./offer-ride.page.scss'],
})
export class OfferRidePage {
  ride = {
    origin: '',
    destination: '',
    date: new Date().toISOString(),
    time: new Date().toISOString(),
    seats: 1,
    price: 0
  };

  constructor(private navCtrl: NavController) {}

  onSubmit() {
    console.log('Ride offered:', this.ride);
    // Aquí iría la lógica para guardar el viaje ofrecido
    // Por ahora, solo navegamos de vuelta a la página de inicio
    this.navCtrl.navigateBack('/tabs/home');
  }
}