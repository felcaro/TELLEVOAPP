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

    // Verificar si las contraseñas coinciden
    if (this.contrasena !== this.confirmarContrasena) {
      console.log('Error: Las contraseñas no coinciden.');
      this.mostrarAlerta('Las contraseñas no coinciden.');
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
      console.log('Error: El correo electrónico ya está registrado.');
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


