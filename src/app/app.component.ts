import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ang-geoloc';
  links = [
    { title: 'Map', path: 'map' },
    { title: 'Routes', path: 'routes' },
    { title: 'Devices', path: 'devices' },
    { title: 'WS', path: 'ws' }
  ];

  constructor(
    public route: ActivatedRoute) {}
}
