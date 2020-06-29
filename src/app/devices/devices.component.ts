import { Component, OnInit } from '@angular/core';
import { Data } from '../data-service';
import { MapService } from '../app-services';
import { ExtractDeviceModelPipe } from '../pipes.module';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  providers: [ MapService ]
})

export class DevicesComponent implements OnInit {
  imei: string
  devices: any /*Array<any> = [
    {imei: "357876082170434", name: "CAT41"},
    {imei: "353888064311575", name: "Sony"},
    {imei: "358240051111110", name: "Android AVD"}
  ]*/

  constructor(
    private modelPipe: ExtractDeviceModelPipe,
    private mapService: MapService,
    public data: Data
  ) { }

  ngOnInit() {
    this.getDevices()
  }

  chooseDevice(imei) {
    console.log('chooseDevice')
    this.data.storage.imei = imei
  }

  getDevices() {
    return this.mapService.getDevices().subscribe(results => {
      //console.log(this.modelPipe.transform(results[3].description))
      this.devices = results
    })
  }
}
