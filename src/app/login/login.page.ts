import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

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
  isModalOpen = false;
  email: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private renderer: Renderer2,
    private loadingCtrl: LoadingController,
    private http: HttpClient
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

  private async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
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

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async resetPass() {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar acción',
      message: '¿Estás seguro de que deseas recuperar tu contraseña?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Recuperación cancelada.');
          },
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Cargando...',
            });
            loading.present();
  
            // Obtener los usuarios desde localStorage
            const storedData = localStorage.getItem('listaUsuarios');
            if (!storedData) {
              console.log("No hay usuarios registrados en localStorage.");
              loading.dismiss();
              return;
            }
  
            const listaUsuarios = JSON.parse(storedData);
  
            // Mostrar la lista de usuarios para depuración
            console.log("Lista de usuarios en localStorage:", listaUsuarios);
  
            // Asegurarse de que el correo sea válido
            console.log("Buscando el usuario con correo:", this.correoElectronico);
  
            // Buscar al usuario con el correo proporcionado
            const usuarioEncontrado = listaUsuarios.find(
              (u: { correoElectronico: string }) =>
                u.correoElectronico.trim().toLowerCase() === this.correoElectronico.trim().toLowerCase()
            );
  
            if (usuarioEncontrado) {
              console.log("Usuario encontrado:", usuarioEncontrado);
  
              // Recuperar la contraseña existente
              const contrasenaRecuperada = usuarioEncontrado.contrasena;
  
              // Simular el envío de un correo con la contraseña recuperada
              const body = {
                "nombre": usuarioEncontrado.nombre,
                "app": "RegistrAPP",
                "clave": contrasenaRecuperada,
                "email": usuarioEncontrado.correoElectronico,
              };
  
              this.http.post("https://myths.cl/api/reset_password.php", body).subscribe(
                (data) => {
                  console.log('Contraseña recuperada:', data);
                  loading.dismiss();
                },
                (error: any) => {
                  console.error('Error al recuperar la contraseña:', error);
                  loading.dismiss();
                }
              );
            } else {
              console.log("Usuario no encontrado en la lista:", this.correoElectronico);
              loading.dismiss();
            }
          },
        },
      ],
    });
  
    await confirmAlert.present();
  }
  



}  