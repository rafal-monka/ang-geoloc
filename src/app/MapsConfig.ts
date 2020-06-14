import {Injectable} from "@angular/core";
import {LazyMapsAPILoaderConfigLiteral} from "@agm/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from '../environments/environment'

export function agmConfigFactory(http: HttpClient, config: LazyMapsAPILoaderConfigLiteral) {
    return () => http.get<{key: string}>(environment.host+"/api/apikey/gmaps").pipe(
          map(response => {
            config.apiKey = response.key;
            return response;
        })
      ).toPromise();
}

