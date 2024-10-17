import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  name: string = '';     // Inicializado con un string vacío
  email: string = '';    // Inicializado con un string vacío
  password: string = ''; // Inicializado con un string vacío

  constructor() { }

  onRegister() {
    // Aquí iría la lógica para el registro (envío a backend, validaciones, etc.)
    console.log('Registrando usuario:', this.name, this.email);
  }
}
