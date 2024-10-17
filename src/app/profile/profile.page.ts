import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  userName: string = 'Juan Pérez';
  userEmail: string = 'juan.perez@example.com';

  constructor() { }

  onEditProfile() {
    // Aquí iría la lógica para editar el perfil del usuario
    console.log('Editar perfil');
  }
}
