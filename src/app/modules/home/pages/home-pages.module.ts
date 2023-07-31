import {NgModule} from "@angular/core";
import {DashboardModule} from "@modules/home/pages/dashboard/dashboard.module";
import {DeviceModule} from "@modules/home/pages/device/device.module";
import {CdkDragDropHandleExample} from "@modules/home/components/drag-drop/drag-drop.component";

@NgModule({
  declarations: [
  ],
  exports: [
    DashboardModule,
    DeviceModule,
  ],
  imports: [
  ]
})
export class HomePagesModule {
}
