import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  userName: string = '';
  userEmail: string = '';

  constructor(
    private router: Router
  ) { 
    const usuarioConectado = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userName = usuarioConectado.nombreCompleto || 'Invitado';
    this.userEmail = usuarioConectado.correoElectronico || '';
  }

  onEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  cerrarSesion() {
    // Obtener los datos del usuario conectado
    const usuarioConectado = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Mostrar en consola el usuario que está cerrando sesión
    console.log('Usuario que cierra sesión:', usuarioConectado);

    // Limpiar los datos del usuario conectado
    localStorage.removeItem('currentUser');
    
    // Redirigir a la pantalla de inicio de sesión
    this.router.navigate(['/login']); // Ajusta la ruta según tu estructura
  }

}
