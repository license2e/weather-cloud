import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapService } from '../services/map.service';
import { GeolocationService } from '../services/geolocation.service';
import { ApiService } from '../services/api.service';
import { WeatherComponent } from '../weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    MapService,
    GeolocationService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
