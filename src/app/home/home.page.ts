import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isDarkMode: boolean = false;
  viajesAceptados: any[] = [];
  acceptedRides: any[] = [];

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
    this.cargarViajesAceptados();
    
  }

  cargarViajesAceptados() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (currentUser) {
      const listaViajesAceptados = JSON.parse(localStorage.getItem('viajesAceptados') || '[]');

      // Filtrar los viajes aceptados por el correo del pasajero actual
      this.acceptedRides = listaViajesAceptados.filter((viaje: any) => viaje.correoPasajero === currentUser.correoElectronico);

      console.log('Viajes aceptados:', this.acceptedRides);
    }
  }

  async cancelarViaje(viaje: any) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas cancelar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Aceptar',
          handler: async () => {
            const listaViajesAceptados = JSON.parse(localStorage.getItem('viajesAceptados') || '[]');
  
            const nuevaLista = listaViajesAceptados.filter((v: any) => v.id !== viaje.id || v.correoPasajero !== viaje.correoPasajero);
  
            localStorage.setItem('viajesAceptados', JSON.stringify(nuevaLista));
  
            this.acceptedRides = nuevaLista;
  
            const successAlert = await this.alertController.create({
              header: '¡Viaje Cancelado!',
              message: 'Has cancelado el viaje exitosamente.',
              buttons: ['Cerrar'],
            });
            await successAlert.present();
          },
        },
      ],
    });
  
    await alert.present();
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