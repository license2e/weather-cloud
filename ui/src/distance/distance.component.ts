import { Component } from '@angular/core';

import { ApiService } from '../services/api.service';
import { IPosition } from "../core/position.interface";

@Component({
  selector: 'distance',
  templateUrl: './distance.component.html',
  styleUrls: [
    '../app/app.component.css',
    './distance.component.css',
  ],
  providers: []
})
export class DistanceComponent {
  positions: Array<IPosition>;
  showDistance: boolean;
  distances: Array<any>;

  constructor(private api: ApiService) {
    this.positions = [];
    this.distances = [];
    this.showDistance = false;
  }

  getProcessingDistance() {
    return new Promise((resolve, reject) => {
      const idx = this.positions.length;
      console.log(idx);
      const org = this.positions[idx-2];
      const dest = this.positions[idx-1];
      console.log(org, dest);
      this.api.distance(org.coords.latitude, org.coords.longitude, dest.coords.latitude, dest.coords.longitude)
        .subscribe((results:any) => {
          console.log(results);
          this.showDistance = true;
          this.distances.push(results);
        });
    });
  }

  displayDistance(position: IPosition) {
    // console.log(position);
    this.positions.push(position);
    if (this.positions.length > 1) {
      this.getProcessingDistance()
        .then(() => {

        });
    }
  }
}
