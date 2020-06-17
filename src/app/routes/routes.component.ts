import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from '../app-services';
import { Data } from '../data-service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
  providers: [ MapService ]
})
export class RoutesComponent implements OnInit {
  routes: any
  filteredRoutes: any;

  filterText: string = '';

  constructor(
    private mapService: MapService,
    private router: Router,
    private data: Data) { }

  filterRoutes() {
      let filterText = this.filterText.toLowerCase()
      this.filteredRoutes = this.routes.filter(element => {
          return element.name.toLowerCase().indexOf(filterText) > -1
      })
  }

  getRoutes() {
      return this.mapService.getRoutes(this.data.storage.imei).subscribe(results => {
          this.filteredRoutes = results;
          this.routes = results;
      });
  }

  chooseRoute(route) {
      console.log("route", route)
      //this.mapService.changeMessage("Hello from Sibling")
      this.data.storage.datefrom = route.datefrom
      this.data.storage.dateto = route.dateto
      this.data.storage.name = route.name
      this.router.navigateByUrl('map');
  }

  ngOnInit() {
      this.getRoutes()
  }

}


/*
          let tmp = Object.keys(results).filter(e => {
              console.log(e)
              return e
          }).reduce((obj, key) => {
    return {
      ...obj,
      [key]: raw[key]
    };
  }, {});
          console.log('tmp.length', tmp[0])
          */
