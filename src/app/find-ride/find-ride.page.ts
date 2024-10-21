import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-find-ride',
  templateUrl: './find-ride.page.html',
  styleUrls: ['./find-ride.page.scss'],
})
export class FindRidePage implements OnInit {

  viajes: any[] = [];
  listaUsuarios: any[] = [];
  mostrarModal = false;
  viajeSeleccionado: any;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarViajes();
    this.cargarUsuarios();
    this.asignarNombresChoferes();
  }

  cargarViajes() {
    // Cargar los viajes desde localStorage
    const listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
    this.viajes = listaViajes;
  }

  cargarUsuarios() {
    // Cargar la lista de usuarios desde localStorage
    this.listaUsuarios = JSON.parse(localStorage.getItem('listaUsuarios') || '[]');
  }

  asignarNombresChoferes() {
    // Asignar el nombre del chofer basado en el correo
    if (this.listaUsuarios && this.viajes) {
      this.viajes.forEach(viaje => {
        const usuario = this.listaUsuarios.find(u => u.correoElectronico === viaje.correoUsuario);
        if (usuario) {
          viaje.nombreChofer = usuario.nombreCompleto; // Asignar el nombre del chofer al viaje
        } else {
          viaje.nombreChofer = 'Desconocido'; // Si no se encuentra el usuario, asignar un valor por defecto
        }
      });
    } else {
      console.error('No se pudieron cargar los usuarios o viajes correctamente.');
    }
  }

  abrirModal(viaje: any) {
    this.viajeSeleccionado = viaje;
    this.mostrarModal = true;
  }

  async cerrarModal() {
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss();
    }
    this.mostrarModal = false;
  }

  esCreadorDelViaje(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return currentUser && currentUser.correoElectronico === this.viajeSeleccionado.correoUsuario;
  }

  async confirmarEliminacion() {
    const alert = await this.alertController.create({
      header: 'Eliminar Viaje',
      message: '¿Estás seguro que deseas eliminar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada.');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarViaje();
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarViaje() {
    const listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
    const viajeIndex = listaViajes.findIndex((v: any) => v.id === this.viajeSeleccionado.id);

    if (viajeIndex > -1) {
      listaViajes.splice(viajeIndex, 1); // Eliminar el viaje de la lista
      localStorage.setItem('listaViajes', JSON.stringify(listaViajes)); // Actualizar localStorage
      this.cargarViajes(); // Recargar la lista
      this.cerrarModal();
      console.log('Viaje eliminado.');
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'El precio del pasaje debe ser conversado con el conductor del vehículo',
      message: 'Le aconsejamos que tome como referencia los precios de los colectivos locales',
      buttons: ['Cerrar'],
    });

    await alert.present();
  }
}
