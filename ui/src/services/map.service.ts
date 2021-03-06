import {Injectable} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Map } from 'mapbox-gl';

import { environment } from '../environments/environment';

@Injectable()
export class MapService {
  map: Map;
  baseMaps: any;

  constructor() {

    (mapboxgl as any).accessToken = environment.mapboxAccessToken;

    this.baseMaps = [
      { name: 'Street', id: 'street' },
      { name: 'Bright', id: 'bright' },
      { name: 'Light', id: 'light' },
      { name: 'Satellite', id: 'satellite' }
    ];

  }
}
