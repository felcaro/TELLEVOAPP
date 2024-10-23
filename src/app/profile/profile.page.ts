import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  isLoggedIn: boolean = false;

  isDarkMode: boolean = false;

  userName: string = 'Invitado';
  userEmail: string = '';
  userTipe: string = 'Inicie Sesion para ver Informacion';
  autoInfo: any = null;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private alertController: AlertController
  ) { 
    this.checkUserSession();
  }

  ngOnInit() {
    this.loadCarInfo();
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

  checkUserSession() {
    const usuarioConectado = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (usuarioConectado) {
      this.userName = usuarioConectado.nombreCompleto || 'Invitado';
      this.userEmail = usuarioConectado.correoElectronico || '';
      this.userTipe = usuarioConectado.tipoRegistro || '';
      this.isLoggedIn = true; 
    } else {
      this.isLoggedIn = false; 
    }
  }

  loadCarInfo() {
    if (this.userTipe === 'conductor') { 
      const storedCars: any[] = JSON.parse(localStorage.getItem('listaAutos') || '[]'); 
      this.autoInfo = storedCars.find((car: any) => car.correo === this.userEmail) || null; 
    } else {
      this.autoInfo = null;  
    }
  }

  async onEditProfile() {
    if (!this.isLoggedIn) {
      const alert = await this.alertController.create({
        header: 'Acceso Denegado',
        message: 'Debe iniciar sesión para editar el perfil.',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      this.router.navigate(['/edit-profile']);
    }
  }

  cerrarSesion() {
    const usuarioConectado = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('Usuario que cierra sesión:', usuarioConectado);
    this.isLoggedIn = false;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']); 
  }

  iniciarSesion() {
    this.router.navigate(['/login']);
  }

}
