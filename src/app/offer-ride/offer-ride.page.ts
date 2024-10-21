import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-offer-ride',
  templateUrl: './offer-ride.page.html',
  styleUrls: ['./offer-ride.page.scss'],
})
export class OfferRidePage {
  ride = {
    origin: '',
    destination: '',
    date: '',
    time: '',
    seats: 1,
    price: 0
  };

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  async onSubmit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
      return this.showAlert('Error', 'Debes iniciar sesión para crear un viaje.');
    }

    if (currentUser.tipoRegistro !== 'conductor') {
      return this.showAlert('Acceso Denegado', 'Solo un conductor puede crear un viaje.');
    }

    const newRide = {
      ...this.ride,
      id: this.generateUniqueId(currentUser.correoElectronico),
      correoUsuario: currentUser.correoElectronico
    };

    const listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
    listaViajes.push(newRide);
    localStorage.setItem('listaViajes', JSON.stringify(listaViajes));

    const confirmAlert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Deseas confirmar la creación del viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Creación de viaje cancelada.');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            console.log('Viaje ofrecido:', newRide);
            this.navCtrl.navigateBack('/tabs/home');
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  generateUniqueId(email: string): string {
    return email + '_' + Date.now(); // ID único basado en el correo y timestamp
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
