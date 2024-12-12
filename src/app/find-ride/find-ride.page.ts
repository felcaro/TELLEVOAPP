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
  viajesAceptados: any[] = [];

  isDarkMode: boolean = false;

  doRefresh(event: any) {
    console.log('Inicio de refresco');
  
    // Aquí puedes recargar los datos o realizar cualquier otra acción
    setTimeout(() => {
      console.log('Refresco completado');
      event.target.complete(); // Termina el refresco
    }, 2000); // Simula una espera de 2 segundos
  }

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
  
  navigateTo(url: string): void {
    window.location.href = url; // Esto fuerza la recarga completa
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
          console.warn(`No se encontró el usuario para el correo: ${viaje.correoUsuario}`);
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || currentUser.tipoRegistro !== 'pasajero') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Solo los pasajeros pueden aceptar un viaje.',
        buttons: ['Cerrar'],
      });
      await alert.present();
      return;
    }
  
    // Verificar si el viaje ya ha sido aceptado
    const viajeExistente = this.viajesAceptados.find((v: any) => v.id === viaje.id && v.correoPasajero === currentUser.correoElectronico);
    
    if (viajeExistente) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya has aceptado este viaje.',
        buttons: ['Cerrar'],
      });
      await alert.present();
      return;
    }
  
    if (viaje.seats > 0) {
      // Restar un asiento al viaje
      viaje.seats -= 1;
  
      // Agregar el viaje a los viajes aceptados
      this.viajesAceptados.push({
        ...viaje,
        correoPasajero: currentUser.correoElectronico, // Asegúrate de asociar al pasajero
      });
  
      // Actualizar la lista de viajes aceptados en localStorage
      let viajesAceptados = JSON.parse(localStorage.getItem('viajesAceptados') || '[]');
      viajesAceptados.push({
        ...viaje,
        correoPasajero: currentUser.correoElectronico,
      });
      localStorage.setItem('viajesAceptados', JSON.stringify(viajesAceptados));
  
      // Actualizar los viajes disponibles en localStorage
      let listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
      const viajeIndex = listaViajes.findIndex((v: any) => v.id === viaje.id);
      
      if (viajeIndex > -1) {
        listaViajes[viajeIndex].seats = viaje.seats;  // Actualizamos la cantidad de asientos
        localStorage.setItem('listaViajes', JSON.stringify(listaViajes));
      }
  
      // Mostrar confirmación
      const alert = await this.alertController.create({
        header: 'Viaje Aceptado',
        message: 'El viaje ha sido aceptado correctamente.',
        buttons: ['Cerrar'],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay asientos disponibles para este viaje.',
        buttons: ['Cerrar'],
      });
      await alert.present();
    }
  }
  
  
  
  
 puedeSolicitarViaje(): boolean {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const solicitudes = JSON.parse(localStorage.getItem('viajesSolicitados') || '[]');
  
  // Verificar si el pasajero tiene una solicitud pendiente
  return !solicitudes.some((solicitud: any) => solicitud.correoPasajero === currentUser.correoElectronico && !solicitud.aceptado);
  } 





// NO BORRAR NI TOCAR ESTAS FUNCIONES PARA ABAJO
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