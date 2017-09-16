import { Component } from '@angular/core';
import { MapService } from '../services/map.service';
import { GeolocationService } from '../services/geolocation.service';
import { ApiService } from '../services/api.service';
import { Map } from 'mapbox-gl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My First Angular App';

  // Warning flag & message.
  warning: boolean;
  message: string;
  position: Position;
  repositioned: boolean;

  constructor(private mapService: MapService, private geolocation: GeolocationService, private api: ApiService) {
    this.warning = false;
    this.message = "";
    this.repositioned = false;
  }

  repositionMap() {
    if (this.repositioned === false && this.position) {
      this.mapService.map.easeTo({
        center: [this.position.coords.longitude, this.position.coords.latitude],
        zoom: 7,
        duration: 3500,
        pitch: 60,
      });
      this.repositioned = true;
    }
  }

  getWeather() {
    this.api.weather(`${this.position.coords.latitude},${this.position.coords.longitude}`)
      .subscribe((results) => {
        console.log(results);
      });
  }

  ngOnInit() {
    let map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 2,
      pitch: 30,
      center: [-75, 40],
      dragPan: false,
      dragRotate: false,
      scrollZoom: false,
    });
    map.on('style.load', () => {
      this.repositionMap();
    });
    this.mapService.map = map;
  }

  ngAfterViewInit() {
    if (navigator.geolocation) {
      this.geolocation.getCurrentPosition()
        .forEach((position: Position) => {
          this.position = position;
        })
        .then(() => {
          this.repositionMap();
          this.getWeather();
        })
        .catch((error: PositionError) => {
          if (error.code > 0) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                this.message = 'permission denied';
                break;
              case error.POSITION_UNAVAILABLE:
                this.message = 'position unavailable';
                break;
              case error.TIMEOUT:
                this.message = 'position timeout';
                break;
            }
            this.warning = true;
          }
        });
    } else {
      this.message = "browser doesn't support geolocation";
      this.warning = true;
    }
  }
}
