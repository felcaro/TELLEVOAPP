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
    private navCtrl: NavController,
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
  
    const storedData = localStorage.getItem('registroUsuario');
    if (storedData) {
      const existingUser = JSON.parse(storedData);
  
      if (existingUser.correoElectronico === this.correoElectronico && existingUser.contrasena === this.contrasena) {
        console.log('Inicio de sesión exitoso.');
        localStorage.setItem('currentUser', JSON.stringify({ correoElectronico: existingUser.correoElectronico, tipoRegistro: existingUser.tipoRegistro }));
  
        // Verificar si ya estás en la ruta antes de navegar
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