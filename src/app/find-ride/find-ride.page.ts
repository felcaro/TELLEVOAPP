import { Component } from '@angular/core';

@Component({
  selector: 'app-find-ride',
  templateUrl: './find-ride.page.html',
  styleUrls: ['./find-ride.page.scss'],
})
export class FindRidePage {
  // Declaración de la propiedad
  availableRides: any[] = []; // Puedes usar un tipo específico en lugar de 'any' si lo deseas

  constructor() {
    // Inicializa la propiedad, puedes llenarla con datos de una API o un arreglo estático
    this.availableRides = [
      { id: 1, destination: 'Madrid', time: '10:00 AM' },
      { id: 2, destination: 'Barcelona', time: '12:00 PM' },
      // Agrega más viajes según sea necesario
    ];
  }

  requestRide(ride: any) {
    // Implementa la lógica para solicitar un viaje
  }
}
