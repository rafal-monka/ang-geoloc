import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG, GoogleMapsAPIWrapper } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RoutesComponent } from './routes/routes.component';
import { Data } from "./data-service";
import { agmConfigFactory } from './config/MapsConfig';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';//https://www.syncfusion.com/kb/11174/how-to-get-started-easily-with-syncfusion-angular-9-datetimepicker
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
   declarations: [
      AppComponent,
      MapComponent,
      RoutesComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      AgmCoreModule.forRoot({
        apiKey: "TO_SET_FROM_DATABASE",
        libraries: ['places', 'drawing', 'geometry']
      }),
      //NoopAnimationsModule,
      NgbModule,
      DateTimePickerModule
   ],
   providers: [{
      provide: APP_INITIALIZER,
      useFactory: agmConfigFactory,
      deps: [HttpClient, LAZY_MAPS_API_CONFIG],
      multi: true},
      Data
      //GoogleMapsAPIWrapper /*Note: declare var google*/
    ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
