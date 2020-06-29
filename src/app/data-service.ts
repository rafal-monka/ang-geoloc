import { Injectable } from '@angular/core';
import { DataObj } from './data-object';



@Injectable()
export class Data {

    public storage: DataObj;

    public constructor() {
        let obj = new DataObj;
        obj.imei = ''
        this.storage = obj
    }

}
