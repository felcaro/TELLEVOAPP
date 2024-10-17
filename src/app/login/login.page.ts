import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  private isDarkMode: boolean = false;
  showPassword: boolean = false; 

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


    }

  onSubmit() {
  }

  togglePasswordVisibility(event: CustomEvent) {
    this.showPassword = event.detail.checked;
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  logIn() {
    this.router.navigate(['/home']);
  }

  goHome() {
    this.router.navigate(['/home']);
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
}