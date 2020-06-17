import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment'

@Injectable()
export class MapService {
  private messageSource = new BehaviorSubject(''); //https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) {}

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  getTest() {
    return this.http.get(environment.host+"/api/place/test")
  }

  getPlaces() {
    return this.http.get(environment.host+"/api/place")
  }

  getRoutes(imei) {
    return this.http.get(environment.host+"/api/route/"+imei)
  }

  getPath(fromTime: String, toTime: String, imei: String) {
    return this.http.get(environment.host+"/api/geoloc/between/"+fromTime+"/"+toTime+"/"+imei)
  }
}


// [
    //     [51.136850, 16.953648, 'green'],
    //     [51.12, 16.96, 'red'],
    //     [51.12, 16.97, 'blue'],
    //     [51.10, 16.97, 'yellow'],
    //     [51.10, 16.94, 'orange'],
    //     [51.08, 16.94, 'grey']
    // ]

    // [
    //   {
    //     path: [
    //       {latitude: 51.136850, longitude: 16.953648},
    //       {latitude: 51.12, longitude: 16.96},
    //       {latitude: 51.11, longitude: 16.99}
    //     ],
    //     color: 'green'
    //   },
    //   {
    //     path: [
    //       {latitude: 51.11, longitude: 16.99},
    //       {latitude: 51.09, longitude: 16.94},
    //       {latitude: 51.08, longitude: 16.97}
    //     ],
    //     color: 'red'
    //   }
    // ]
