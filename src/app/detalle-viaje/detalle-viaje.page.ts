import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef | undefined;
  
  public map: any;
  public distancia: string = '';
  public duracion: string = '';
  public end: string = 'Salamanca 31 - melipilla';
  public autocompleteItems: any[] = []; 
  public directionsService: any;
  public directionsDisplay: any;

  constructor(private platform: Platform, private zone: NgZone) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.initMap();
    });
  }

  initMap() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();

    let mapOptions = {
      zoom: 5,
      zoomControl: false,
      scaleControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement!.nativeElement, mapOptions);

    let infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent("Estas aquí.");
        infoWindow.open(this.map);
        this.map.setCenter(pos);
      });
    }
    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: 'Duoc UC: Sede Melipilla - Serrano, Melipilla, Chile',
      destination: this.end,
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
        window.alert('Directions request failed due to ' + status);
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
