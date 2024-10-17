import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.applyTheme(prefersDark.matches);
      prefersDark.addEventListener('change', (e) => this.applyTheme(e.matches));
      
      // Cargar tema guardado en local storage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.applyTheme(savedTheme === 'dark');
      }
    });
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
  }
}
