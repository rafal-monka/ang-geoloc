import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component'
import { RoutesComponent } from './routes/routes.component'
import { WebsocketComponent } from './websocket/websocket.component';
import { DevicesComponent } from './devices/devices.component';


const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'devices', component: DevicesComponent },
  { path: 'ws', component:  WebsocketComponent},
  { path: '**', redirectTo: 'map' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
