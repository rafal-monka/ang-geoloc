import { Injectable } from '@angular/core';
import { DataObj } from './data-object';

const CATS41_IMEI: string = "357876082170434"

@Injectable()
export class Data {

    public storage: DataObj;

    public constructor() {
        let obj = new DataObj;
        obj.imei = CATS41_IMEI
        this.storage = obj
    }

}
