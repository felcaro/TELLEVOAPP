import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef | undefined;
  
  public viaje: any;
  public origin: string = '';
  public destination: string = '';

  public map: any;
  public distancia: string = '';
  public duracion: string = '';
  public end: string = ''; // Puedes cambiar esto según tus necesidades
  public autocompleteItems: any[] = []; 
  public directionsService: any;
  public directionsDisplay: any;

  constructor(
    private platform: Platform, 
    private zone: NgZone,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) { }

  ngOnInit() { 
    const viajeSeleccionado = localStorage.getItem('viajeSeleccionado');
    if (viajeSeleccionado) {
      this.viaje = JSON.parse(viajeSeleccionado);
      this.origin = this.viaje.origin;   // Origen del viaje
      this.destination = this.viaje.destination; // Destino del viaje
      this.end = this.origin;

      // Asegúrate de que origin y destination están definidos
      if (!this.origin || !this.destination) {
        console.error('No se pudo obtener el origen o destino del viaje');
      }
    }
  }


  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.initMap();
    });
  }

  initMap() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();

    const mapOptions = {
      zoom: 5,
      zoomControl: false,
      scaleControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement!.nativeElement, mapOptions);

    const infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent("Estás aquí.");
        infoWindow.open(this.map);
        this.map.setCenter(pos);
      });
    }
    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute(); // Ahora utilizará origin y destination correctos
  }

  calculateAndDisplayRoute() {
    if (!this.origin || !this.destination) {
      console.error('No se pudo calcular la ruta: falta origen o destino');
      return;
    }

    this.directionsService.route({
      origin: this.origin, // Usa el origen del viaje
      destination: this.destination, // Usa el destino del viaje
      travelMode: 'DRIVING',
    }, (response: any, status: string) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        const leg = response.routes[0].legs[0];

        const distanceInKilometers = (leg.distance.value / 1000).toFixed(2);
        this.distancia = `${distanceInKilometers} km`;

        const durationInSeconds = leg.duration.value;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        this.duracion = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      } else {
        window.alert('La solicitud de direcciones falló debido a ' + status);
      }
    });
  }

  updateSearchResults() {
    const GoogleAutocomplete = new google.maps.places.AutocompleteService();
    if (this.end === '') {
      this.autocompleteItems = [];
      return;
    }

    GoogleAutocomplete.getPlacePredictions({ input: this.end }, (predictions: any, status: any) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction: any) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  selectSearchResult(item: any) {
    this.end = item.description;
    this.autocompleteItems = [];
    this.initMap();
  }
}
