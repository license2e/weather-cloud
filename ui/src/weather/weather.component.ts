import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

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
  position: string;
  showWeather: boolean;
  weather: Array<any>;
  totalRetrieved: number;
  currentProcessingDate: Date;

  constructor(private api: ApiService) {
    this.position = '';
    this.showWeather = false;
    this.weather = [];
    this.totalRetrieved = 0;
    this.currentProcessingDate = new Date();
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

  getWeather(coords: string, time: number) {
    return new Promise((resolve, reject) => {
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
      const now = this.currentProcessingDate;
      this.currentProcessingDate.setDate(now.getDate()-1);
      this.currentProcessingDate.setHours(0);
      this.currentProcessingDate.setMinutes(0);
      this.currentProcessingDate.setSeconds(0);
      this.currentProcessingDate.setMilliseconds(0);
      this.getWeather(this.position, this.currentProcessingDate.getTime())
        .then(() => {
          this.totalRetrieved = this.totalRetrieved + 1;
          this.getLastTwoWeeks();
        });
    }
  }

  displayWeather(position: string) {
    console.log(position);
    this.position = position;
    this.currentProcessingDate.setHours(0);
    this.currentProcessingDate.setMinutes(0);
    this.currentProcessingDate.setSeconds(0);
    this.currentProcessingDate.setMilliseconds(0);
    this.getWeather(this.position, this.currentProcessingDate.getTime())
      .then(() => {
        this.totalRetrieved = this.totalRetrieved + 1;
        this.getLastTwoWeeks();
      });
  }

  clearDisplay() {
    this.position = '';
    this.showWeather = false;
    this.weather = [];
    this.totalRetrieved = 0;
    this.currentProcessingDate = new Date();
  }
}
