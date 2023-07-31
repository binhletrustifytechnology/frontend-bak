import {NgModule} from "@angular/core";
import {DeviceRoutingModule} from "@modules/home/pages/device/device-routing.module";
import {SharedModule} from "@shared/shared.module";
import {CommonModule} from "@angular/common";
import {DeviceComponent} from "@modules/home/components/device/device.component";
import {DevicesService} from "@core/services/devices.service";
import {DeviceDetailsComponent} from "@modules/home/components/device-details/device-details.component";

@NgModule({
  declarations: [
    DeviceComponent,
    DeviceDetailsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    DeviceRoutingModule
  ],
  providers: [
    DevicesService
  ]
})
export class DeviceModule{}
