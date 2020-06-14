import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  text : string = 'Home';
  lat: number = 51.136850;
  lng: number = 16.953648;
  zoom: number = 15;

  constructor() { }

  ngOnInit() {
  }

}
