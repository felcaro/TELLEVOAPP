import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  // Variables usuario
  usuario: string = '';
  nombreCompleto: string = '';
  correoElectronico: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  tipoRegistro: string = '';

  sw: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController
  ) { }


  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error de registro',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  register() {
    console.log('Intentando registrar al usuario...');

    // Verificar si las contraseñas coinciden
    if (this.contrasena !== this.confirmarContrasena) {
      console.log('Error: Las contraseñas no coinciden.');
      this.mostrarAlerta('Las contraseñas no coinciden.');
      return;
    }

    // Datos del usuario a almacenar
    const userData = {
      nombreCompleto: this.nombreCompleto,
      correoElectronico: this.correoElectronico,
      contrasena: this.contrasena,
      tipoRegistro: this.tipoRegistro
    };

    // Obtener los datos actuales de localStorage
    const storedData = localStorage.getItem('registroUsuario');
    if (storedData) {
      const existingUser = JSON.parse(storedData);

      if (existingUser.correoElectronico === this.correoElectronico) {
        console.log('Error: El correo electrónico ya existe.');
        this.mostrarAlerta('El correo electrónico ya existe.');
        return;
      }
    }

    console.log('Datos capturados del formulario:', userData);

    // Almacenar los datos en localStorage
    localStorage.setItem('registroUsuario', JSON.stringify(userData));
    console.log('Datos registrados correctamente en localStorage.');

    // Verificar si los datos fueron almacenados en localStorage correctamente
    const storedDataAfterRegister = localStorage.getItem('registroUsuario');
    if (storedDataAfterRegister) {
      console.log('Datos en localStorage:', JSON.parse(storedDataAfterRegister));
    } else {
      console.log('Error: No se encontraron datos en localStorage.');
    }

    // this.router.navigate(['/tabs/home']);
  }
  
  
  togglePasswordVisibility() {
    this.sw = !this.sw; 
  }

  goHome() {
    this.router.navigate(['/tabs/home']);
  }

  gologIn() {
    this.router.navigate(['/login']);
  }

}
