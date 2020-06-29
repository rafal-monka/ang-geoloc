import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'deviceModel' })
export class ExtractDeviceModelPipe implements PipeTransform {
  transform(text: string): string {
    if (text) {
      let manufacturer= text.match(new RegExp('(?<=MANUFACTURER=)(.*?)(?=,)', 'g'))
      let device = text.match(new RegExp('(?<=DEVICE=)(.*?)(?=,)','g')).toString()
      return (manufacturer ? manufacturer.toString():'UNKNOWN???') + (device ? ' '+device.toString():'UNKNOWN???');
    } else {
      return text;
    }
  }
}
