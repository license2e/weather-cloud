import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapService } from '../services/map.service';
import { GeolocationService } from '../services/geolocation.service';
import { ApiService } from '../services/api.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    MapService,
    GeolocationService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
