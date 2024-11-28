import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-offer-ride',
  templateUrl: './offer-ride.page.html',
  styleUrls: ['./offer-ride.page.scss'],
})
export class OfferRidePage implements OnInit {

  isDarkMode: boolean = false;
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
    private alertCtrl: AlertController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme) {
      this.isDarkMode = JSON.parse(savedTheme);
      this.applyTheme();
    }
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  async onSubmit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // Verificar si el usuario está autenticado
    if (!currentUser) {
      return this.showAlert('Error', 'Debes iniciar sesión para crear un viaje.');
    }

    // Verificar que el usuario sea conductor
    if (currentUser.tipoRegistro !== 'conductor') {
      return this.showAlert('Acceso Denegado', 'Solo un conductor puede crear un viaje.');
    }

    // Validación de los campos del formulario
    if (!this.validateInputs()) {
      return this.showAlert('Validación Fallida', 'Por favor, completa todos los campos requeridos.');
    }

    const newRide = {
      ...this.ride,
      id: this.generateUniqueId(),
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

  validateInputs(): boolean {
    return this.ride.origin.trim() !== '' &&
           this.ride.destination.trim() !== '' &&
           this.ride.date.trim() !== '' &&
           this.ride.time.trim() !== '' &&
           this.ride.seats > 0 &&
           this.ride.price > 0;
  }

  generateUniqueId(): number {
    let currentId = parseInt(localStorage.getItem('currentRideId') || '0', 10);
    currentId++;
    localStorage.setItem('currentRideId', currentId.toString());
    return currentId;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Trate de Ingresar Datos precisos',
      message: 'Le aconsejamos que busque su direccion correcta para evitar confusiones',
      buttons: ['Cerrar'],
    });

    await alert.present();
  }
}
