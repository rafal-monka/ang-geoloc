import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG, GoogleMapsAPIWrapper } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RoutesComponent } from './routes/routes.component';
import { Data } from "./data-service";
import { agmConfigFactory } from './config/MapsConfig';
import { testConfigFactory } from './config/TestConfig';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';//https://www.syncfusion.com/kb/11174/how-to-get-started-easily-with-syncfusion-angular-9-datetimepicker
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WebsocketComponent } from './websocket/websocket.component';
import { DevicesComponent } from './devices/devices.component';
import { ExtractDeviceModelPipe } from './pipes.module';

@NgModule({
   declarations: [
      AppComponent,
      MapComponent,
      RoutesComponent,
      WebsocketComponent,
      DevicesComponent,
      ExtractDeviceModelPipe
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      AgmCoreModule.forRoot({
        apiKey: 'TO_SET_FROM_DATABASE by provider agmConfigFactory',
        libraries: ['places', 'drawing', 'geometry']
      }),
      //NoopAnimationsModule,
      NgbModule,
      DateTimePickerModule
   ],
   providers: [ {
        provide: APP_INITIALIZER,
        useFactory: agmConfigFactory,
        deps: [HttpClient, LAZY_MAPS_API_CONFIG],
        multi: true
      },
      {
        provide: APP_INITIALIZER,
        useFactory: testConfigFactory,
        deps: [HttpClient],
        multi: true
      },
      Data,
      ExtractDeviceModelPipe
      //GoogleMapsAPIWrapper
    ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
