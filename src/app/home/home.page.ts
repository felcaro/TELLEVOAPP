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

  // Dark mode
  private isDarkMode: boolean = false;
  showPassword: boolean = false; 

  constructor(private navCtrl: NavController) {}

  // DARK MODE NO BORRAR
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.applyTheme();
  }
  private applyTheme() {
    document.body.classList.toggle('dark', this.isDarkMode);
  }



  findRide() {
    this.navCtrl.navigateForward('/tabs/find-ride');
  }

  offerRide() {
    this.navCtrl.navigateForward('/tabs/offer-ride');
  }
}