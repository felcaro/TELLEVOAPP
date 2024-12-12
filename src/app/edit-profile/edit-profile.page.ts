import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  isDarkMode: boolean = false;

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
    private alertController: AlertController,
    private renderer: Renderer2

  ) {

    this.usuarioConectado = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isConductor = this.usuarioConectado.tipoRegistro === 'conductor';

    
  }

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarDatosAuto();
    console.log('Datos del usuario en ngOnInit:', this.usuarioConectado);

    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme) {
      this.isDarkMode = JSON.parse(savedTheme);
      this.applyTheme();
    }
  }

  onTipoRegistroChange() {
    if (this.usuarioConectado.tipoRegistro === 'conductor') {
      // Aquí puedes realizar cualquier acción adicional si el usuario es conductor
    }
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  private cargarDatosUsuario() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const storedData = JSON.parse(localStorage.getItem('listaUsuarios') || '[]');
  
    // Verifica que storedData sea un array
    if (!Array.isArray(storedData)) {
      console.error('La lista de usuarios no es un array. Inicializando como array vacío.');
      return;
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
    if (this.validarCampos()) {
      // Actualizar los datos del usuario
      const storedData = JSON.parse(localStorage.getItem('listaUsuarios') || '[]');
      const currentUserEmail = this.usuarioConectado.correoElectronico;
  
      const index = storedData.findIndex((user: any) => user.correoElectronico === currentUserEmail);
      if (index !== -1) {
        storedData[index].nombreCompleto = this.usuarioConectado.nombreCompleto;
        storedData[index].tipoRegistro = this.usuarioConectado.tipoRegistro;
  
        // Actualizar la contraseña con la nueva
        const nuevaContrasenaInput = document.getElementById('inputNuevaContrasena') as HTMLInputElement;
        if (nuevaContrasenaInput.value) {
          storedData[index].contrasena = nuevaContrasenaInput.value;
          this.usuarioConectado.contrasena = nuevaContrasenaInput.value;
        }
  
        localStorage.setItem('listaUsuarios', JSON.stringify(storedData));
      }
  
      // Guardar los datos del auto en la lista de autos (si es conductor)
      this.guardarAuto();
      
      // Actualizar currentUser en localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.usuarioConectado));
      this.goprofile();
    } else {
      console.log('No se pudieron guardar los cambios. Hay campos incompletos o errores.');
    }
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
    if (!this.validarCampos()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos obligatorios antes de confirmar.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
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


  private validarCampos(): boolean {
    if (!this.usuarioConectado.nombreCompleto || !this.usuarioConectado.correoElectronico) {
      return false;
    }
  
    const nuevaContrasenaInput = document.getElementById('inputNuevaContrasena') as HTMLInputElement;
    const contrasenaViejaInput = document.getElementById('inputContrasenaVieja') as HTMLInputElement;
  
    if (!nuevaContrasenaInput.value || !contrasenaViejaInput.value) {
      return false;
    }
  
    if (contrasenaViejaInput.value !== this.usuarioConectado.contrasena) {
      return false;
    }
  
    if (this.usuarioConectado.tipoRegistro === 'conductor') {
      if (!this.nuevoAuto.marcaModelo || !this.nuevoAuto.color || !this.nuevoAuto.matricula) {
        return false;
      }
    }
  
    return true;
  }


  togglePasswordVisibility() {
    this.sw = !this.sw; 
  }

  goprofile() {
    this.router.navigate(['/profile']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
