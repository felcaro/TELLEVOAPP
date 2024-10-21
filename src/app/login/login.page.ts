import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private isDarkMode: boolean = false;

  correoElectronico: string = '';
  contrasena: string = '';

  sw: boolean = false;

  constructor(
    private router: Router
  ) 
    {   
      const savedTheme = localStorage.getItem('isDarkMode');
      if (savedTheme) {
        this.isDarkMode = JSON.parse(savedTheme);
        this.applyTheme();
      }

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          console.log('Navegación a:', this.router.url);
        }
      });
    }

  onSubmit() {
  }


  togglePasswordVisibility() {
    this.sw = !this.sw; 
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  private mostrarAlerta(mensaje: string) {
    console.log(mensaje); 
  }

  goHome() {
    this.router.navigate(['/tabs/home']);
  }

  // DARK MODE NO BORRAR
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.applyTheme();
  }

  private applyTheme() {
    document.body.classList.toggle('dark', this.isDarkMode);
  }
  
  logIn() {
    console.log('Intentando iniciar sesión...');

    const storedData = localStorage.getItem('listaUsuarios');
    if (storedData) {
      const listaUsuarios = JSON.parse(storedData);

      const usuarioEncontrado = listaUsuarios.find(
        (user: { correoElectronico: string; contrasena: string }) =>
          user.correoElectronico === this.correoElectronico && user.contrasena === this.contrasena
      );

      if (usuarioEncontrado) {
        console.log('Inicio de sesión exitoso.');
        // Guardar el usuario actual con todos sus datos en localStorage
        localStorage.setItem('currentUser', JSON.stringify(usuarioEncontrado));

        this.router.navigate(['/tabs/home']);
      } else {
        console.log('Error: Credenciales incorrectas.');
        this.mostrarAlerta('Credenciales incorrectas.');
      }
    } else {
      console.log('Error: No hay usuarios registrados.');
      this.mostrarAlerta('No hay usuarios registrados.');
    }
  }
}