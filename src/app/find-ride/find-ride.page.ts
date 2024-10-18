import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-find-ride',
  templateUrl: './find-ride.page.html',
  styleUrls: ['./find-ride.page.scss'],
})
export class FindRidePage implements OnInit {
  viajes = [
    {
      imagenAuto: 'https://via.placeholder.com/80x60?text=Auto+1',
      chofer: 'Juan Pérez',
      lugarSalida: 'Santiago Centro',
      destino: 'Valparaíso',
      fecha: '2024-09-10',
      hora: '08:00',
      asientos: 3
    },
    {
      imagenAuto: 'https://via.placeholder.com/80x60?text=Auto+2',
      chofer: 'María Gómez',
      lugarSalida: 'Providencia',
      destino: 'Viña del Mar',
      fecha: '2024-09-11',
      hora: '09:00',
      asientos: 2
    },
    {
      imagenAuto: 'https://via.placeholder.com/80x60?text=Auto+3',
      chofer: 'Luis Martínez',
      lugarSalida: 'Las Condes',
      destino: 'Rancagua',
      fecha: '2024-09-12',
      hora: '07:00',
      asientos: 1
    }
  ];

  mostrarModal = false;
  viajeSeleccionado: any;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
  }

  abrirModal(viaje: any) {
    this.viajeSeleccionado = viaje;
    this.mostrarModal = true;
  }

  async iralChat() {
    const alert = await this.alertController.create({
      header: 'Ir al Chat',
      message: '¿Estás seguro de que deseas inicar un chat con el conductor?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Ir al Chat',
          handler: () => {
            this.goChat();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'El precio del pasaje debe ser conversado con el conductor del Vehículo',
      message: 'Le aconsejamos que tome como referencia los precios de los colectivos locales',
      buttons: ['Cerrar'],
    });

    await alert.present();
  }

  async cerrarModal() {
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss();
    }
    this.mostrarModal = false;
  }

  async goChat() {
    await this.cerrarModal();
    this.router.navigate(['/chat-car']);
  }
}