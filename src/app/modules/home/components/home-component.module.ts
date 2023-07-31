import {NgModule} from "@angular/core";
import {RouterTabsComponent} from "@modules/home/components/router-tabs.component";
import {DeviceComponent} from "@modules/home/components/device/device.component";

@NgModule({
  declarations:[
    RouterTabsComponent,
  ],
  imports: [

  ],
  exports: [
    RouterTabsComponent
  ]
})
export class HomeComponentModule{}
