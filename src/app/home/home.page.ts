import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isDarkMode: boolean = false;
  viajesSolicitados: any[] = [];  // Viajes solicitados pendientes
  acceptedRides: any[] = [];      // Viajes aceptados por el conductor
  viajesCreados: any[] = [];
  solicitudesPendientes: any[] = [];
  viajesAceptados: any[] = [];

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme) {
      this.isDarkMode = JSON.parse(savedTheme);
      this.applyTheme();
    }
    
    this.cargarViajesCreados();
    this.cargarViajesAceptados();
  }

  cargarViajesCreados() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
    // Verificar si hay un usuario logueado y si es conductor
    if (currentUser && currentUser.tipoRegistro === 'conductor') {
      const listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
  
      // Filtrar los viajes creados por el conductor actual
      this.viajesCreados = listaViajes.filter(
        (viaje: any) => viaje.correoUsuario === currentUser.correoElectronico
      );
      console.log('Viajes Creados:', this.viajesCreados);  // Verifica si los viajes se cargan correctamente
    } else {
      console.log('No se encuentra un conductor o el usuario no está autenticado.');
    }
  }

  cargarViajesAceptados() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.tipoRegistro === 'pasajero') {
      const listaViajesAceptados = JSON.parse(localStorage.getItem('viajesAceptados') || '[]');
      this.viajesAceptados = listaViajesAceptados.filter((viaje: any) => viaje.correoPasajero === currentUser.correoElectronico);
      console.log('Viajes Aceptados:', this.viajesAceptados);  // Verifica si los viajes aceptados se cargan correctamente
    } else {
      console.log('No se encuentra un pasajero o el usuario no está autenticado.');
    }
  }

  // Confirmar y borrar el viaje
  async confirmarBorrar(viaje: any) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.borrarViaje(viaje);
          },
        },
      ],
    });

    await alert.present();
  }

  // Borrar el viaje de la lista y actualizar en localStorage
  borrarViaje(viaje: any) {
    const listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');

    // Filtrar los viajes y eliminar el viaje específico
    const nuevosViajes = listaViajes.filter((item: any) => item.id !== viaje.id);

    // Actualizar los viajes en localStorage
    localStorage.setItem('listaViajes', JSON.stringify(nuevosViajes));

    // Actualizar el array de viajes creados en la vista
    this.viajesCreados = nuevosViajes.filter(
      (viaje: any) => viaje.correoUsuario === JSON.parse(localStorage.getItem('currentUser') || 'null').correoElectronico
    );

    console.log('Viaje eliminado:', viaje);
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  

  async eliminarViaje() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
    if (!currentUser || currentUser.tipoRegistro !== 'pasajero') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Solo los pasajeros pueden eliminar un viaje aceptado.',
        buttons: ['Cerrar'],
      });
      await alert.present();
      return;
    }
  
    // Obtener la lista de viajes aceptados del localStorage
    const viajesAceptados = JSON.parse(localStorage.getItem('viajesAceptados') || '[]');
  
    // Pide al usuario que seleccione un viaje, o asumimos que el viaje a eliminar es el primero
    const viaje = viajesAceptados[0]; // O puedes poner tu lógica aquí para seleccionar el viaje
  
    const viajeIndex = viajesAceptados.findIndex((v: any) => v.id === viaje.id && v.correoPasajero === currentUser.correoElectronico);
  
    if (viajeIndex === -1) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se encontró este viaje en tus viajes aceptados.',
        buttons: ['Cerrar'],
      });
      await alert.present();
      return;
    }
  
    // Confirmar si el usuario desea eliminar el viaje
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este viaje aceptado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Eliminar el viaje de la lista de viajes aceptados
            viajesAceptados.splice(viajeIndex, 1);
            localStorage.setItem('viajesAceptados', JSON.stringify(viajesAceptados));
  
            // Restaurar el número de asientos del viaje en la lista de viajes disponibles
            const listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
            const viajeOriginalIndex = listaViajes.findIndex((v: any) => v.id === viaje.id);
  
            if (viajeOriginalIndex > -1) {
              listaViajes[viajeOriginalIndex].seats += 1;  // Aumentar asientos
              listaViajes[viajeOriginalIndex].visible = true; // Hacer visible nuevamente el viaje
              localStorage.setItem('listaViajes', JSON.stringify(listaViajes));
            }
  
            // Notificar al usuario que el viaje ha sido eliminado
            this.alertController.create({
              header: 'Viaje Eliminado',
              message: 'El viaje aceptado ha sido eliminado correctamente.',
              buttons: ['Cerrar'],
            }).then(alert => alert.present());
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async cancelarViaje(viaje: any) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser || currentUser.tipoRegistro !== 'pasajero') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Solo los pasajeros pueden cancelar un viaje aceptado.',
        buttons: ['Cerrar'],
      });
      await alert.present();
      return;
    }
  
    // Verificar si el viaje está en la lista de viajes aceptados del usuario
    const viajeIndex = this.viajesAceptados.findIndex((v: any) => v.id === viaje.id && v.correoPasajero === currentUser.correoElectronico);
    
    if (viajeIndex === -1) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se ha encontrado este viaje en tus viajes aceptados.',
        buttons: ['Cerrar'],
      });
      await alert.present();
      return;
    }
  
    // Eliminar el viaje de la lista de viajes aceptados
    this.viajesAceptados.splice(viajeIndex, 1);
  
    // Actualizar la lista de viajes aceptados en localStorage
    let viajesAceptados = JSON.parse(localStorage.getItem('viajesAceptados') || '[]');
    viajesAceptados = viajesAceptados.filter((v: any) => v.id !== viaje.id || v.correoPasajero !== currentUser.correoElectronico);
    localStorage.setItem('viajesAceptados', JSON.stringify(viajesAceptados));
  
    // Devolver un asiento al viaje en la lista de viajes disponibles
    let listaViajes = JSON.parse(localStorage.getItem('listaViajes') || '[]');
    const viajeOriginalIndex = listaViajes.findIndex((v: any) => v.id === viaje.id);
    
    if (viajeOriginalIndex > -1) {
      listaViajes[viajeOriginalIndex].seats += 1;  // Sumar 1 al número de asientos disponibles
      listaViajes[viajeOriginalIndex].visible = true;  // Asegurarse de que el viaje siga siendo visible
      localStorage.setItem('listaViajes', JSON.stringify(listaViajes));
    }
  
    // Mostrar mensaje de éxito
    const alert = await this.alertController.create({
      header: 'Viaje Cancelado',
      message: 'El viaje ha sido cancelado correctamente y el asiento ha sido devuelto.',
      buttons: ['Cerrar'],
    });
    await alert.present();
  }
  


  // DE AQUI PARA ABAJO NO BORRAR NI EDITAR +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Cambiar el tema de la aplicación (oscuro/claro)
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

  // Navegar a la página de "Find Ride"
  findRide() {
    this.navCtrl.navigateForward('/tabs/find-ride');
  }

  // Navegar a la página de "Offer Ride"
  offerRide() {
    this.navCtrl.navigateForward('/tabs/offer-ride');
  }

  mostrarDatosLocalStorage() {
    console.log('currentUser:', JSON.parse(localStorage.getItem('currentUser') || 'null'));
    console.log('solicitudesViaje:', JSON.parse(localStorage.getItem('solicitudesViaje') || '[]'));
    console.log('viajesDisponibles:', JSON.parse(localStorage.getItem('viajesDisponibles') || '[]'));
    console.log('viajesAceptados:', JSON.parse(localStorage.getItem('viajesAceptados') || '[]'));
    console.log('listaViajes:', JSON.parse(localStorage.getItem('listaViajes') || '[]'));
  }

  limpiarViajesSolicitados() {
    // Limpiar el localStorage
    localStorage.setItem('solicitudesViaje', JSON.stringify([]));

    // Actualizar la lista en la vista
    this.viajesSolicitados = [];

    // Mostrar un mensaje de confirmación
    this.alertController.create({
      header: 'Solicitudes Eliminadas',
      message: 'Todas las solicitudes de viaje han sido eliminadas.',
      buttons: ['Cerrar']
    }).then(alert => alert.present());
  }

  limpiarViajesSolicitadosYAceptados() {
    // Limpiar las solicitudes de viaje en el localStorage
    localStorage.setItem('solicitudesViaje', JSON.stringify([]));

    // Limpiar los viajes aceptados en el localStorage
    localStorage.setItem('viajesAceptados', JSON.stringify([]));

    // Actualizar las listas en la vista
    this.viajesSolicitados = [];
    this.acceptedRides = [];

    // Mostrar un mensaje de confirmación
    this.alertController.create({
      header: 'Datos Limpiados',
      message: 'Se han limpiado todas las solicitudes y los viajes aceptados.',
      buttons: ['Cerrar']
    }).then(alert => alert.present());
  }


}
