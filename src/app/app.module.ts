import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG, LazyMapsAPILoaderConfigLiteral } from '@agm/core';

import { agmConfigFactory } from './MapsConfig';
import { HttpClientModule, HttpClient} from '@angular/common/http';

import { MapComponent } from './map/map.component';

@NgModule({
   declarations: [
      AppComponent,
      MapComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      AgmCoreModule.forRoot({ apiKey: "NOT_SET"})
   ],
   providers: [{
      provide: APP_INITIALIZER,
      useFactory: agmConfigFactory,
      deps: [HttpClient, LAZY_MAPS_API_CONFIG],
      multi: true}
    ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
