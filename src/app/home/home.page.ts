import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  // DARK MODE NO BORRAR
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.applyTheme();
  }
  private applyTheme() {
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  async borrarUsuarios() {
    const alert = await this.alertController.create({
      header: 'Eliminar Usuarios',
      message: '¿Estás seguro de que deseas eliminar todos los usuarios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación de usuarios cancelada.');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            localStorage.removeItem('usuarios');
            console.log('Todos los usuarios han sido eliminados.');
          }
        }
      ]
    });
  
    await alert.present();
  }


  mostrarListaUsuarios() {
    const storedData = JSON.parse(localStorage.getItem('listaUsuarios') || '[]');
    
    console.log('Lista de Usuarios:', storedData);
  }

  findRide() {
    this.navCtrl.navigateForward('/tabs/find-ride');
  }

  offerRide() {
    this.navCtrl.navigateForward('/tabs/offer-ride');
  }
}