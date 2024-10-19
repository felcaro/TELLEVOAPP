import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  sw: boolean = false;

  usuarioConectado: any;
  isConductor: boolean = false;
  mostrarDatosAuto: boolean = false;


  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    this.usuarioConectado = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isConductor = this.usuarioConectado.tipoRegistro === 'conductor';
  }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const storedData = JSON.parse(localStorage.getItem('registroUsuario') || '{}');

    // Verifica si el correo electrónico coincide y carga los datos
    if (storedData.correoElectronico === currentUser.correoElectronico) {
      this.usuarioConectado = storedData;
      console.log('Usuario conectado:', this.usuarioConectado);
    } else {
      console.log('No se encontró el usuario conectado.');
    }
  }

  toggleDatosAuto(event: any) {
    this.mostrarDatosAuto = event.detail.checked; // Actualiza la visibilidad de la sección del auto
  }

  togglePasswordVisibility() {
    this.sw = !this.sw; 
  }

  async confirmarCambios() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cambios',
      message: '¿Estás seguro de que deseas guardar los cambios en el perfil?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cambios del perfil cancelados');
          }
        },
        {
          text: 'Guardar Cambios',
          handler: () => {
            this.goHome();
          }
        }
      ]
    });

    await alert.present();
  }

  async guardarCambios() {
    const alert = await this.alertController.create({
      header: 'Guardar Cambios',
      message: '¿Estás seguro de que deseas salir sin guardar los cambios en el perfil?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cambios del perfil no guardados');
          }
        },
        {
          text: 'Guardar Cambios',
          handler: () => {
            this.goprofile();
          }
        }
      ]
    });

    await alert.present();
  }


  goprofile() {
    this.router.navigate(['/tabs/profile']);
  }

  goHome() {
    this.router.navigate(['/tabs/home']);
  }
}
