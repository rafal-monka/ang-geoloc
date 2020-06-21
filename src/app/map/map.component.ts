import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {} from '@agm/core/services/google-maps-types';
import * as moment from 'moment';

import { MapService } from '../app-services';
import { Utils } from '../utils';
import { Data } from '../data-service';
import { PanelDataObj } from '../paneldata-object';
import { google } from 'google-maps';

declare var google: any;
const CONST_INIT_LAT: number = 51.138850;
const CONST_INIT_LNG: number = 16.953648;
const CONST_INIT_ZOOM: number = 15;
const CONST_INIT_MAPTYPEID : string = 'roadmap'; //'roadmap' | 'hybrid' | 'satellite' | 'terrain'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [ MapService, Utils ]
})
export class MapComponent implements OnInit {
  map: google.maps.Map;

  socket: WebSocket
  liveDataPolylines: Array<any> = []
  lifeDataState: boolean = false
  curPosMarker: google.maps.Marker
  followMe: boolean


  timeFrom: Date
  timeTo: Date
  imei: string

  path: Array<any> = []
  rectangles: Array<any> = []
  btses: Array<any> = []

  message:string
  messages: Array<any> = []

  constructor(
    private mapService: MapService,
    private utils: Utils,
    private router: Router,
    public data: Data
  ) { }

  mapReady(map) {
      var options = {
          mapTypeControl: true,
          fullscreenControl: true,
          center:new google.maps.LatLng(CONST_INIT_LAT, CONST_INIT_LNG),
          zoom:CONST_INIT_ZOOM,
          mapTypeId: CONST_INIT_MAPTYPEID
      }
      map.setOptions(options)
      this.map = map;
      this.refresh()
  }

  ngOnInit() {
      this.mapService.currentMessage.subscribe(message => this.message = message)
      if (this.data.storage) {
          this.imei = this.data.storage.imei
          if (this.data.storage.dateFrom) this.timeFrom = moment(this.data.storage.dateFrom).utcOffset('+0000').add(-2, 'hours').toDate()
          if (this.data.storage.dateTo) this.timeTo = moment(this.data.storage.dateTo).utcOffset('+0000').add(-2, 'hours').toDate()
      }
  }

  refresh() {
      if (this.data.storage.imei && this.timeFrom && this.timeTo) {
        let t1 = moment(this.timeFrom).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
        let t2 = moment(this.timeTo).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
        this.drawDataPanel(this.data.storage.imei, t1, t2)
      }
  }

  //toggle live data (on/off)
  toggleLiveData() {
      if (this.lifeDataState) {
          //close socket
          this.socket.close(1000, 'Manual closing of web socket...')
          //map - clear path
          this.path.forEach(item => {
                if (item) item.setMap(null);
          })
          this.path.length = 0
          //map - clear live data lines
          this.liveDataPolylines.forEach(item => {
              item.setMap(null)
          })
          this.liveDataPolylines.length = 0
      } else {
          //1. read last (n) hours before showing live data
          let nHours = -1
          this.timeFrom = moment(new Date).add(nHours, 'hours').toDate()
          this.timeTo = moment(new Date).toDate()
          let t1 = moment(this.timeFrom).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
          let t2 = moment(this.timeTo).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
          this.drawDataPanel(this.imei, t1, t2).then(x=> {
              let lastLoc = null
              if (this.path && this.path.length>0) {
                    try {
                        let loc = this.path[this.path.length-1].getPath().getArray() //google.maps.MVCArray<google.maps.LatLng>
                        lastLoc = {
                            lat: loc[1].lat(),
                            lng: loc[1].lng()
                        }
                        this.updateCurrentLoc(lastLoc)
                    } catch (e) {}
              }

              //2. turn on live data
              this.liveDataPolylines = []
              this.socket = new WebSocket(this.utils.httpToWs()+"?imei="+this.imei);
              this.turnOnLiveData(
                  () => {
                    this.lifeDataState = true
                  },
                  (msg) => {
                      try {
                        let geoloc = JSON.parse(msg)
                        let newLoc = { lat: geoloc.latitude, lng: geoloc.longitude }
                        this.updateCurrentLoc(newLoc)
                        if (lastLoc) {
                            this.liveDataPolylines.push(this.addLine(lastLoc, newLoc, geoloc.speed))
                        }
                        lastLoc = newLoc
                        this.timeTo = moment(geoloc.devicetime).utcOffset('+0000').add(-2, 'hours').toDate()
                      } catch (e) { }
                  },
                  () => {
                      this.lifeDataState = false
                      //map - clear current position
                      if (this.curPosMarker) {
                          this.curPosMarker.setMap(null)
                          this.curPosMarker = null
                      }
                  }
              )
          })
      }
  }

