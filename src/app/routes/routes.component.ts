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
          this.routes = results;
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

