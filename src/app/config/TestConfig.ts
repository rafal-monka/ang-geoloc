// https://github.com/SebastianM/angular-google-maps/issues/882

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'

export function testConfigFactory(http: HttpClient) {
    console.log('testConfigFactory')
    return () => [123]
    // return () => http.get(environment.host+"/user").pipe( //environment.host
    //       map(response => {
    //         console.log('userConfigFactory.response', response)
    //         data = response;
    //         return response;
    //     })
    //   ).toPromise();
}

