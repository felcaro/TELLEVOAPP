import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit{

  // Variables usuario
  nombreCompleto: string = '';
  correoElectronico: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  tipoRegistro: string = '';


  isDarkMode: boolean = false;
  sw: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private renderer: Renderer2
  ) { }


  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error de registro',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme) {
      this.isDarkMode = JSON.parse(savedTheme);
      this.applyTheme();
    }
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.applyTheme();
  }

  // Método de registro
  register() {
    console.log('Intentando registrar al usuario...');
  
    // Validación de formato (Correo Electrónico)
    const correoValido = this.validateEmail(this.correoElectronico);
    if (!correoValido) {
      this.mostrarAlerta('El correo electrónico debe tener un formato válido (ejemplo@dominio.com).');
      return;
    }
  
    // Validación de formato (Contraseña)
    if (this.contrasena.length < 8) {
      this.mostrarAlerta('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
  
    // Validación de contraseñas coincidentes
    if (this.contrasena !== this.confirmarContrasena) {
      this.mostrarAlerta('Las contraseñas no coinciden.');
      return;
    }
  
    // Verificar si los campos están vacíos
    if (!this.nombreCompleto || !this.correoElectronico || !this.contrasena || !this.confirmarContrasena || !this.tipoRegistro) {
      this.mostrarAlerta('Todos los campos son obligatorios.');
      return;
    }
  
    // Obtener los datos actuales de localStorage
    const storedData = localStorage.getItem('listaUsuarios');
    let listaUsuarios = storedData ? JSON.parse(storedData) : [];
  
    // Verificar si el correo ya está registrado
    const usuarioExistente = listaUsuarios.find((user: { correoElectronico: string }) =>
      user.correoElectronico === this.correoElectronico
    );
  
    if (usuarioExistente) {
      this.mostrarAlerta('El correo electrónico ya está registrado.');
      return;
    }
  
    // Datos del nuevo usuario a registrar
    const nuevoUsuario = {
      nombreCompleto: this.nombreCompleto,
      correoElectronico: this.correoElectronico,
      contrasena: this.contrasena,
      tipoRegistro: this.tipoRegistro
    };
  
    // Agregar el nuevo usuario a la lista de usuarios
    listaUsuarios.push(nuevoUsuario);
  
    // Guardar la lista actualizada en localStorage
    localStorage.setItem('listaUsuarios', JSON.stringify(listaUsuarios));
  
    console.log('Usuario registrado correctamente:', nuevoUsuario);
    console.log('Lista actualizada de usuarios:', listaUsuarios);
  
    this.router.navigate(['/login']);
  }
  
  // Función de validación del correo
  validateEmail(correo: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(correo);
  }


  togglePasswordVisibility() {
    this.sw = !this.sw; 
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  gologIn() {
    this.router.navigate(['/login']);
  }

}


