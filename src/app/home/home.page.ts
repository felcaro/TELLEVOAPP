import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nextRideDate: Date = new Date();
  nextRideTime: string = '08:00 AM';
  nextRideDriver: string = 'Juan Pérez';
  isDarkMode: boolean = false;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme) {
      this.isDarkMode = JSON.parse(savedTheme);
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
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
            localStorage.removeItem('listaUsuarios');
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