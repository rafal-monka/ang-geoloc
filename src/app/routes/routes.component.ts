import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
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
    public data: Data) { }

  ngOnInit() {
      this.getRoutes()
      if (this.data.storage) {
        if (this.data.storage.routeFilterText) this.filterText = this.data.storage.routeFilterText
      }
  }

  filterRoutes() {
      this.data.storage.routeFilterText = this.filterText
      let filterText = this.filterText.toLowerCase()
      this.filteredRoutes = this.routes.filter(element => {
          return element.name.toLowerCase().indexOf(filterText) > -1
      })
  }

  getRoutes() {
      return this.mapService.getRoutes(this.data.storage.imei).subscribe(results => {
          this.routes = Object.keys(results).map(function(index){
              let today  = new Date()
              let day = new Date(results[index].dateto)
              let days_ago = Math.floor((today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24))
              let obj = {
                  name: results[index].name,
                  datefrom: results[index].datefrom,
                  dateto: results[index].dateto,
                  days_ago: days_ago,
                  day: moment(day).add(-2, 'hours').format('MMMM DD, YYYY, HH:mm')
              }
              return obj;
          })
          this.filterRoutes();
      });
  }

  chooseRoute(route) {
      //this.mapService.changeMessage("Hello from Sibling")
      this.data.storage.dateFrom = route.datefrom
      this.data.storage.dateTo = route.dateto
      this.data.storage.name = route.name
      this.router.navigateByUrl('map');
  }



}

