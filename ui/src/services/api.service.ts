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

  distance(org_lat: number, org_lng: number, dest_lat: number, dest_lng: number) {
    const url = `${environment.apiUri}/distance?org_lat=${org_lat}&org_lng=${org_lng}&dest_lat=${dest_lat}&dest_lng=${dest_lng}`;

    return this.http.get(url);
  }
}
