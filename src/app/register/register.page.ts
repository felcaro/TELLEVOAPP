import { Component, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  swConfirm: boolean = false;
  sw: boolean = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }


  togglePasswordVisibility() {
    this.sw = !this.sw; 
  }

  goHome() {
    this.router.navigate(['/tabs/home']);
  }

  register() {
    // Validar los datos con funcionalidad más adelante
    this.router.navigate(['/tabs/home']);
  }

  gologIn() {
    this.router.navigate(['/login']);
  }

  
}
