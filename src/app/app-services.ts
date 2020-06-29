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

  getPlaces() {
    return this.http.get(environment.host+"/api/place")
  }

  getRoutes(imei) {
    return this.http.get(environment.host+"/api/route/"+imei)
  }

  getPanelData(imei: String, fromTime: String, toTime: String) {
    return this.http.get(environment.host+"/api/geoloc/paneldata/"+imei+"/"+fromTime+"/"+toTime)
  }

  getDevices() {
    return this.http.get(environment.host+"/api/device")
  }
}

