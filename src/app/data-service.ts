import { Injectable } from '@angular/core';
import { DataObj } from './data-object';

const CATS41_IMEI: string = "357876082170434"
const VS_AVD_IMEI : string = "358240051111110"

@Injectable()
export class Data {

    public storage: DataObj;

    public constructor() {
        let obj = new DataObj;
        obj.imei = CATS41_IMEI
        this.storage = obj
    }

}
