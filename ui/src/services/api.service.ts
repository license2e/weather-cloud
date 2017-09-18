import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  weather(coordinates: string, time: number) {
    const coords = encodeURIComponent(coordinates);
    const url = `${environment.apiUri}/weather?where={"coordinates":"${coords}","time":${time}}`;

    return this.http.get(url);
  }

  tz(lat: number, lng: number) {
    const url = `${environment.apiUri}/tz?lat=${lat}&lng=${lng}`;

    return this.http.get(url);
  }
}
