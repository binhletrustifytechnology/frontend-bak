import {Injectable, NgModule} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes} from "@angular/router";
import {Dashboard} from "@shared/models/dashboard.models";
import {Observable} from "rxjs";
import {DeviceComponent} from "@modules/home/components/device/device.component";
import {DeviceDetailsComponent} from "@modules/home/components/device-details/device-details.component";

@Injectable()
export class DashboardResolver implements Resolve<Dashboard> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Dashboard> | Promise<Dashboard> | Dashboard {
    return undefined;
  }

}

const routes: Routes = [
  {
    path: 'devices',
    component: DeviceComponent,
    data: {
      breadcrumb: {
        label: 'device.devices',
        icon: 'devices_other'
      }
    },
  },
  {
    path: 'devices/:id',
    component: DeviceDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [

  ]
})
export class DeviceRoutingModule {}
