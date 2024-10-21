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
  nuevoAuto: any = {
    marcaModelo: '',
    color: '',
    matricula: '',
  };

  constructor(
    private router: Router,
    private alertController: AlertController

  ) {

    this.usuarioConectado = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isConductor = this.usuarioConectado.tipoRegistro === 'conductor';

  }

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarDatosAuto();
    console.log('Datos del usuario en ngOnInit:', this.usuarioConectado);
  }

  private cargarDatosUsuario() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const storedData = JSON.parse(localStorage.getItem('listaUsuarios') || '[]');
  
    // Verifica que storedData sea un array
    if (!Array.isArray(storedData)) {
      console.error('La lista de usuarios no es un array. Inicializando como array vacío.');
      return; // O puedes inicializar storedData como un array vacío
    }
  
    // Verifica si el correo electrónico coincide y carga los datos
    const usuarioEncontrado = storedData.find((user: any) => user.correoElectronico === currentUser.correoElectronico);
    if (usuarioEncontrado) {
      this.usuarioConectado = usuarioEncontrado;
      console.log('Usuario conectado:', this.usuarioConectado);
    } else {
      console.log('No se encontró el usuario conectado.');
    }
  }
  
  private cargarDatosAuto() {
    const currentUserEmail = this.usuarioConectado.correoElectronico;
    const listaAutos = JSON.parse(localStorage.getItem('listaAutos') || '[]');

    // Busca el auto que pertenece al usuario conectado
    const autoUsuario = listaAutos.find((auto: any) => auto.correo === currentUserEmail);
    if (autoUsuario) {
      // Cargar datos del auto en los inputs
      this.nuevoAuto = {
        marcaModelo: autoUsuario.marcaModelo || '',
        color: autoUsuario.color || '',
        matricula: autoUsuario.matricula || ''
      };
    } else {
      console.log('No hay información del auto para este usuario.');
    }
  }

  private guardarCambios() {
    // Actualizar los datos del usuario
    const storedData = JSON.parse(localStorage.getItem('listaUsuarios') || '[]');
    const currentUserEmail = this.usuarioConectado.correoElectronico;

    const index = storedData.findIndex((user: any) => user.correoElectronico === currentUserEmail);
    if (index !== -1) {
      storedData[index].nombreCompleto = this.usuarioConectado.nombreCompleto;
      storedData[index].tipoRegistro = this.usuarioConectado.tipoRegistro;
      localStorage.setItem('listaUsuarios', JSON.stringify(storedData));
    }

    // Guardar los datos del auto en la lista de autos
    this.guardarAuto();
    
    // Actualizar currentUser en localStorage
    localStorage.setItem('currentUser', JSON.stringify(this.usuarioConectado));
    this.goprofile();
  }


  private guardarAuto() {
    const currentUserEmail = this.usuarioConectado.correoElectronico;
    const listaAutos = JSON.parse(localStorage.getItem('listaAutos') || '[]');

    // Verifica si ya existe un auto para este usuario
    const autoIndex = listaAutos.findIndex((auto: any) => auto.correo === currentUserEmail);

    const autoData = { ...this.nuevoAuto, correo: currentUserEmail };

    if (autoIndex !== -1) {
      // Actualiza el auto si ya existe
      listaAutos[autoIndex] = autoData;
    } else {
      // Agrega el auto nuevo
      listaAutos.push(autoData);
    }

    localStorage.setItem('listaAutos', JSON.stringify(listaAutos));
    console.log('Auto guardado:', autoData);
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
            this.guardarCambios();
          }
        }
      ]
    });

    await alert.present();
  }




  togglePasswordVisibility() {
    this.sw = !this.sw; 
  }

  goprofile() {
    this.router.navigate(['/tabs/profile']);
  }

  goHome() {
    this.router.navigate(['/tabs/home']);
  }
}
