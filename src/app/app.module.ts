import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent // Asegúrate de que tu componente principal esté declarado aquí
  ],
  imports: [
    BrowserModule, // Módulo necesario para aplicaciones web
    IonicModule.forRoot(), // Inicializa Ionic
    AppRoutingModule // Módulo de rutas
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Estrategia para reutilizar rutas
  ],
  bootstrap: [AppComponent], // Componente principal que se arranca al inicio
})
export class AppModule {}
