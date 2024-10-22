import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isDarkMode: boolean = false;
  correoElectronico: string = '';
  contrasena: string = '';
  sw: boolean = false;

  constructor(
    private router: Router,
    private renderer: Renderer2
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navegación a:', this.router.url);
      }
    });
  }

  ngOnInit() {
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