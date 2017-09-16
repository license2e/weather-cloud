import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  weather(coordinates: string) {
    return this.http
      .get(`${environment.apiUri}/weather?where={"coordinates":"${encodeURIComponent(coordinates)}"}`);
  }
}
