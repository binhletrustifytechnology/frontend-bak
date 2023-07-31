import {NgModule} from "@angular/core";
import {DashboardRoutingModule} from "@modules/home/pages/dashboard/dashboard-routing.module";
import {HomeComponentModule} from "@modules/home/components/home-component.module";
import {SharedModule} from "@shared/shared.module";
import {CommonModule} from "@angular/common";
import {LineChartComponent} from "@modules/home/components/dashboard/line-chart/line-chart.component";
import {DashboardComponent} from "@modules/home/components/dashboard/dashboard.component";
import {MarketChartComponent} from "@modules/home/components/dashboard/market-chart/market-chart.component";
import {RadarChartComponent} from "@modules/home/components/dashboard/radar-chart/radar-chart.component";
import {Dashboard2Component} from "@modules/home/components/dashboard2/dashboard2.component";
import {CdkDragDropHandleExample} from "@modules/home/components/drag-drop/drag-drop.component";
import {Dashboard3Component} from "@modules/home/components/dashboard3/dashboard3.component";
import {ResizeDirective} from "@core/directives/resize.directive";

@NgModule({
  declarations:[
    LineChartComponent,
    MarketChartComponent,
    RadarChartComponent,
    DashboardComponent,
    Dashboard2Component,
    Dashboard3Component,
    CdkDragDropHandleExample,
    ResizeDirective
  ],
  imports: [
    SharedModule,
    CommonModule,
    HomeComponentModule,
    // LineChartModule,
    DashboardRoutingModule,
  ]
})
export class DashboardModule {}
