// find-ride.page.ts
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
    const listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
    this.viajes = listaViajes;
  }

  cargarUsuarios() {
    this.listaUsuarios = JSON.parse(localStorage.getItem('listaUsuarios') || '[]');
  }

  asignarNombresChoferes() {
    if (this.listaUsuarios && this.viajes) {
      this.viajes.forEach(viaje => {
        const usuario = this.listaUsuarios.find(u => u.correoElectronico === viaje.correoUsuario);
        if (usuario) {
          viaje.nombreChofer = usuario.nombreCompleto;
        } else {
          viaje.nombreChofer = 'Desconocido';
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

  esConductor(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return currentUser && currentUser.tipoUsuario === 'conductor';
  }

  async aceptarViaje(viaje: any) {
    if (this.esConductor()) {
      alert('Solo los pasajeros pueden aceptar un viaje.');
      return;
    }

    const listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
    const viajeIndex = listaViajes.findIndex((v: any) => v.id === viaje.id);

    if (viajeIndex > -1) {
      const viajeAceptado = {
        ...viaje,
        correoUsuario: JSON.parse(localStorage.getItem('currentUser') || 'null').correoElectronico,
        aceptado: true
      };

      listaViajes[viajeIndex] = viajeAceptado;
      localStorage.setItem('listaViajes', JSON.stringify(listaViajes));

      const alert = await this.alertController.create({
        header: '¡Viaje Aceptado!',
        message: 'Has aceptado el viaje exitosamente.',
        buttons: ['Cerrar'],
      });

      await alert.present();
    }
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
      listaViajes.splice(viajeIndex, 1);
      localStorage.setItem('listaViajes', JSON.stringify(listaViajes));
      this.cargarViajes();
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