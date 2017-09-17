import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  weather(coordinates: string, next: number) {
    const coords = encodeURIComponent(coordinates);
    const url = `${environment.apiUri}/weather?where={"coordinates":"${coords}","time":${(next/1000)}}`;

    return this.http.get(url);
  }
}
