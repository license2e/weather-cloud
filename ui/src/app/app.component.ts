import { Component, ViewChild } from '@angular/core';
import { MapService } from '../services/map.service';
import { GeolocationService } from '../services/geolocation.service';
import { Map } from 'mapbox-gl';
import { IPosition } from '../core/position.interface';
import { WeatherComponent } from '../weather/weather.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Weather';

  @ViewChild(WeatherComponent)
  private weatherDisplay: WeatherComponent;

  // Warning flag & message.
  warning: boolean;
  message: string;

  position: IPosition;
  repositioned: boolean;
  customLocations: Array<any>;

  constructor(private mapService: MapService, private geolocation: GeolocationService) {
    this.warning = false;
    this.message = '';
    this.repositioned = false;
    this.customLocations = [{
      title: 'Global HQ',
      coords: {
        longitude: -117.7501357,
        latitude: 33.6527411,
      },
    }, {
      title: 'Silicon Valley',
      coords: {
        longitude: -122.083845,
        latitude: 37.3906728,
      },
    }, {
      title: 'Copenhagen',
      coords: {
        longitude: 12.3740582,
        latitude: 55.6569337,
      },
    }];
  }

  private repositionMap() {
    if (this.repositioned === false && this.position) {
      this.mapService.map
        .flyTo({
          center: [this.position.coords.longitude, this.position.coords.latitude],
          zoom: 7,
          speed: .5,
          pitch: 60,
        });
      this.repositioned = true;
    }
  }

  getWeatherDisplay() {
    if (this.position) {
      try {
        this.weatherDisplay.displayWeather(this.position);
      } catch (e) {
        console.error(e);
      }
    }
  }

  navigate(location: any) {
    try {
      this.weatherDisplay.clearDisplay();
    } catch (e) {
      console.error(e);
    }
    this.repositioned = false;
    this.position = {
      coords: location.coords,
    };
    this.getWeatherDisplay();
    this.repositionMap();
  }

  ngOnInit() {
    history.replaceState({}, document.title, ".");
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
      this.getWeatherDisplay();
      this.repositionMap();
    });
    this.mapService.map = map;
  }

  ngAfterViewInit() {
    if (navigator.geolocation) {
      this.geolocation.getCurrentPosition()
        .forEach((position: Position) => {
          const newCoords = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          };
          this.position = {
            coords: newCoords,
          };
          this.customLocations.push({
            title: 'My Location',
            coords: newCoords,
          });
        })
        .then(() => {
          this.getWeatherDisplay();
          this.repositionMap();
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
      this.message = 'browser doesn\'t support geolocation';
      this.warning = true;
    }
  }
}
