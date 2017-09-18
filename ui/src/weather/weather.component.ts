import { Component } from '@angular/core';
import * as moment from 'moment-timezone';

import { ApiService } from '../services/api.service';
import { IPosition } from "../core/position.interface";

const INITIAL_TOTAL = 14;

@Component({
  selector: 'weather',
  templateUrl: './weather.component.html',
  styleUrls: [
    '../app/app.component.css',
    './weather.component.css',
  ],
  providers: []
})
export class WeatherComponent {
  position: IPosition;
  showWeather: boolean;
  weather: Array<any>;
  totalRetrieved: number;
  currentProcessingDate: any;

  constructor(private api: ApiService) {
    this.position = null;
    this.showWeather = false;
    this.weather = [];
    this.totalRetrieved = 0;
    this.currentProcessingDate = null;
  }

  processResults(results: any) {
    return new Promise((resolve, reject) => {
      results._items.forEach((item) => {
        const dailyItem = item.result.daily.data[0];
        this.weather.push({
          dateLabel: (new Date((dailyItem.time*1000))).toISOString().split('T')[0],
          temperatureHigh: dailyItem.temperatureHigh,
          temperatureLow: dailyItem.temperatureLow,
        });
      });
      resolve();
    });
  }

  getProcessingDate() {
    return new Promise((resolve, reject) => {
      if (this.currentProcessingDate !== null) {
        resolve();
      } else {
        this.api.tz(this.position.coords.latitude, this.position.coords.longitude)
          .subscribe((res:any) => {
            this.currentProcessingDate = moment().tz(res.tz).startOf('day');
            resolve();
          });
      }
    });
  }

  getWeather() {
    return new Promise((resolve, reject) => {
      const coords = `${this.position.coords.latitude},${this.position.coords.longitude}`;
      const time = this.currentProcessingDate.format('X');
      console.log(coords, time);
      this.api.weather(coords, time)
        .subscribe((results:any) => {
          this.processResults(results)
            .then(() => {
              this.showWeather = true;
              resolve();
            })
            .catch((err) => {
              reject(err);
            })
        });
    })
  }

  getLastTwoWeeks() {
    if (this.totalRetrieved < INITIAL_TOTAL) {
      const newDate = this.currentProcessingDate.subtract(1, 'days');
      this.currentProcessingDate = newDate;
      this.getWeather()
        .then(() => {
          this.totalRetrieved = this.totalRetrieved + 1;
          this.getLastTwoWeeks();
        });
    }
  }

  displayWeather(position: IPosition) {
    // console.log(position);
    this.position = position;
    this.getProcessingDate()
      .then(() => {
        return this.getWeather();
      })
      .then(() => {
        this.totalRetrieved = this.totalRetrieved + 1;
        this.getLastTwoWeeks();
      });
  }

  clearDisplay() {
    this.position = null;
    this.showWeather = false;
    this.weather = [];
    this.totalRetrieved = 0;
    this.currentProcessingDate = null;
  }
}
