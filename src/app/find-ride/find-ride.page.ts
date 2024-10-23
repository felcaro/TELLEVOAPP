// find-ride.page.ts
import { Component, OnInit, Renderer2 } from '@angular/core';
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

  isDarkMode: boolean = false;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.cargarViajes();
    this.cargarUsuarios();
    this.asignarNombresChoferes();

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

  irADetalleViaje(id: number) {
    const viajeSeleccionado = this.viajes.find(v => v.id === id);
    if (viajeSeleccionado) {
      localStorage.setItem('viajeSeleccionado', JSON.stringify(viajeSeleccionado));
      this.router.navigate(['/detalle-viaje']);
    }
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
    return currentUser && currentUser.tipoRegistro === 'conductor';
  }





  async aceptarViaje(viaje: any) {
    // Obtén el currentUser desde localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
    // Verifica que el currentUser exista y que sea un pasajero
    if (!currentUser || currentUser.tipoRegistro !== 'pasajero') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Solo los pasajeros pueden aceptar un viaje.',
        buttons: ['Cerrar'],
      });
      await alert.present();
      return;
    }
  
    // Cargar la lista de viajes aceptados desde localStorage
    const listaViajesAceptados = JSON.parse(localStorage.getItem('viajesAceptados') || '[]');
  
    // Verifica si el pasajero ya ha aceptado este viaje (filtrando por ID de viaje y correo del pasajero)
    const yaAceptado = listaViajesAceptados.some((v: any) => v.id === viaje.id && v.correoPasajero === currentUser.correoElectronico);
  
    if (yaAceptado) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya has aceptado este viaje.',
        buttons: ['Cerrar'],
      });
      await alert.present();
      return;
    }
  
    // Guardar el viaje aceptado en la lista de viajes aceptados del pasajero
    const nuevoViajeAceptado = {
      ...viaje,
      correoPasajero: currentUser.correoElectronico
    };
    listaViajesAceptados.push(nuevoViajeAceptado);
  
    // Guardar la lista de viajes aceptados actualizada en localStorage
    localStorage.setItem('viajesAceptados', JSON.stringify(listaViajesAceptados));
  
    // Mostrar mensaje de confirmación
    const alert = await this.alertController.create({
      header: '¡Viaje Aceptado!',
      message: 'Has aceptado el viaje exitosamente.',
      buttons: ['Cerrar'],
    });
    await alert.present();
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
      header: 'Trate de tomar un viaje de acuerdo a sus Circunstancias',
      message: 'Le aconsejamos que tome como referencia los viajes que pasen cerca de su Localizacion',
      buttons: ['Cerrar'],
    });

    await alert.present();
  }
}