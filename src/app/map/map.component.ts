import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {} from '@agm/core/services/google-maps-types';
import * as moment from 'moment';

import { MapService } from '../app-services';
import { Utils } from '../utils';
import { Data } from '../data-service';

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

  message:string;
  route: any;
  constructor(
    private mapService: MapService,
    private utils: Utils,
    private router: Router,
    public data: Data
  ) { }

  markers: any;
  polylines: any;

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
// console.log('map.ngOnInit (this.data.storage)', this.data.storage)
          if (this.data.storage.datefrom) this.timeFrom = moment(this.data.storage.datefrom).utcOffset('+0000').add(-2, 'hours').toDate()
          if (this.data.storage.dateto) this.timeTo = moment(this.data.storage.dateto).utcOffset('+0000').add(-2, 'hours').toDate()
          console.log('map.ngOnInit (this.timeFrom, this.timeTo)', this.timeFrom, this.timeTo)
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


  // getPath(timeFrom: String, timeTo: String, imei: String) {

  //     return this.mapService.getPath(timeFrom, timeTo, imei).subscribe(results => {
  //         this.polylines = results;
  //     });;
  // }


  refresh() {
// console.log("refresh()")
      if (this.data.storage.imei && this.timeFrom && this.timeTo) {
// console.log('refresh(), this.timeFrom2=',this.timeFrom2)
// console.log('refresh(), this.timeTo2=',this.timeTo2)
        let t1 = moment(this.timeFrom).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
        let t2 = moment(this.timeTo).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
// console.log('after conversion - refresh(), t1=',t1)
// console.log('after conversion - refresh(), t2=',t2)
// console.log('...###drawPathPolyline...')
        this.drawPathPolyline(this.data.storage.imei, t1, t2)
      }
  }

  drawPathPolyline(imei, timeFrom, timeTo) {
// console.log("drawPathPolyline()")
    var min_lat = null, min_lng = null, max_lat = null, max_lng = null;

    //clear
    if (this.path) this.path.forEach(item => {
       if (item) item.setMap(null);
    })

    //fill
    console.log('drawPathPolyline() (timeFrom, timeTo)', timeFrom, timeTo)
    return this.mapService.getPath(timeFrom, timeTo, imei).subscribe(results => {
      var self = this;
      this.path = Object.keys(results).map(function(index){
          let cur_lat = results[+index][0]
          let cur_lng = results[+index][1]
            //check/set bounds
          if (min_lat === null || cur_lat < min_lat) { min_lat = cur_lat; }
          if (min_lng === null || cur_lng < min_lng) { min_lng = cur_lng; }
          if (max_lat === null || cur_lat > max_lat) { max_lat = cur_lat; }
          if (max_lng === null || cur_lng > max_lng) { max_lng = cur_lng; }

          if (+index > 1) {
              let line = [
                {
                  lat: results[+index-1][0],
                  lng: results[+index-1][1]
                },
                {
                  lat: cur_lat,
                  lng: cur_lng
                }
              ]

              let color = self.utils.getSpeedColor(results[+index][2])
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



//-------------
// //center
// if (this.path && this.path.length>0) {
//   let lastPosition = this.path[this.path.length-1].getPath().getArray()[1];
//   this.map.setCenter(lastPosition)
// }
