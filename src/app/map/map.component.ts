import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {} from '@agm/core/services/google-maps-types';
import * as moment from 'moment';

import { MapService } from '../app-services';
import { Utils } from '../utils';
import { Data } from '../data-service';
import { PanelDataObj } from '../paneldata-object';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [ MapService, Utils ]
})
export class MapComponent implements OnInit {
  map: google.maps.Map;

  initLat: number = 51.138850;
  initLng: number = 16.953648;
  initZoom: number = 15;
  initMapTypeId : string = 'terrain'; //'roadmap' | 'hybrid' | 'satellite' | 'terrain'
  timeFrom: Date
  timeTo: Date
  imei: string

  path: Array<any>;
  rectangles: Array<any>
  message:string;
  route: any;

  markers: any;
  polylines: any;

  constructor(
    private mapService: MapService,
    private utils: Utils,
    private router: Router,
    public data: Data
  ) { }

  mapReady(map) {
      console.log('mapReady')
      var options = {
          mapTypeControl: true,
          fullscreenControl: true,
          center:new google.maps.LatLng(this.initLat, this.initLng),
          zoom:this.initZoom,
          //mapTypeId:google.maps.MapTypeId.ROADMAP
      }
      map.setOptions(options)
      this.map = map;
      this.refresh()
  }

  ngOnInit() {
      this.mapService.currentMessage.subscribe(message => this.message = message)
      console.log('mapComponent.ngOnInit')

      if (this.data.storage) {
          this.imei = this.data.storage.imei
          if (this.data.storage.dateFrom) this.timeFrom = moment(this.data.storage.dateFrom).utcOffset('+0000').add(-2, 'hours').toDate()
          if (this.data.storage.dateTo) this.timeTo = moment(this.data.storage.dateTo).utcOffset('+0000').add(-2, 'hours').toDate()
      }
      //this.getPlaces()
      //this.getRoute(this.timeFrom, this.timeTo, this.imei)
      //this.getTestPolygon()
      //this.getTestPolyline()
  }

  getPlaces() {
      return this.mapService.getPlaces().subscribe(results => {
        //console.log(results);
        this.markers = results;
      });
  }


  refresh() {
      if (this.data.storage.imei && this.timeFrom && this.timeTo) {
        let t1 = moment(this.timeFrom).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
        let t2 = moment(this.timeTo).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
        this.drawDataPanel(this.data.storage.imei, t1, t2)
      }
  }

  drawDataPanel(imei, timeFrom, timeTo) {
    var min_lat = null, min_lng = null, max_lat = null, max_lng = null;

    //clear
    if (this.path) this.path.forEach(item => {
       if (item) item.setMap(null);
    })
    if (this.rectangles) this.rectangles.forEach(item => {
        if (item) item.setMap(null);
    })

    //fill
    console.log('drawPathPolyline() (timeFrom, timeTo)', timeFrom, timeTo)
    return this.mapService.getPanelData(imei, timeFrom, timeTo).subscribe((results:PanelDataObj) => {
      var self = this;
      this.path = Object.keys(results.geolocs).map(function(index){
          let cur_lat = results.geolocs[+index][0]
          let cur_lng = results.geolocs[+index][1]
            //check/set bounds
          if (min_lat === null || cur_lat < min_lat) { min_lat = cur_lat; }
          if (min_lng === null || cur_lng < min_lng) { min_lng = cur_lng; }
          if (max_lat === null || cur_lat > max_lat) { max_lat = cur_lat; }
          if (max_lng === null || cur_lng > max_lng) { max_lng = cur_lng; }

          if (+index > 1) {
              let line = [
                {
                  lat: results.geolocs[+index-1][0],
                  lng: results.geolocs[+index-1][1]
                },
                {
                  lat: cur_lat,
                  lng: cur_lng
                }
              ]

              let color = self.utils.getSpeedColor(results.geolocs[+index][2])
              var polyline: google.maps.Polyline = new google.maps.Polyline({
                path: line,
                strokeColor: color,
                strokeOpacity: 0.9,
                strokeWeight: 6,
                fillColor: color,
                fillOpacity: 0.7
              });

              return polyline;
          }
      });

      //set map
      this.path.forEach(item => {
          if (item) item.setMap(this.map);
      })

      //rectangles
      if (results.type === "aggregated") {

          this.rectangles = Object.keys(results.geolocs).map(function(index){
              var rectangle = new google.maps.Rectangle({
                strokeColor: 'orange',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                /*fillColor: '#FF0000',*/
                fillOpacity: 0.02,
                bounds: {
                    north: results.geolocs[+index][4],
                    south: results.geolocs[+index][3],
                    east: results.geolocs[+index][6],
                    west: results.geolocs[+index][5]
                }
              })
              return rectangle;
          });

          //set map
          this.rectangles.forEach(item => {
              if (item) item.setMap(this.map);
          })
      }

      //set bouonds
      if (this.path.length > 0) {
          this.map.fitBounds(
              new google.maps.LatLngBounds(
                  new google.maps.LatLng(min_lat, min_lng),
                  new google.maps.LatLng(max_lat, max_lng)
              )
          )
      } else {
          this.message = "Brak danych w podanym okresie"
      }

    });
  }


  getTestPolygon() {
    return this.mapService.getTest().subscribe(results => {
      var testCoords = results;
      // var testCoords = [{"lat":51.1389,"lng":16.9517},{"lat":51.1238,"lng":16.8543},{"lat":51.1239,"lng":16.8538},{"lat":51.1243,"lng":16.8539},{"lat":51.1243,"lng":16.8544},{"lat":51.1174,"lng":17.4196}]
      // Construct the TEST polygon.
      if (google) {
        var testPolygon: google.maps.Polygon = new google.maps.Polygon({
          paths: testCoords,
          strokeColor: '#0000ff',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0000ff',
          fillOpacity: 0.35
        });
        testPolygon.setMap(this.map);
      } else {
        console.error('Variable google NOT set')
      }
    });
  }

}