  private drawDataPanel(imei, timeFrom, timeTo) {
      //clear map
      this.path.forEach(item => {
          if (item) item.setMap(null);
      })
      this.rectangles.forEach(item => {
          if (item) item.setMap(null);
      })
      this.rectangles = []
      this.path = []
      this.btses = []
      return new Promise((resolve, reject) => {
          //get panel data
          this.mapService.getPanelData(imei, timeFrom, timeTo).subscribe((results:PanelDataObj) => {
              var min_lat = null, min_lng = null, max_lat = null, max_lng = null;

              switch (results.type) {

                  //show path and BTSes only in 'detailed' type
                  case "detailed":
                      //path
                      var self = this;
                      this.path = Object.keys(results.geolocs).map(function(index){
                        let cur_lat = results.geolocs[+index].lat
                        let cur_lng = results.geolocs[+index].lng
                        //start with second item (end of first step)
                        if (+index > 1) {
                            let line = [
                              { lat: results.geolocs[+index-1].lat, lng: results.geolocs[+index-1].lng },
                              { lat: cur_lat, lng: cur_lng }
                            ]
                            return self.addLine(line[0], line[1], results.geolocs[+index].spd)
                        }
                      });
                      //set map for path elements
                      this.path.forEach(item => {
                        if (item) item.setMap(this.map);
                      })

                      //BTSes
                      let arr = Object.keys(results.geolocs).map(function(index){
                          return {
                              lat: results.geolocs[+index].btslat,
                              lng: results.geolocs[+index].btslng,
                              info: ''//results.geolocs[+index].btsi
                          }
                      })
                      //unique BTSes
                      if (arr) this.btses = arr.filter(
                          (item, pos, self) => self.findIndex(v => {
                              return v.lat === item.lat && v.lng === item.lng && v.info === item.info && item.lat !== 0 && item.lng !== 0
                          }) === pos);

                      //bounds
                      min_lat = results.geolocs.reduce((min, p) => p.lat < min ? p.lat : min, results.geolocs[0].lat);
                      min_lng = results.geolocs.reduce((min, p) => p.lng < min ? p.lng : min, results.geolocs[0].lng);
                      max_lat = results.geolocs.reduce((max, p) => p.lat > max ? p.lat : max, results.geolocs[0].lat);
                      max_lng = results.geolocs.reduce((max, p) => p.lng > max ? p.lng : max, results.geolocs[0].lng);
                      break;

                  //show rectangles (areas) only in 'aggregated' type
                  case "aggregated":
                      this.rectangles = Object.keys(results.geolocs).map(function(index){
                          var rectangle = new google.maps.Rectangle({
                            strokeColor: 'orange',
                            strokeOpacity: 0.8,
                            strokeWeight: 1,
                            /*fillColor: '#FF0000',*/
                            fillOpacity: 0.02,
                            bounds: {
                                north: results.geolocs[+index].maxlat,
                                south: results.geolocs[+index].minlat,
                                east: results.geolocs[+index].maxlng,
                                west: results.geolocs[+index].minlng
                            }
                          })
                          return rectangle;
                      });
                      //set map
                      this.rectangles.forEach(item => {
                          if (item) item.setMap(this.map);
                      })

                      //bounds
                      min_lat = results.geolocs.reduce((min, p) => p.minlat < min ? p.minlat : min, results.geolocs[0].minlat);
                      min_lng = results.geolocs.reduce((min, p) => p.minlng < min ? p.minlng : min, results.geolocs[0].minlng);
                      max_lat = results.geolocs.reduce((max, p) => p.maxlat > max ? p.maxlat : max, results.geolocs[0].maxlat);
                      max_lng = results.geolocs.reduce((max, p) => p.maxlng > max ? p.maxlng : max, results.geolocs[0].maxlng);
                      break;
              }

              //set bounds
              if (results.geolocs.length > 0) {
                  this.map.fitBounds(
                      new google.maps.LatLngBounds(
                          new google.maps.LatLng(min_lat, min_lng),
                          new google.maps.LatLng(max_lat, max_lng)
                      )
                  )
                  this.message = ''
              } else {
                  this.message = 'No data found'
              }
              resolve()
          });
      });
  }

  private updateCurrentLoc = (loc) => {
// console.log('updateCurrentLoc()')
      if (!this.curPosMarker) this.curPosMarker = new google.maps.Marker({
          position: loc,
          map: this.map,
          icon: '../assets/images/red-dot.png'
      })
      this.curPosMarker.setPosition(loc)
      if (this.followMe) this.map.setCenter(loc)
  }

  private turnOnLiveData(callbackOnOpen, callbackOnMessage, callbackOnClose) {

      this.socket.onopen = function(e) {
  // console.log("[client] [on-open] Sending to server");
          callbackOnOpen()
      };

      this.socket.onmessage = function (event) {
  // console.log(`[client] [on-message] received from server: ${event.data}`);
          callbackOnMessage(event.data)
      }

      this.socket.onclose = function(event) {
          callbackOnClose()
          if (event.wasClean) {
              console.log(`[client]  Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          } else {
              // e.g. server process killed or network down
              // event.code is usually 1006 in this case
              console.log('[close] Connection died');
          }
      };

      this.socket.onerror = function(error) {
          console.log('[socket.onerror]', JSON.stringify(error));
      };
  }

  private addLine(loc1, loc2, speed) {
    let color = this.utils.getSpeedColor(speed)
      let line = [
        { lat: loc1.lat, lng: loc1.lng },
        { lat: loc2.lat, lng: loc2.lng }
      ]
      let polyline: google.maps.Polyline = new google.maps.Polyline({
        path: line,
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 6,
        fillColor: color,
        fillOpacity: 0.7
      });
      polyline.setMap(this.map)
      return polyline
  }

}



//--------------------temp

// getPlaces() {
//     return this.mapService.getPlaces().subscribe(results => {
//       this.markers = results;
//     });
// }

// job: any //###temp for simulation
// if (false) this.job = setInterval(()=>{
//   let r1 = Math.random()
//   let r2 = Math.random()
//   console.log(r1, r2)
//   let newLoc = { lat: 51+r1, lng: 16+r2 }
//   this.updateCurrentLoc(newLoc)
//   if (lastLoc) {
//       this.liveDataPolylines.push(this.addLine(lastLoc, newLoc, Math.random()*100))
//   }
//   lastLoc = newLoc
// }, 3000)
