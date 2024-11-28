import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LoginPage } from './login/login.page';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, // Módulo necesario para aplicaciones web
    IonicModule.forRoot(), // Inicializa Ionic
    AppRoutingModule, // Módulo de rutas
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Estrategia para reutilizar rutas
  ],
  bootstrap: [AppComponent], // Componente principal que se arranca al inicio
})
export class AppModule {}
